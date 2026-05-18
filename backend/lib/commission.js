// Credit L1/L2/L3 upline commissions when a recharge is approved.
// Rates are read from the `settings` table (commission_l1/l2/l3 as percentages).
const pool = require('../db');

async function getRates(conn) {
  const [rows] = await conn.query(
    "SELECT k, v FROM settings WHERE k IN ('commission_l1','commission_l2','commission_l3')"
  );
  const map = Object.fromEntries(rows.map(r => [r.k, Number(r.v)]));
  return [
    Number(map.commission_l1 || 0),
    Number(map.commission_l2 || 0),
    Number(map.commission_l3 || 0),
  ];
}

/**
 * Credit upline commissions atomically. Pass an existing connection (already in a transaction).
 * Idempotent: the unique key (recharge_id, level, user_id) prevents double-pay if called twice.
 *
 * @param {import('mysql2/promise').PoolConnection} conn
 * @param {{ userId: number, amount: number, rechargeId: number|null }} payload
 */
async function creditUplineCommissions(conn, { userId, amount, rechargeId }) {
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) return [];
  const rates = await getRates(conn); // [l1%, l2%, l3%]

  // Walk upline up to 3 levels
  const uplines = [];
  let currentId = userId;
  for (let level = 1; level <= 3; level++) {
    const [r] = await conn.query('SELECT referrer_id FROM users WHERE id = ?', [currentId]);
    const ref = r[0]?.referrer_id;
    if (!ref) break;
    uplines.push({ level, uplineId: ref });
    currentId = ref;
  }

  const credited = [];
  for (const { level, uplineId } of uplines) {
    const ratePct = rates[level - 1];
    if (!ratePct || ratePct <= 0) continue;
    const commission = +(amt * (ratePct / 100)).toFixed(2);
    if (commission <= 0) continue;
    try {
      await conn.query(
        'INSERT INTO commissions (user_id, source_user_id, level, recharge_id, base_amount, rate, amount) VALUES (?,?,?,?,?,?,?)',
        [uplineId, userId, level, rechargeId, amt, ratePct, commission]
      );
    } catch (e) {
      // Duplicate (already credited for this recharge+level+user) — skip silently.
      if (/Duplicate/i.test(e.message)) continue;
      throw e;
    }
    await conn.query(
      'UPDATE users SET balance = balance + ?, total_income = total_income + ? WHERE id = ?',
      [commission, commission, uplineId]
    );
    await conn.query(
      'INSERT INTO transactions (user_id, type, amount, status, note) VALUES (?,?,?,?,?)',
      [uplineId, 'commission', commission, 'success', `L${level} commission from user #${userId} (recharge #${rechargeId || '-'})`]
    );
    credited.push({ uplineId, level, amount: commission });
  }
  return credited;
}

module.exports = { creditUplineCommissions, getRates };
