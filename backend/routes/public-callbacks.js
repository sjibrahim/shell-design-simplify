// Public webhook endpoints — NO auth. Verify signatures inside each handler.
const express = require('express');
const pool = require('../db');
const { getGatewayConfig, verifySign } = require('../lib/payment-gateways');
const { creditUplineCommissions } = require('../lib/commission');

const router = express.Router();

async function handleCallback(req, res, gatewayName) {
  // Accept JSON or form-encoded
  const payload = { ...req.body, ...req.query };
  const cfg = await getGatewayConfig(gatewayName);
  if (!cfg) return res.status(404).send('gateway not configured');

  // If creds are placeholders, skip signature check (manual mode) but still process.
  const placeholder = !cfg.secret || cfg.merchantId?.startsWith('REPLACE');
  if (!placeholder && !verifySign(payload, cfg.secret)) {
    return res.status(401).send('invalid signature');
  }

  const orderId = Number(payload.order_id || payload.orderId || payload.out_trade_no);
  const status = String(payload.status || payload.trade_status || '').toLowerCase();
  if (!orderId) return res.status(400).send('missing order_id');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM recharges WHERE id = ? FOR UPDATE', [orderId]);
    const row = rows[0];
    if (!row) { await conn.rollback(); return res.status(404).send('order not found'); }
    if (row.status === 'success') { await conn.rollback(); return res.send('ok'); }

    const isSuccess = ['success', 'paid', 'completed', '1', 'ok'].includes(status);
    const isFailed  = ['failed', 'fail', 'cancel', 'cancelled', '0'].includes(status);
    const newStatus = isSuccess ? 'success' : (isFailed ? 'failed' : row.status);

    await conn.query('UPDATE recharges SET status = ?, ref_no = ? WHERE id = ?',
      [newStatus, payload.trade_no || payload.transaction_id || row.ref_no, orderId]);

    if (newStatus === 'success') {
      await conn.query(
        'UPDATE users SET balance = balance + ?, total_recharge = total_recharge + ? WHERE id = ?',
        [row.amount, row.amount, row.user_id]
      );
      await conn.query(
        `UPDATE transactions SET status='success' WHERE user_id=? AND type='recharge' AND note=? LIMIT 1`,
        [row.user_id, `Recharge #${orderId}`]
      );
      await creditUplineCommissions(conn, {
        userId: row.user_id, amount: Number(row.amount), rechargeId: orderId,
      });
    } else if (newStatus === 'failed') {
      await conn.query(
        `UPDATE transactions SET status='failed' WHERE user_id=? AND type='recharge' AND note=? LIMIT 1`,
        [row.user_id, `Recharge #${orderId}`]
      );
    }

    await conn.commit();
    res.send('ok');
  } catch (e) {
    await conn.rollback();
    console.error('callback error', e);
    res.status(500).send('error');
  } finally { conn.release(); }
}

async function handlePayoutCallback(req, res, gatewayName) {
  const payload = { ...req.body, ...req.query };
  const cfg = await getGatewayConfig(gatewayName);
  if (!cfg) return res.status(404).send('gateway not configured');
  const placeholder = !cfg.secret || String(cfg.merchantId || '').startsWith('REPLACE');
  if (!placeholder && !verifySign(payload, cfg.secret)) {
    return res.status(401).send('invalid signature');
  }
  const orderId = Number(payload.order_id || payload.orderId || payload.out_trade_no);
  const status = String(payload.status || payload.trade_status || '').toLowerCase();
  if (!orderId) return res.status(400).send('missing order_id');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM withdrawals WHERE id = ? FOR UPDATE', [orderId]);
    const row = rows[0];
    if (!row) { await conn.rollback(); return res.status(404).send('order not found'); }
    if (row.status === 'success' || row.status === 'failed') { await conn.rollback(); return res.send('ok'); }

    const isSuccess = ['success', 'paid', 'completed', '1', 'ok'].includes(status);
    const isFailed  = ['failed', 'fail', 'cancel', 'cancelled', '0'].includes(status);
    const newStatus = isSuccess ? 'success' : (isFailed ? 'failed' : row.status);
    const ref = payload.trade_no || payload.transaction_id || row.ref_no;
    await conn.query('UPDATE withdrawals SET status=?, ref_no=? WHERE id=?', [newStatus, ref, orderId]);

    if (newStatus === 'success') {
      await conn.query(
        `UPDATE transactions SET status='success' WHERE user_id=? AND type='withdraw' AND note=? LIMIT 1`,
        [row.user_id, `Withdraw #${orderId}`]
      );
    } else if (newStatus === 'failed') {
      // refund
      await conn.query(
        'UPDATE users SET balance = balance + ?, total_withdraw = GREATEST(total_withdraw - ?, 0) WHERE id = ?',
        [row.amount, row.amount, row.user_id]
      );
      await conn.query(
        `UPDATE transactions SET status='failed' WHERE user_id=? AND type='withdraw' AND note=? LIMIT 1`,
        [row.user_id, `Withdraw #${orderId}`]
      );
    }
    await conn.commit();
    res.send('ok');
  } catch (e) { await conn.rollback(); console.error('payout callback error', e); res.status(500).send('error'); }
  finally { conn.release(); }
}

router.post('/watchpay/callback', (req, res) => handleCallback(req, res, 'WatchPay'));
router.get ('/watchpay/callback', (req, res) => handleCallback(req, res, 'WatchPay'));
router.post('/heypay/callback',   (req, res) => handleCallback(req, res, 'HeyPay'));
router.get ('/heypay/callback',   (req, res) => handleCallback(req, res, 'HeyPay'));
router.post('/watchpay/payout-callback', (req, res) => handlePayoutCallback(req, res, 'WatchPay'));
router.get ('/watchpay/payout-callback', (req, res) => handlePayoutCallback(req, res, 'WatchPay'));
router.post('/heypay/payout-callback',   (req, res) => handlePayoutCallback(req, res, 'HeyPay'));
router.get ('/heypay/payout-callback',   (req, res) => handlePayoutCallback(req, res, 'HeyPay'));

module.exports = router;
