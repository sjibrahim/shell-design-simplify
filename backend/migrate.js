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

    // idempotent ALTERs for existing installs
    const safeAlter = async (sql) => {
      try { await conn.query(sql); }
      catch (e) {
        if (!/Duplicate column|already exists|check that column.*exists/i.test(e.message)) throw e;
      }
    };
    await safeAlter("ALTER TABLE plans ADD COLUMN type ENUM('normal','vip') NOT NULL DEFAULT 'normal' AFTER name");
    await safeAlter("ALTER TABLE plans ADD INDEX idx_plans_type (type)");
    await safeAlter("CREATE TABLE IF NOT EXISTS commissions (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, source_user_id INT NOT NULL, level TINYINT NOT NULL, recharge_id INT DEFAULT NULL, base_amount DECIMAL(12,2) NOT NULL, rate DECIMAL(6,3) NOT NULL, amount DECIMAL(12,2) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_cm_user_level (user_id, level), INDEX idx_cm_source (source_user_id), UNIQUE KEY uniq_recharge_level (recharge_id, level, user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    await safeAlter("CREATE TABLE IF NOT EXISTS sliders (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(190) DEFAULT NULL, image_url VARCHAR(500) NOT NULL, link_url VARCHAR(500) DEFAULT NULL, sort_order INT NOT NULL DEFAULT 0, active TINYINT(1) NOT NULL DEFAULT 1, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    console.log('✓ ALTERs applied');

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
