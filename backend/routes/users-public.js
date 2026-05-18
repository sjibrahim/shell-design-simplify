const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// ===== JWT helpers (user-scope) =====
function signUser(u) {
  return jwt.sign({ uid: u.id, phone: u.phone, kind: 'user' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
}
function userAuth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const tok = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!tok) return res.status(401).json({ error: 'No token' });
  try {
    const dec = jwt.verify(tok, process.env.JWT_SECRET);
    if (dec.kind !== 'user') return res.status(401).json({ error: 'Bad token' });
    req.uid = dec.uid;
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
}

function genRefCode(id) {
  const base = (id || Math.floor(Math.random() * 9e5) + 1e5).toString(36).toUpperCase();
  return ('SHELL' + base).slice(0, 12);
}

async function pickUser(id) {
  const [r] = await pool.query(
    `SELECT id, phone, name, balance, total_recharge, total_withdraw, total_income,
            referrer_id, referral_code, vip_level, status,
            withdraw_channel, withdraw_account_no, withdraw_account_name, created_at
       FROM users WHERE id = ? LIMIT 1`, [id]);
  return r[0] || null;
}

// ===== Auth =====
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, referral_code } = req.body || {};
    if (!phone || !password || password.length < 4) return res.status(400).json({ error: 'Phone & password (min 4) required' });
    const [exists] = await pool.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (exists[0]) return res.status(409).json({ error: 'Phone already registered' });
    let referrer_id = null;
    if (referral_code) {
      const [rr] = await pool.query('SELECT id FROM users WHERE referral_code = ?', [referral_code]);
      if (rr[0]) referrer_id = rr[0].id;
    }
    const hash = await bcrypt.hash(password, 10);
    const [ins] = await pool.query(
      'INSERT INTO users (phone, name, password_hash, referrer_id, referral_code) VALUES (?,?,?,?,?)',
      [phone, name || null, hash, referrer_id, null]
    );
    const code = genRefCode(ins.insertId);
    await pool.query('UPDATE users SET referral_code = ? WHERE id = ?', [code, ins.insertId]);
    const user = await pickUser(ins.insertId);
    return res.json({ ok: true, token: signUser(user), user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body || {};
    if (!phone || !password) return res.status(400).json({ error: 'Phone & password required' });
    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ? LIMIT 1', [phone]);
    const u = rows[0];
    if (!u || !u.password_hash) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    if (u.status === 'blocked') return res.status(403).json({ error: 'Account blocked' });
    const user = await pickUser(u.id);
    return res.json({ ok: true, token: signUser(user), user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/me', userAuth, async (req, res) => {
  const user = await pickUser(req.uid);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, user });
});

router.put('/me', userAuth, async (req, res) => {
  const { name, withdraw_channel, withdraw_account_no, withdraw_account_name } = req.body || {};
  await pool.query(
    `UPDATE users SET name = COALESCE(?, name),
       withdraw_channel = COALESCE(?, withdraw_channel),
       withdraw_account_no = COALESCE(?, withdraw_account_no),
       withdraw_account_name = COALESCE(?, withdraw_account_name)
     WHERE id = ?`,
    [name ?? null, withdraw_channel ?? null, withdraw_account_no ?? null, withdraw_account_name ?? null, req.uid]
  );
  res.json({ ok: true, user: await pickUser(req.uid) });
});

router.post('/change-password', userAuth, async (req, res) => {
  const { current, next } = req.body || {};
  if (!current || !next || next.length < 4) return res.status(400).json({ error: 'Invalid passwords' });
  const [r] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.uid]);
  if (!r[0]) return res.status(404).json({ error: 'Not found' });
  if (!(await bcrypt.compare(current, r[0].password_hash))) return res.status(401).json({ error: 'Current password wrong' });
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [await bcrypt.hash(next, 10), req.uid]);
  res.json({ ok: true });
});

// ===== Plans (public list) =====
router.get('/plans', async (req, res) => {
  const { type } = req.query;
  const params = [];
  let sql = 'SELECT id, name, type, price, daily_income, total_days, total_income, image_url FROM plans WHERE active = 1';
  if (type === 'normal' || type === 'vip') { sql += ' AND type = ?'; params.push(type); }
  sql += ' ORDER BY price ASC';
  const [rows] = await pool.query(sql, params);
  res.json({ ok: true, items: rows });
});

// ===== Gateways (active, for recharge / withdraw selection) =====
router.get('/gateways', async (req, res) => {
  const type = req.query.type === 'withdraw' ? 'withdraw' : 'recharge';
  const [rows] = await pool.query('SELECT id, name, title, min_amount, max_amount FROM gateways WHERE active = 1 AND type = ? ORDER BY id', [type]);
  res.json({ ok: true, items: rows });
});

// ===== Wallet ops =====
router.post('/recharge', userAuth, async (req, res) => {
  const { amount, gateway } = req.body || {};
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ error: 'Invalid amount' });
  const gw = gateway || 'WatchPay';
  const [ins] = await pool.query(
    'INSERT INTO recharges (user_id, amount, gateway, status) VALUES (?,?,?,?)',
    [req.uid, amt, gw, 'pending']
  );
  await pool.query(
    'INSERT INTO transactions (user_id, type, amount, status, note) VALUES (?,?,?,?,?)',
    [req.uid, 'recharge', amt, 'pending', `Recharge #${ins.insertId}`]
  );

  // Try to initialise online checkout for supported gateways
  let pay_url = null;
  if (gw === 'WatchPay' || gw === 'HeyPay') {
    try {
      const { createPayment } = require('../lib/payment-gateways');
      const host = `${req.protocol}://${req.get('host')}`;
      const notifyPath = gw === 'WatchPay' ? '/api/public/watchpay/callback' : '/api/public/heypay/callback';
      const result = await createPayment(gw, {
        orderId: ins.insertId,
        amount: amt,
        notifyUrl: host + notifyPath,
        returnUrl: req.body.return_url || '',
      });
      if (result.ok && result.pay_url) pay_url = result.pay_url;
    } catch (e) { /* fall through to manual */ }
  }
  res.json({ ok: true, id: ins.insertId, pay_url });
});

router.post('/withdraw', userAuth, async (req, res) => {
  const { amount, channel, account_no, account_name } = req.body || {};
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt < 100) return res.status(400).json({ error: 'Minimum withdraw is 100' });
  if (!channel || !account_no) return res.status(400).json({ error: 'Channel and account required' });
  const user = await pickUser(req.uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (Number(user.balance) < amt) return res.status(400).json({ error: 'Insufficient balance' });
  const fee = +(amt * 0.05).toFixed(2);
  const net = +(amt - fee).toFixed(2);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE users SET balance = balance - ?, total_withdraw = total_withdraw + ? WHERE id = ?', [amt, amt, req.uid]);
    const [ins] = await conn.query(
      'INSERT INTO withdrawals (user_id, amount, fee, net_amount, channel, account_no, account_name, status) VALUES (?,?,?,?,?,?,?,?)',
      [req.uid, amt, fee, net, channel, account_no, account_name || null, 'pending']
    );
    await conn.query(
      'INSERT INTO transactions (user_id, type, amount, status, note) VALUES (?,?,?,?,?)',
      [req.uid, 'withdraw', amt, 'pending', `Withdraw #${ins.insertId}`]
    );
    await conn.commit();
    res.json({ ok: true, id: ins.insertId, fee, net });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

router.post('/buy-plan', userAuth, async (req, res) => {
  const { plan_id } = req.body || {};
  const [pr] = await pool.query('SELECT * FROM plans WHERE id = ? AND active = 1', [plan_id]);
  const plan = pr[0];
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  const user = await pickUser(req.uid);
  if (Number(user.balance) < Number(plan.price)) return res.status(400).json({ error: 'Insufficient balance' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE users SET balance = balance - ? WHERE id = ?', [plan.price, req.uid]);
    await conn.query(
      'INSERT INTO user_plans (user_id, plan_id, price, daily_income, total_days) VALUES (?,?,?,?,?)',
      [req.uid, plan.id, plan.price, plan.daily_income, plan.total_days]
    );
    await conn.query(
      'INSERT INTO transactions (user_id, type, amount, status, note) VALUES (?,?,?,?,?)',
      [req.uid, 'plan_purchase', plan.price, 'success', `Bought ${plan.name}`]
    );
    await conn.commit();
    res.json({ ok: true });
  } catch (e) { await conn.rollback(); res.status(500).json({ error: e.message }); }
  finally { conn.release(); }
});

router.get('/my-plans', userAuth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT up.*, p.name, p.image_url
       FROM user_plans up JOIN plans p ON p.id = up.plan_id
      WHERE up.user_id = ? ORDER BY up.id DESC`, [req.uid]);
  res.json({ ok: true, items: rows });
});

// ===== Lists for the user =====
router.get('/transactions', userAuth, async (req, res) => {
  const { type } = req.query;
  const params = [req.uid];
  let sql = 'SELECT id, type, amount, status, note, created_at FROM transactions WHERE user_id = ?';
  if (type) { sql += ' AND type = ?'; params.push(type); }
  sql += ' ORDER BY id DESC LIMIT 200';
  const [rows] = await pool.query(sql, params);
  res.json({ ok: true, items: rows });
});

router.get('/withdrawals', userAuth, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, amount, fee, net_amount, channel, account_no, status, ref_no, created_at FROM withdrawals WHERE user_id = ? ORDER BY id DESC LIMIT 200',
    [req.uid]);
  res.json({ ok: true, items: rows });
});

router.get('/recharges', userAuth, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, amount, gateway, status, ref_no, created_at FROM recharges WHERE user_id = ? ORDER BY id DESC LIMIT 200',
    [req.uid]);
  res.json({ ok: true, items: rows });
});

router.get('/team', userAuth, async (req, res) => {
  const select = 'SELECT id, phone, name, total_recharge, status, created_at, referrer_id FROM users';
  const [l1] = await pool.query(`${select} WHERE referrer_id = ? ORDER BY id DESC`, [req.uid]);
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

  // Real commission totals from commissions table
  const [cRows] = await pool.query(
    "SELECT level, COALESCE(SUM(amount),0) AS total FROM commissions WHERE user_id = ? GROUP BY level",
    [req.uid]
  );
  const commByLevel = { 1: 0, 2: 0, 3: 0 };
  cRows.forEach(r => { commByLevel[r.level] = Number(r.total); });

  const stats = [
    { level: 1, count: l1.length, recharge: sum(l1), commission: commByLevel[1] },
    { level: 2, count: l2.length, recharge: sum(l2), commission: commByLevel[2] },
    { level: 3, count: l3.length, recharge: sum(l3), commission: commByLevel[3] },
  ];
  res.json({
    ok: true,
    stats,
    members: [...withLevel(l1, 1), ...withLevel(l2, 2), ...withLevel(l3, 3)],
    l1: { count: l1.length, recharge: sum(l1), commission: commByLevel[1], users: l1 },
    l2: { count: l2.length, recharge: sum(l2), commission: commByLevel[2], users: l2 },
    l3: { count: l3.length, recharge: sum(l3), commission: commByLevel[3], users: l3 },
    total_commission: commByLevel[1] + commByLevel[2] + commByLevel[3],
  });
});

router.get('/commissions', userAuth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.level, c.amount, c.base_amount, c.rate, c.created_at,
            u.phone AS source_phone, u.name AS source_name
       FROM commissions c LEFT JOIN users u ON u.id = c.source_user_id
       WHERE c.user_id = ? ORDER BY c.id DESC LIMIT 200`, [req.uid]);
  res.json({ ok: true, items: rows });
});

// ===== Redeem code =====
router.post('/redeem', userAuth, async (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Code required' });
  const [cr] = await pool.query('SELECT * FROM redeem_codes WHERE code = ? AND active = 1', [code]);
  const rc = cr[0];
  if (!rc) return res.status(404).json({ error: 'Invalid code' });
  if (rc.expires_at && new Date(rc.expires_at) < new Date()) return res.status(400).json({ error: 'Code expired' });
  if (rc.uses >= rc.max_uses) return res.status(400).json({ error: 'Code fully used' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    try {
      await conn.query('INSERT INTO redeem_claims (user_id, code_id, amount) VALUES (?,?,?)', [req.uid, rc.id, rc.amount]);
    } catch { throw new Error('Already redeemed'); }
    await conn.query('UPDATE redeem_codes SET uses = uses + 1 WHERE id = ?', [rc.id]);
    await conn.query('UPDATE users SET balance = balance + ? WHERE id = ?', [rc.amount, req.uid]);
    await conn.query(
      'INSERT INTO transactions (user_id, type, amount, status, note) VALUES (?,?,?,?,?)',
      [req.uid, 'redeem', rc.amount, 'success', `Redeemed ${rc.code}`]
    );
    await conn.commit();
    res.json({ ok: true, amount: rc.amount });
  } catch (e) { await conn.rollback(); res.status(400).json({ error: e.message }); }
  finally { conn.release(); }
});

module.exports = router;
