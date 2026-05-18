// Reusable simple CRUD factory for tabular resources
const express = require('express');
const pool = require('../db');
const { authRequired } = require('../middleware/auth');
const { paginate } = require('../middleware/helpers');

/**
 * @param {object} opts
 * @param {string} opts.table
 * @param {string[]} opts.columns           full column list (returned + insertable)
 * @param {string[]} [opts.searchCols]      columns searched by ?q=
 * @param {string[]} [opts.filterCols]      columns filterable via query string (=)
 * @param {string}   [opts.orderBy]         default ORDER BY (e.g. 'id DESC')
 */
function crud(opts) {
  const router = express.Router();
  router.use(authRequired);
  const T = opts.table;
  const cols = opts.columns;
  const searchCols = opts.searchCols || [];
  const filterCols = opts.filterCols || [];
  const orderBy = opts.orderBy || 'id DESC';

  router.get('/', async (req, res) => {
    const { page, limit, offset } = paginate(req);
    const where = []; const params = [];
    for (const c of filterCols) {
      if (req.query[c] !== undefined && req.query[c] !== '') {
        where.push(`${c} = ?`); params.push(req.query[c]);
      }
    }
    const q = (req.query.q || '').trim();
    if (q && searchCols.length) {
      where.push('(' + searchCols.map(c => `${c} LIKE ?`).join(' OR ') + ')');
      for (const _ of searchCols) params.push(`%${q}%`);
    }
    const W = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) total FROM ${T} ${W}`, params);
    const [items] = await pool.query(
      `SELECT * FROM ${T} ${W} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json({ ok: true, total, page, limit, items });
  });

  router.post('/', async (req, res) => {
    const data = {};
    for (const c of cols) if (req.body[c] !== undefined) data[c] = req.body[c];
    const keys = Object.keys(data);
    if (!keys.length) return res.status(400).json({ error: 'No fields' });
    const placeholders = keys.map(() => '?').join(',');
    const [r] = await pool.query(
      `INSERT INTO ${T} (${keys.join(',')}) VALUES (${placeholders})`,
      keys.map(k => data[k])
    );
    res.json({ ok: true, id: r.insertId });
  });

  router.put('/:id', async (req, res) => {
    const fields = []; const params = [];
    for (const c of cols) if (req.body[c] !== undefined) { fields.push(`${c} = ?`); params.push(req.body[c]); }
    if (!fields.length) return res.status(400).json({ error: 'No fields' });
    params.push(req.params.id);
    await pool.query(`UPDATE ${T} SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ ok: true });
  });

  router.delete('/:id', async (req, res) => {
    await pool.query(`DELETE FROM ${T} WHERE id = ?`, [req.params.id]);
    res.json({ ok: true });
  });

  return router;
}

module.exports = crud;
