const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const pool = require('./db');

const DEFAULT_SETTINGS = [
  ['site_title', 'Shell Oil Rewards'],
  ['signup_bonus', '50'],
  ['referral_bonus', '20'],
  ['commission_l1', '15'],
  ['commission_l2', '8'],
  ['commission_l3', '3'],
  ['withdraw_fee', '2'],
  ['withdraw_enabled', '1'],
  ['telegram_support', '@shellsupport'],
  ['telegram_channel', '@shellchannel'],
  ['youtube_channel', ''],
  ['whatsapp_contact', ''],
  ['missions_enabled', '1'],
  ['copyright', '© Shell Oil Rewards 2026'],
];

(async () => {
  const conn = await pool.getConnection();
  try {
    console.log('→ Running schema.sql ...');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
    for (const s of statements) await conn.query(s);
    console.log('✓ Schema created');

    // seed default admin
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@shell.com';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const [rows] = await conn.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      await conn.query(
        'INSERT INTO admins (email, password_hash, name, role) VALUES (?,?,?,?)',
        [email, hash, 'Super Admin', 'superadmin']
      );
      console.log(`✓ Default admin created → ${email} / ${password}`);
    } else {
      console.log('• Admin already exists, skipped');
    }

    // seed settings
    for (const [k, v] of DEFAULT_SETTINGS) {
      await conn.query(
        'INSERT IGNORE INTO settings (k, v) VALUES (?, ?)',
        [k, v]
      );
    }
    console.log('✓ Default settings seeded');

    // seed one demo gateway
    const [gw] = await conn.query('SELECT id FROM gateways LIMIT 1');
    if (gw.length === 0) {
      await conn.query(
        'INSERT INTO gateways (type, name, title, min_amount, merchant_id, api_key) VALUES (?,?,?,?,?,?)',
        ['recharge', 'WatchPay', 'WatchPay', 120, '100225575', 'a524cd5e34324415a338513e57c06631']
      );
      console.log('✓ Demo gateway inserted');
    }

    console.log('\n✅ Migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('✗ Migration failed:', err.message);
    process.exit(1);
  } finally {
    conn.release();
  }
})();
