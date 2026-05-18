const express = require('express');
const pool = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

router.get('/stats', async (_req, res) => {
  const [[users]]    = await pool.query('SELECT COUNT(*) c FROM users');
  const [[active]]   = await pool.query("SELECT COUNT(*) c FROM users WHERE status='active'");
  const [[inactive]] = await pool.query("SELECT COUNT(*) c FROM users WHERE status<>'active'");
  const [[plans]]    = await pool.query('SELECT COUNT(*) c FROM plans WHERE active=1');
  const [[txns]]     = await pool.query('SELECT COUNT(*) c FROM transactions');
  const [[wdPend]]   = await pool.query("SELECT COUNT(*) c, COALESCE(SUM(amount),0) s FROM withdrawals WHERE status='pending'");
  const [[wdOk]]     = await pool.query("SELECT COUNT(*) c, COALESCE(SUM(amount),0) s FROM withdrawals WHERE status='success'");
  const [[wdProc]]   = await pool.query("SELECT COUNT(*) c, COALESCE(SUM(amount),0) s FROM withdrawals WHERE status='processing'");
  const [[wdFail]]   = await pool.query("SELECT COUNT(*) c, COALESCE(SUM(amount),0) s FROM withdrawals WHERE status='failed'");
  const [[rcOk]]     = await pool.query("SELECT COALESCE(SUM(amount),0) s FROM recharges WHERE status='success'");
  const [[rcPend]]   = await pool.query("SELECT COALESCE(SUM(amount),0) s FROM recharges WHERE status='pending'");
  const [[poOk]]     = await pool.query("SELECT COALESCE(SUM(amount),0) s FROM payouts WHERE status='success'");

  // last 7 days recharge vs withdraw chart
  const [chart] = await pool.query(`
    SELECT DATE(created_at) d,
      SUM(CASE WHEN type='recharge' AND status='success' THEN amount ELSE 0 END) recharge,
      SUM(CASE WHEN type='withdraw' AND status='success' THEN amount ELSE 0 END) withdraw
    FROM transactions
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(created_at)
    ORDER BY d ASC
  `);

  res.json({
    ok: true,
    users: users.c, active: active.c, inactive: inactive.c,
    plans: plans.c, txns: txns.c,
    withdrawals: {
      pending:    { count: wdPend.c, amount: Number(wdPend.s) },
      processing: { count: wdProc.c, amount: Number(wdProc.s) },
      success:    { count: wdOk.c,   amount: Number(wdOk.s) },
      failed:     { count: wdFail.c, amount: Number(wdFail.s) },
    },
    recharge_success: Number(rcOk.s),
    recharge_pending: Number(rcPend.s),
    payout_success:   Number(poOk.s),
    chart,
  });
});

module.exports = router;
