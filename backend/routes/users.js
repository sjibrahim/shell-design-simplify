const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { authRequired } = require('../middleware/auth');
const { paginate } = require('../middleware/helpers');

const router = express.Router();
router.use(authRequired);

// LIST
router.get('/', async (req, res) => {
  const { page, limit, offset } = paginate(req);
  const status = req.query.status; // active | inactive | blocked | undefined
  const q = (req.query.q || '').trim();

  const where = [];
  const params = [];
  if (status && ['active','inactive','blocked'].includes(status)) {
    where.push('status = ?'); params.push(status);
  }
  if (q) {
    where.push('(phone LIKE ? OR name LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }
  const W = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) total FROM users ${W}`, params);
  const [rows] = await pool.query(
    `SELECT id, phone, name, balance, total_recharge, total_withdraw, total_income,
            referrer_id, vip_level, status, created_at
     FROM users ${W}
     ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  res.json({ ok: true, total, page, limit, items: rows });
});

// CREATE
router.post('/', async (req, res) => {
  const { phone, name, password, balance = 0, status = 'active', vip_level = 0, referral_code } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'phone required' });
  const hash = password ? await bcrypt.hash(password, 10) : null;
  try {
    const [r] = await pool.query(
      'INSERT INTO users (phone, name, password_hash, balance, status, vip_level, referral_code) VALUES (?,?,?,?,?,?,?)',
      [phone, name || null, hash, balance, status, vip_level, referral_code || null]
    );
    if (!referral_code) await pool.query('UPDATE users SET referral_code = ? WHERE id = ?', [`SHELL${r.insertId.toString(36).toUpperCase()}`.slice(0, 12), r.insertId]);
    res.json({ ok: true, id: r.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Phone already exists' });
    throw e;
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { name, phone, balance, vip_level, status, password, referral_code, withdraw_channel, withdraw_account_no, withdraw_account_name } = req.body || {};
  const fields = []; const params = [];
  if (name !== undefined)      { fields.push('name = ?');      params.push(name); }
  if (phone !== undefined)     { fields.push('phone = ?');     params.push(phone); }
  if (balance !== undefined)   { fields.push('balance = ?');   params.push(balance); }
  if (vip_level !== undefined) { fields.push('vip_level = ?'); params.push(vip_level); }
  if (status !== undefined)    { fields.push('status = ?');    params.push(status); }
  if (referral_code !== undefined) { fields.push('referral_code = ?'); params.push(referral_code || null); }
  if (withdraw_channel !== undefined) { fields.push('withdraw_channel = ?'); params.push(withdraw_channel || null); }
  if (withdraw_account_no !== undefined) { fields.push('withdraw_account_no = ?'); params.push(withdraw_account_no || null); }
  if (withdraw_account_name !== undefined) { fields.push('withdraw_account_name = ?'); params.push(withdraw_account_name || null); }
  if (password)                { fields.push('password_hash = ?'); params.push(await bcrypt.hash(password, 10)); }
  if (!fields.length) return res.status(400).json({ error: 'No fields' });
  params.push(req.params.id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ ok: true });
});

router.get('/:id/profile', async (req, res) => {
  const id = req.params.id;
  const [users] = await pool.query(
    `SELECT id, phone, name, balance, total_recharge, total_withdraw, total_income,
            referrer_id, referral_code, vip_level, status, withdraw_channel,
            withdraw_account_no, withdraw_account_name, created_at
       FROM users WHERE id = ? LIMIT 1`, [id]
  );
  if (!users[0]) return res.status(404).json({ error: 'User not found' });
  const [plans] = await pool.query(
    `SELECT up.*, p.name AS plan_name FROM user_plans up LEFT JOIN plans p ON p.id = up.plan_id
      WHERE up.user_id = ? ORDER BY up.id DESC LIMIT 50`, [id]
  );
  const [transactions] = await pool.query('SELECT id, type, amount, status, note, created_at FROM transactions WHERE user_id = ? ORDER BY id DESC LIMIT 50', [id]);
  const [recharges] = await pool.query('SELECT id, amount, gateway, status, ref_no, created_at FROM recharges WHERE user_id = ? ORDER BY id DESC LIMIT 20', [id]);
  const [withdrawals] = await pool.query('SELECT id, amount, fee, net_amount, channel, account_no, account_name, status, ref_no, created_at FROM withdrawals WHERE user_id = ? ORDER BY id DESC LIMIT 20', [id]);
  res.json({ ok: true, user: users[0], plans, transactions, recharges, withdrawals });
});

router.get('/:id/team', async (req, res) => {
  const root = Number(req.params.id);
  const select = 'SELECT id, phone, name, total_recharge, status, created_at, referrer_id FROM users';
  const [l1] = await pool.query(`${select} WHERE referrer_id = ? ORDER BY id DESC`, [root]);
  const l1ids = l1.map(u => u.id);
  let l2 = [];
  let l3 = [];
  if (l1ids.length) {
    const [r2] = await pool.query(`${select} WHERE referrer_id IN (${l1ids.map(() => '?').join(',')}) ORDER BY id DESC`, l1ids);
    l2 = r2;
    const l2ids = l2.map(u => u.id);
    if (l2ids.length) {
      const [r3] = await pool.query(`${select} WHERE referrer_id IN (${l2ids.map(() => '?').join(',')}) ORDER BY id DESC`, l2ids);
      l3 = r3;
    }
  }
  const sum = arr => arr.reduce((s, u) => s + Number(u.total_recharge || 0), 0);
  const withLevel = (arr, level) => arr.map(u => ({ ...u, level }));
  res.json({ ok: true, stats: [
    { level: 1, count: l1.length, recharge: sum(l1) },
    { level: 2, count: l2.length, recharge: sum(l2) },
    { level: 3, count: l3.length, recharge: sum(l3) },
  ], members: [...withLevel(l1, 1), ...withLevel(l2, 2), ...withLevel(l3, 3)] });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
