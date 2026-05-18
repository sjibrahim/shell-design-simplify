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
  const { phone, name, password, balance = 0, status = 'active' } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'phone required' });
  const hash = password ? await bcrypt.hash(password, 10) : null;
  try {
    const [r] = await pool.query(
      'INSERT INTO users (phone, name, password_hash, balance, status) VALUES (?,?,?,?,?)',
      [phone, name || null, hash, balance, status]
    );
    res.json({ ok: true, id: r.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Phone already exists' });
    throw e;
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { name, balance, vip_level, status, password } = req.body || {};
  const fields = []; const params = [];
  if (name !== undefined)      { fields.push('name = ?');      params.push(name); }
  if (balance !== undefined)   { fields.push('balance = ?');   params.push(balance); }
  if (vip_level !== undefined) { fields.push('vip_level = ?'); params.push(vip_level); }
  if (status !== undefined)    { fields.push('status = ?');    params.push(status); }
  if (password)                { fields.push('password_hash = ?'); params.push(await bcrypt.hash(password, 10)); }
  if (!fields.length) return res.status(400).json({ error: 'No fields' });
  params.push(req.params.id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ ok: true });
});

// DELETE
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
