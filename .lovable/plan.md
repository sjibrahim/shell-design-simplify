## Scope

Aapne 4 cheezein boli — ye plan unhi pe deliver karega:

### 1. Home page (`src/routes/index.tsx`)
- "Wallet Balance" card pura remove karna (red header ke andar wala white/glass card).
- Investment Plans section me **Normal / VIP** ke do tabs add karne — top pe pill toggle.
- Selected tab ke hisab se plans filter karke dikhana.

### 2. Plans schema + API
- `plans` table me naya column: `type ENUM('normal','vip') NOT NULL DEFAULT 'normal'` — migration ke through.
- User endpoint `/api/u/plans` me `?type=normal|vip` filter support.
- Admin `/api/admin/plans` me `type` field create/update support (admin form me dropdown).
- Existing plans me sab `'normal'` default ho jayenge — VIP plans admin se add karne padenge.

### 3. Team page (`src/routes/team.tsx` + `src/routes/team-view.tsx`)
- Backend `/api/u/team` already L1/L2/L3 me members + stats return karta hai — bas frontend dikha nahi raha.
- Team page pe har level card pe "Details" button `team-view?level=1` jaisa link karega.
- `team-view.tsx` me 3 tabs (L1 / L2 / L3) banake har level ke real members (phone, name, total_recharge, status, created_at) list karega — backend ke `l1.users / l2.users / l3.users` se.
- "Total Rebate" / commission abhi backend me 0 hai (commission logic exist nahi karta) — sirf member count + total recharge dikhayenge. Commission rule baad me alag se.

### 4. Admin (`Admin.php` se alignment)
Admin.php CodeIgniter PHP hai jisme views + JSON endpoints mixed hain. Hum already Express + React me hain, to "complete rewrite" ka realistic matlab: **jo Admin.php me functions hain aur humare yaha missing hain, woh add karna**. Mapping:

| Admin.php function | Status |
|---|---|
| login / logout / index / profile | ✅ exists (`admin.login.tsx`, JWT) |
| users / inactive_users / add_user / insert_user / update_account / remove_user | ✅ exists (`admin.members.tsx` + `users.js`) |
| products (plans) | ✅ exists — `type` field add karenge |
| giftcards / redeem codes | ✅ exists (`admin.redeem-codes.tsx`) |
| single_reward / add_reward / agent_record | ✅ exists (`admin.rewards.tsx`) |
| gateways | ✅ exists |
| sliders | ❌ **add** — `sliders` table + `admin.sliders.tsx` |
| credit_transactions / debit_transactions / transactions | ✅ exists, par credit/debit split filter add karenge |
| withdraw / blogger_withdraw / usdt_withdraw | partial — `withdrawals` exists, `blogger`/`usdt` ke liye `kind` filter add karenge (`payouts` already has it for blogger) |
| settings / sliders settings | ✅ exists |
| generic add/update/get/remove (table CRUD) | `_crud.js` already hai |

Admin sidebar me **"Sliders"** ka naya nav item bhi add hoga.

## Out of scope (alag turn me karenge agar chaho)
- Watchpay / Heypay payment gateway PHP code ko Node me port karna (callbacks, signatures) — alag effort hai, payment flow change karega.
- Commission/rebate calculation engine (L1=15%, L2=8%, L3=3% jaise rates) — backend me earnings ka source-of-truth banana padega.
- Admin profile photo, admin password change UI etc. cosmetic chizein.

## Files touched
- `backend/migrate.js` (new migration: plans.type, sliders table)
- `backend/routes/users-public.js` (plans filter)
- `backend/routes/admin-finance.js` ya `_crud.js` (plans type, sliders, withdraw kind filter)
- `src/routes/index.tsx` (wallet card remove + Normal/VIP tabs)
- `src/routes/team.tsx` (Details links)
- `src/routes/team-view.tsx` (L1/L2/L3 tabs with real members)
- `src/routes/admin.plans.tsx` (type dropdown)
- `src/routes/admin.sliders.tsx` (NEW)
- `src/components/AdminLayout.tsx` (Sliders nav)
- `src/components/PageShell.tsx` (agar wallet card wahan hai — check karenge)

Confirm karo to start kar du, ya kuch adjust karna hai?
