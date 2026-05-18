const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { sign, authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
  const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
  const admin = rows[0];
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
  const okPw = await bcrypt.compare(password, admin.password_hash);
  if (!okPw) return res.status(401).json({ error: 'Invalid credentials' });
  const token = sign({ id: admin.id, email: admin.email, role: admin.role });
  res.json({
    ok: true,
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  });
});

router.get('/me', authRequired, async (req, res) => {
  const [rows] = await pool.query('SELECT id, email, name, role, created_at FROM admins WHERE id = ?', [req.admin.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, admin: rows[0] });
});

router.post('/change-password', authRequired, async (req, res) => {
  const { current, next } = req.body || {};
  if (!current || !next || next.length < 6) return res.status(400).json({ error: 'Invalid passwords' });
  const [rows] = await pool.query('SELECT password_hash FROM admins WHERE id = ?', [req.admin.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  const okPw = await bcrypt.compare(current, rows[0].password_hash);
  if (!okPw) return res.status(401).json({ error: 'Current password incorrect' });
  const hash = await bcrypt.hash(next, 10);
  await pool.query('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, req.admin.id]);
  res.json({ ok: true });
});

module.exports = router;
