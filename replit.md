# Snap-Z Development

Discord bot tutorial site — browse and download Discord bot source code snippets organized by category.

## Run & Operate

- `pnpm --filter @workspace/snapz-dev run dev` — Vite frontend (port 5173)
- `pnpm --filter @workspace/api-server run dev` — Express API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `DASHBOARD_API_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS v4 (deployed on Vercel at code.snapz.dev)
- API: Express 5 (deployed on Replit port 8080)
- DB: GitHub repo as JSON database (`db/data.json` in the GitHub repo)
- API client: Octokit (`@octokit/rest`)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/snapz-dev/` — React/Vite frontend
  - `src/lib/api-client.ts` — fetch wrapper (reads `VITE_API_URL` || uses Vite proxy)
  - `src/lib/bots.ts` — public bots API calls
  - `src/lib/dashboard-api.ts` — admin dashboard API calls
  - `src/lib/data.ts` — categories, subcategories, static types
  - `src/pages/` — all pages including dashboard
- `artifacts/api-server/` — Express backend
  - `src/lib/github.ts` — Octokit wrapper (read/write JSON files in GitHub repo)
  - `src/lib/db.ts` — database helpers (reads/writes `db/data.json`)
  - `src/routes/bots.ts` — public GET + admin CRUD for bots
  - `src/routes/auth.ts` — simple API-key login (`POST /api/auth/login`, `GET /api/auth/me`)
  - `src/routes/content.ts` — legacy content route

## Architecture decisions

- **GitHub as database** — `db/data.json` in the GitHub repo stores all bots. Each write is a commit. Reads fetch the file directly via GitHub Contents API.
- **No Supabase** — the project never used Supabase; Supabase code was introduced by mistake during migration and has been fully removed.
- **Simple auth** — dashboard uses a single `DASHBOARD_API_KEY` secret. No Discord OAuth. Users enter the key on login; it is sent as `Authorization: Bearer <key>` on all admin requests.
- **GITHUB_OWNER/REPO parsing** — both env vars tolerate full GitHub URLs (e.g. `https://github.com/owner`) as well as plain names. The server extracts the last path segment.
- **Vite proxy** — in development, `/api` is proxied to `http://localhost:8080`. In production (Vercel), set `VITE_API_URL` to the deployed API server URL.

## Product

- Public home page: browse visible bot snippets by category/subcategory, filter by difficulty, view code files
- Staff dashboard (`/dashboard`): login with API key, create/edit/delete/show-hide bots, audit log

## User preferences

- Blue brand theme: `#0A0A0A` bg, `#3A8FD4` primary, `#5BB8F5` accent, `#1E3A5F` border/glow
- Snapz Development logo as favicon and in navbar

## Gotchas

- GITHUB_OWNER and GITHUB_REPO may be stored as full GitHub URLs — the server parses them automatically
- After deploying the API server on Replit, set `VITE_API_URL` in Vercel env vars and redeploy the frontend
- The `db/data.json` file is auto-created in the GitHub repo on the first bot write — no manual setup needed
- `supabase.ts` remains in the codebase but is unused — safe to delete if desired

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
