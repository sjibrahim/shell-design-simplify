const express = require('express');
const pool = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT k, v FROM settings');
  const obj = {};
  rows.forEach(r => { obj[r.k] = r.v; });
  res.json({ ok: true, settings: obj });
});

router.put('/', async (req, res) => {
  const updates = req.body || {};
  const entries = Object.entries(updates);
  if (!entries.length) return res.status(400).json({ error: 'Empty payload' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const [k, v] of entries) {
      await conn.query(
        'INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)',
        [k, String(v ?? '')]
      );
    }
    await conn.commit();
    res.json({ ok: true, updated: entries.length });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally { conn.release(); }
});

module.exports = router;
