// Admin endpoints for recharges & withdrawals.
// Overrides plain CRUD so that approving/failing a record
// applies the correct wallet effects atomically.
const express = require('express');
const pool = require('../db');
const { authRequired } = require('../middleware/auth');
const { paginate } = require('../middleware/helpers');

// --- Recharges ---
const recharges = express.Router();
recharges.use(authRequired);

recharges.get('/', async (req, res) => {
  const { page, limit, offset } = paginate(req);
  const where = []; const params = [];
  for (const c of ['status', 'gateway', 'user_id']) {
    if (req.query[c]) { where.push(`r.${c} = ?`); params.push(req.query[c]); }
  }
  const q = (req.query.q || '').trim();
  if (q) { where.push('(r.gateway LIKE ? OR r.ref_no LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
  const W = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) total FROM recharges r ${W}`, params);
  const [items] = await pool.query(
    `SELECT r.*, u.phone AS user_phone, u.name AS user_name
       FROM recharges r LEFT JOIN users u ON u.id = r.user_id
       ${W} ORDER BY r.id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  res.json({ ok: true, total, page, limit, items });
});

recharges.post('/', async (req, res) => {
  const { user_id, amount, gateway, ref_no, status, note } = req.body || {};
  if (!user_id || !amount) return res.status(400).json({ error: 'user_id and amount required' });
  const [r] = await pool.query(
    'INSERT INTO recharges (user_id, amount, gateway, ref_no, status, note) VALUES (?,?,?,?,?,?)',
    [user_id, amount, gateway || 'Manual', ref_no || null, status || 'pending', note || null]
  );
  res.json({ ok: true, id: r.insertId });
});

recharges.put('/:id', async (req, res) => {
  const id = req.params.id;
  const [[cur]] = await pool.query('SELECT * FROM recharges WHERE id = ? FOR UPDATE', [id]).then(r => [r[0] ? r : [null]]).catch(() => [[null]]);
  // Re-query simply (without FOR UPDATE complication)
  const [rows] = await pool.query('SELECT * FROM recharges WHERE id = ?', [id]);
  const row = rows[0];
  if (!row) return res.status(404).json({ error: 'Not found' });

  const newStatus = req.body.status || row.status;
  const newAmount = req.body.amount !== undefined ? Number(req.body.amount) : Number(row.amount);
  const newRef = req.body.ref_no !== undefined ? req.body.ref_no : row.ref_no;
  const newGateway = req.body.gateway !== undefined ? req.body.gateway : row.gateway;
  const newNote = req.body.note !== undefined ? req.body.note : row.note;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'UPDATE recharges SET status=?, amount=?, ref_no=?, gateway=?, note=? WHERE id=?',
      [newStatus, newAmount, newRef, newGateway, newNote, id]
    );
    // Was previously pending/processing -> now success: credit wallet
    const wasOpen = ['pending', 'processing'].includes(row.status);
    if (wasOpen && newStatus === 'success') {
      await conn.query(
        'UPDATE users SET balance = balance + ?, total_recharge = total_recharge + ? WHERE id = ?',
        [newAmount, newAmount, row.user_id]
      );
      await conn.query(
        `UPDATE transactions SET status='success', amount=?
           WHERE user_id=? AND type='recharge' AND note=? LIMIT 1`,
        [newAmount, row.user_id, `Recharge #${id}`]
      );
    }
    // Open -> failed: mark transaction failed (no wallet change)
    if (wasOpen && newStatus === 'failed') {
      await conn.query(
        `UPDATE transactions SET status='failed' WHERE user_id=? AND type='recharge' AND note=? LIMIT 1`,
        [row.user_id, `Recharge #${id}`]
      );
    }
    await conn.commit();
    res.json({ ok: true });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

recharges.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM recharges WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// --- Withdrawals ---
const withdrawals = express.Router();
withdrawals.use(authRequired);

withdrawals.get('/', async (req, res) => {
  const { page, limit, offset } = paginate(req);
  const where = []; const params = [];
  for (const c of ['status', 'channel', 'user_id']) {
    if (req.query[c]) { where.push(`w.${c} = ?`); params.push(req.query[c]); }
  }
  const q = (req.query.q || '').trim();
  if (q) {
    where.push('(w.account_no LIKE ? OR w.account_name LIKE ? OR w.ref_no LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const W = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) total FROM withdrawals w ${W}`, params);
  const [items] = await pool.query(
    `SELECT w.*, u.phone AS user_phone, u.name AS user_name
       FROM withdrawals w LEFT JOIN users u ON u.id = w.user_id
       ${W} ORDER BY w.id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  res.json({ ok: true, total, page, limit, items });
});

withdrawals.post('/', async (req, res) => {
  const { user_id, amount, channel, account_no, account_name, status, ref_no, note } = req.body || {};
  if (!user_id || !amount) return res.status(400).json({ error: 'user_id and amount required' });
  const fee = +(Number(amount) * 0.05).toFixed(2);
  const net = +(Number(amount) - fee).toFixed(2);
  const [r] = await pool.query(
    'INSERT INTO withdrawals (user_id, amount, fee, net_amount, channel, account_no, account_name, status, ref_no, note) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [user_id, amount, fee, net, channel || 'GCash', account_no || '', account_name || null, status || 'pending', ref_no || null, note || null]
  );
  res.json({ ok: true, id: r.insertId });
});

withdrawals.put('/:id', async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query('SELECT * FROM withdrawals WHERE id = ?', [id]);
  const row = rows[0];
  if (!row) return res.status(404).json({ error: 'Not found' });

  const newStatus = req.body.status || row.status;
  const newRef = req.body.ref_no !== undefined ? req.body.ref_no : row.ref_no;
  const newNote = req.body.note !== undefined ? req.body.note : row.note;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'UPDATE withdrawals SET status=?, ref_no=?, note=? WHERE id=?',
      [newStatus, newRef, newNote, id]
    );
    const wasOpen = ['pending', 'processing'].includes(row.status);
    // Mark paid out -> transaction success (balance already deducted at request time)
    if (wasOpen && newStatus === 'success') {
      await conn.query(
        `UPDATE transactions SET status='success' WHERE user_id=? AND type='withdraw' AND note=? LIMIT 1`,
        [row.user_id, `Withdraw #${id}`]
      );
    }
    // Failed -> refund the user's wallet (return the full amount)
    if (wasOpen && newStatus === 'failed') {
      await conn.query(
        'UPDATE users SET balance = balance + ?, total_withdraw = GREATEST(total_withdraw - ?, 0) WHERE id = ?',
        [row.amount, row.amount, row.user_id]
      );
      await conn.query(
        `UPDATE transactions SET status='failed' WHERE user_id=? AND type='withdraw' AND note=? LIMIT 1`,
        [row.user_id, `Withdraw #${id}`]
      );
    }
    await conn.commit();
    res.json({ ok: true });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

withdrawals.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM withdrawals WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = { recharges, withdrawals };
