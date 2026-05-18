require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// CORS
const origins = (process.env.CORS_ORIGINS || '*').split(',').map(s => s.trim());
app.use(cors({
  origin: origins.includes('*') ? true : origins,
  credentials: false,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health
app.get('/', (_req, res) => res.json({ ok: true, name: 'shell-admin-api', version: '1.0.0' }));
app.get('/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true, db: 'up' }); }
  catch (e) { res.status(500).json({ ok: false, db: 'down', error: e.message }); }
});

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/dashboard',    require('./routes/dashboard'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/settings',     require('./routes/settings'));
// User-side public API (mobile app uses these)
app.use('/api/u',            require('./routes/users-public'));
// Public webhook callbacks (no auth — verified by signature inside)
app.use('/api/public',       require('./routes/public-callbacks'));

const crud = require('./routes/_crud');

app.use('/api/plans', crud({
  table: 'plans',
  columns: ['name','type','price','daily_income','total_days','total_income','image_url','description','active'],
  searchCols: ['name'],
  filterCols: ['active','type'],
}));

app.use('/api/sliders', crud({
  table: 'sliders',
  columns: ['title','image_url','link_url','sort_order','active'],
  searchCols: ['title'],
  filterCols: ['active'],
  orderBy: 'sort_order ASC, id DESC',
}));

app.use('/api/transactions', crud({
  table: 'transactions',
  columns: ['user_id','type','amount','status','note'],
  searchCols: ['note'],
  filterCols: ['type','status','user_id'],
}));

const adminFinance = require('./routes/admin-finance');
app.use('/api/withdrawals', adminFinance.withdrawals);
app.use('/api/recharges',   adminFinance.recharges);

app.use('/api/payouts', crud({
  table: 'payouts',
  columns: ['user_id','kind','amount','status','note'],
  searchCols: ['note'],
  filterCols: ['status','kind','user_id'],
}));

app.use('/api/rewards', crud({
  table: 'rewards',
  columns: ['user_id','kind','title','amount','note'],
  searchCols: ['title','note'],
  filterCols: ['kind','user_id'],
}));

app.use('/api/redeem-codes', crud({
  table: 'redeem_codes',
  columns: ['code','amount','max_uses','uses','expires_at','active'],
  searchCols: ['code'],
  filterCols: ['active'],
}));

app.use('/api/gateways', crud({
  table: 'gateways',
  columns: ['type','name','title','min_amount','max_amount','merchant_id','api_key','active'],
  searchCols: ['name','title','merchant_id'],
  filterCols: ['type','active'],
}));

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`✓ shell-admin-api listening on :${port}`));
