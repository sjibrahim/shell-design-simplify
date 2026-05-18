// Generic Asia-style payment gateway helpers (WatchPay, HeyPay).
// Real endpoints / signing rules can vary by merchant contract — both providers
// follow the same md5(sorted params + key) convention used in the original PHP code.
// Credentials (merchant_id, api_key, endpoint) come from the `gateways` DB row.
const crypto = require('crypto');
const pool = require('../db');

const DEFAULTS = {
  WatchPay: {
    payUrl: 'https://api.watchpay.io/api/pay/create',
    payoutUrl: 'https://api.watchpay.io/api/payout/create',
    notifyPath: '/api/public/watchpay/callback',
  },
  HeyPay: {
    payUrl: 'https://api.heypay.io/api/pay/create',
    payoutUrl: 'https://api.heypay.io/api/payout/create',
    notifyPath: '/api/public/heypay/callback',
  },
};

async function getGatewayConfig(name) {
  const [rows] = await pool.query(
    'SELECT * FROM gateways WHERE name = ? AND active = 1 LIMIT 1', [name]
  );
  if (!rows.length) return null;
  const row = rows[0];
  const def = DEFAULTS[name] || {};
  // api_key field can either be just the secret, or `endpoint|secret` for override.
  let endpoint = def.payUrl;
  let secret = row.api_key || '';
  if (secret.includes('|')) {
    const [ep, sk] = secret.split('|');
    endpoint = ep || endpoint;
    secret = sk || '';
  }
  return {
    name,
    endpoint,
    payoutUrl: def.payoutUrl,
    notifyPath: def.notifyPath,
    merchantId: row.merchant_id,
    secret,
  };
}

function md5Sign(params, secret) {
  const sorted = Object.keys(params).sort()
    .filter(k => params[k] !== '' && params[k] != null && k !== 'sign')
    .map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('md5').update(sorted + '&key=' + secret).digest('hex');
}

function verifySign(params, secret) {
  const sent = params.sign;
  if (!sent) return false;
  const { sign: _s, ...rest } = params;
  const expected = md5Sign(rest, secret);
  return expected.toLowerCase() === String(sent).toLowerCase();
}

/**
 * Create a hosted-checkout session and return { ok, pay_url, raw }.
 * Falls back to manual mode (no pay_url) if the gateway has placeholder creds.
 */
async function createPayment(name, { orderId, amount, notifyUrl, returnUrl }) {
  const cfg = await getGatewayConfig(name);
  if (!cfg) return { ok: false, error: `Gateway ${name} not configured` };
  if (!cfg.merchantId || !cfg.secret || cfg.merchantId.startsWith('REPLACE')) {
    return { ok: true, manual: true }; // pending admin confirmation
  }
  const payload = {
    merchant_id: cfg.merchantId,
    order_id: String(orderId),
    amount: Number(amount).toFixed(2),
    currency: 'PHP',
    notify_url: notifyUrl,
    return_url: returnUrl || '',
    timestamp: Math.floor(Date.now() / 1000),
  };
  payload.sign = md5Sign(payload, cfg.secret);

  try {
    const r = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await r.json().catch(() => ({}));
    const url = data.pay_url || data.payUrl || data.url || data.data?.pay_url;
    if (!url) return { ok: false, error: data.msg || data.message || 'Gateway did not return pay_url', raw: data };
    return { ok: true, pay_url: url, raw: data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = { getGatewayConfig, createPayment, md5Sign, verifySign };
