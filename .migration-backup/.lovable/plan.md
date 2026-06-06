# Staff Dashboard Plan

## 1. Security first (you do this)

- **Rotate Discord bot token + client secret immediately** — they were leaked in chat.
- Then I'll ask you to paste the **new** values into Lovable's secure secrets form (never in chat).

## 2. Auth: Discord OAuth (custom)

Lovable Cloud doesn't natively support Discord OAuth, so I'll implement it via edge functions:

- `**/dashboard/login**` page → "Login with Discord" button → redirects to Discord OAuth (`identify guilds.members.read` scope).
- **Edge function `discord-callback**`:
  1. Exchanges code for Discord access token.
  2. Calls Discord API to fetch user's roles in guild `1473425849360318494` using the bot token.
  3. Maps role IDs → app role:
    - `1473426512173862983` → `founder` (owner)
    - `1510976897327038555` → `ceo`
    - `1510976982983249940` → `coo`
    - `1510977038683472073` → `cto`
  4. If user has none of those roles → reject.
  5. Upserts staff record, mints a signed session JWT (HttpOnly cookie).
- **Edge function `session-me**` → returns current staff user `{discord_id, username, avatar, role, is_frozen}`.
- **Edge function `logout**` → clears cookie.

## 3. Database (Lovable Cloud)

Migrate static `lib/data.ts` into DB so the dashboard can edit it.

Tables:

- `**staff_users**` — `discord_id` (PK), `username`, `avatar`, `role` (enum: founder/ceo/coo/cto), `is_frozen` (bool), `frozen_by`, `frozen_at`.
- `**bots**` (replaces `lib/data.ts` codes) — id, title, description, category, subcategory, difficulty, language, views, likes, featured, banner_image, full_description, technologies[], features[], access_code, filelink, **is_visible** (bool, default true), created_by, created_at, updated_at.
- `**bot_files**` — id, bot_id (FK), name, language, code.
- `**audit_log**` — id, actor_discord_id, action, target_type, target_id, payload, created_at.

RLS: everything locked; all writes go through edge functions that check the session JWT + role + freeze status.

Public site reads only `bots` where `is_visible = true` (anon SELECT policy).

## 4. Permission matrix


| Action            | Founder | CEO | COO | CTO |
| ----------------- | ------- | --- | --- | --- |
| Create bot card   | ✅       | ✅   | ✅   | ✅   |
| Edit any bot      | ✅       | ✅   | ❌   | ❌   |
| Edit own bot      | ✅       | ✅   | ❌   | ❌   |
| Delete bot        | ✅       | ✅   | ✅   | ❌   |
| Toggle visibility | ✅       | ✅   | ❌   | ❌   |
| Freeze CTO        | ✅       | ✅   | ✅   | ❌   |
| Freeze COO        | ✅       | ✅   | ❌   | ❌   |
| Freeze CEO        | ✅       | ❌   | ❌   | ❌   |
| Unfreeze anyone   | ✅       | ✅   | ❌   | ❌   |
| Manage staff list | ✅       | ❌   | ❌   | ❌   |


Hierarchy rank: founder=4, ceo=3, coo=2, cto=1. Freeze rule: `actor.rank > target.rank`. Unfreeze allowed only for founder/ceo.

Frozen users: can log in and see dashboard, every mutation rejected, banner shown.

## 5. Dashboard UI (`/dashboard`)

- **Sidebar** (role-aware): Overview · Bots · Staff (founder/ceo only) · Audit log (founder/ceo).
- **Overview**: stats, recent activity, frozen banner if applicable.
- **Bots page**: table of all bots with badges (visible/hidden), action buttons per row (Edit / Delete / Toggle visibility) gated by role. "New Bot" button for founder/ceo/cto.
- **Bot editor**: form for all fields + files repeater + banner upload.
- **Staff page**: list staff with role badges + Freeze/Unfreeze buttons gated by hierarchy.

## 6. Public site changes

- `lib/data.ts` removed; `app/codes/page.tsx` and `app/codes/[id]/page.tsx` fetch from `bots` table (only `is_visible = true`).
- Access code modal: validates against `bots.access_code`, opens `bots.filelink`.

## 7. Edge functions

- `discord-callback` — OAuth exchange + session mint
- `session-me`, `logout`
- `bots-create`, `bots-update`, `bots-delete`, `bots-toggle-visibility`
- `staff-freeze`, `staff-unfreeze`, `staff-list`

Each mutation function: verify JWT → load staff record → check `is_frozen` → check role permission → execute with `service_role` client → write audit log.

## 8. Build order

1. Rotate creds + add secrets (`DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `SESSION_JWT_SECRET`)
2. DB migration (tables + RLS + seed bots from data.ts)
3. Edge functions (auth + CRUD + freeze)
4. Dashboard UI
5. Refactor public `/codes` pages to read from DB
6. Smoke test full flow

## Notes / open items

- Discord OAuth redirect URI must be added in Discord Developer Portal → OAuth2 → Redirects. I'll give you the exact URL after deployment.
- "CTO can upload codes" — interpreted as: CTO can create new bot cards (incl. code files) but cannot edit/delete anything after creation, not even their own (matches your "can not make changes on other projects" wording extended).