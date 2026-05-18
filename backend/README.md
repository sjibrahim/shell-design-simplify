# Shell Admin API (Node.js + Express + MySQL)

Complete REST backend for the Shell Oil admin panel — JWT auth, CRUD for users, plans, transactions, withdrawals, recharges, payouts, rewards, redeem codes, gateways, and settings.

## 1. Requirements

- Node.js 18+
- MySQL 8 (or MariaDB 10.4+)

## 2. Setup

```bash
unzip shell-admin-api.zip
cd shell-admin-api
npm install
cp .env.example .env
# edit .env — set DB creds and a strong JWT_SECRET
```

## 3. Create database

In MySQL:
```sql
CREATE DATABASE shell_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 4. Run migration (creates tables + seeds default admin + settings)

```bash
npm run migrate
```

Default login (change immediately):
- email: `admin@shell.com`
- password: `admin123`

## 5. Start the server

```bash
npm start          # production
npm run dev        # auto-reload (nodemon)
```

Server runs on `PORT` from `.env` (default `4000`).

## 6. Deploy with PM2 (recommended on VPS)

```bash
npm i -g pm2
pm2 start server.js --name shell-admin-api
pm2 save
pm2 startup
```

## 7. Nginx reverse proxy (sample)

```nginx
server {
  server_name static.babymoon.space;
  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```
Then add SSL with: `certbot --nginx -d static.babymoon.space`

## 8. API overview

All endpoints under `/api`. Auth via header `Authorization: Bearer <token>`.

### Auth
- `POST /api/auth/login`            `{ email, password }` → `{ token, admin }`
- `GET  /api/auth/me`
- `POST /api/auth/change-password`  `{ current, next }`

### Dashboard
- `GET /api/dashboard/stats`        → counts + chart data

### Generic CRUD pattern (applies to most resources)
- `GET    /api/<resource>`          query: `page`, `limit`, `q`, plus filterable cols
- `POST   /api/<resource>`          body: object with allowed columns
- `PUT    /api/<resource>/:id`      body: partial update
- `DELETE /api/<resource>/:id`

### Resources
- `users`           — phone, name, balance, vip_level, status (active/inactive/blocked)
- `plans`           — name, price, daily_income, total_days, total_income, active
- `transactions`    — type (recharge/withdraw/income/bonus/commission/plan_purchase/redeem), status
- `withdrawals`     — amount, fee, net_amount, channel, account_no, status (pending/processing/success/failed)
- `recharges`       — amount, gateway, status
- `payouts`         — kind (blogger/investor), amount, status
- `rewards`         — kind (single/multi/agent), title, amount
- `redeem-codes`    — code, amount, max_uses, uses, expires_at, active
- `gateways`        — type, name, title, min_amount, max_amount, merchant_id, api_key, active

### Settings
- `GET /api/settings`               → `{ settings: { key: value, ... } }`
- `PUT /api/settings`               → body is an object of keys to upsert

## 9. Frontend wiring

In the admin panel set:
```
VITE_ADMIN_API_URL=https://static.babymoon.space
```

That's it. CORS is open (`*`) by default — restrict in `.env` once your admin domain is fixed.
