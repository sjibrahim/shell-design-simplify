# Shell Oil — Referral App (Static Demo)

A mobile-first, 3-screen referral/earnings app modeled on the uploaded references, rebranded to Shell Oil with a yellow + red color system.

## Screens

1. **Profile** (`/profile`, default route)
   - Gradient header: Shell ID, "VIP Member" badge, Shell logo tile
   - Stats card: Balance / Recharged / Total Income (₱ values)
   - Recharge + Withdraw action row
   - "My Account" list: My Orders, Bank Account, Transaction Records, About Company

2. **Team** (`/team`)
   - Header: "My Team — Track your referral network & earnings"
   - Two top cards: Total Team, Team Recharge
   - Lv1 / Lv2 / Lv3 tabs with counts and earnings
   - Team Members list with Level 1/2/3 segmented tabs and member cards (masked phone, date, total recharge/withdraw)

3. **Invite** (`/invite`)
   - Header: "Invite Friends — Earn commissions on every referral"
   - 3 stat cards: Total Invited / Earned / Levels
   - QR code card (generated with `qrcode` lib from referral link)
   - Referral Link with Copy button, Referral Code

Persistent bottom nav: Home (disabled placeholder), Invite, Team, Profile.

## Design system (Shell branding)

- Primary: Shell Yellow `#FFD500`
- Accent: Shell Red `#DD1D21`
- Header gradient: red → deeper red (`#DD1D21` → `#A8161A`) with soft circle motifs
- Background: warm off-white `#FFFBF0`
- Card surface: white with soft yellow-tinted shadow
- Same rounded-2xl cards, icon tiles, dividers, and typographic hierarchy as references
- Icon tiles re-tinted: yellow, red, amber, green variants (kept for variety)
- All values stay as static mock data (₱2,903 balance, 155 team, etc.)

## Tech notes

- TanStack Start template (current artifact stack)
- Routes via existing router; mobile viewport set automatically
- `qrcode` (or `react-qr-code`) for the QR
- Lucide icons (Wallet, CreditCard, Users, UserPlus, ShoppingBag, Landmark, FileText, Building2, Home, Copy, ChevronRight)
- Tailwind tokens defined in `index.css` / tailwind config; no Cloud, no auth

## File plan

```text
src/
  routes/
    profile.tsx        # default redirect target
    team.tsx
    invite.tsx
  components/
    BottomNav.tsx
    GradientHeader.tsx
    StatCard.tsx
    AccountRow.tsx
    LevelTabs.tsx
  assets/
    shell-logo.png     # generated Shell-style logo
  index.css            # Shell color tokens
```

Closing: I'll deliver a polished static demo — no backend, no live data.
