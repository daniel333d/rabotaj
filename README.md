# Rabotaj.com

Job platform for Poland, Ukraine, and Central/Eastern Europe. Next.js App
Router frontend (unchanged from the design/demo phase) now backed by a real
Supabase project: auth, Postgres with Row Level Security, and Server
Actions for every write path.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`) — Postgres, Auth, RLS
- Zod for form/server-action validation
- Vitest for unit tests

## Local development

```bash
npm install
npm run dev
```

The app **runs and builds without any Supabase configuration** — every
Supabase-backed page/action checks `isSupabaseConfigured()` first and falls
back to the bundled demo data (`lib/data/jobs.ts`, `lib/data/companies.ts`)
or a "backend not configured" notice. This means you can work on the UI
without a database, and the production deployment never breaks even before
Supabase is wired up.

To get the real backend working locally:

```bash
cp .env.example .env.local
# fill in the three variables — see "Supabase project setup" below
npm run dev
```

## Supabase project setup

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only,
     never commit this, never expose it to the browser — see
     `lib/supabase/admin.ts`)
3. Run the migrations against your project, in order:
   ```bash
   # using the Supabase CLI (recommended)
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
   Or paste the contents of `supabase/migrations/0001_schema.sql` then
   `supabase/migrations/0002_rls.sql` into the SQL editor, in that order.
4. (Optional, local/dev only — see warning below) Seed demo data:
   ```bash
   psql "$DATABASE_URL" -f supabase/seed.sql
   ```
   `supabase/seed.sql` creates 8 demo companies, 32 jobs across 4 countries,
   and 2 demo candidate accounts (see the file header for login details).
   **Do not run this against a production database with real users** — it
   inserts directly into `auth.users` with a known demo password.
5. Regenerate typed database bindings once your schema is live (the
   checked-in `lib/supabase/database.types.ts` was hand-written to match
   the migrations and works today, but the CLI output is authoritative
   going forward):
   ```bash
   npx supabase gen types typescript --project-id <your-project-ref> > lib/supabase/database.types.ts
   ```
6. In Supabase Auth settings, set the **Site URL** and **Redirect URLs** to
   your deployed domain (and `http://localhost:3000` for local dev) — the
   email confirmation and password-reset flows redirect through
   `app/auth/callback/route.ts`.

See `supabase/RLS_TESTING.md` for a manual verification checklist covering
every Row Level Security policy — it wasn't possible to run automated
policy tests in this environment (no Docker/Supabase CLI available), so
that checklist is the next step before trusting RLS in production.

## Environment variables

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server | Safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server | Safe to expose, RLS-scoped |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | **Secret.** Bypasses RLS. Only read in `lib/supabase/admin.ts`, only used after `lib/auth/require-admin.ts` confirms the caller's own session is an admin |

### Setting them in Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# repeat for preview/development environments as needed
```

Or via the dashboard: **Project → Settings → Environment Variables**. After
adding them, trigger a new deployment (env var changes don't apply to
already-built deployments).

## Testing

```bash
npm test        # vitest — Rabotaj Score, profile completion, Zod schemas,
                 # application status mapping
npm run lint     # eslint
npm run verify   # tsc --noEmit
npm run build    # production build
```

Unit tests cover pure logic only (scoring, validation, status mapping) —
they don't hit a database. RLS and end-to-end auth flows need a real
Supabase project; see `supabase/RLS_TESTING.md`.

## Project structure

```
app/                      routes (App Router)
  jobs/, companies/        public listings — Supabase-backed with demo-data fallback
  dashboard/                candidate dashboard (tabs: overview, applications, saved, passport, alerts, settings)
  career-passport/          candidate profile editor (falls back to marketing page when logged out)
  profile/[slug]/           public Career Passport view
  employer/                 employer panel (dashboard, company, jobs, job wizard, applications)
  admin/                    admin panel (stats, job moderation, company verification, user blocking)
  auth/callback/             Supabase email-confirmation / password-recovery redirect handler
lib/
  supabase/                 browser/server/admin clients, generated-style DB types, config guard
  actions/                  Server Actions (auth, jobs, candidate, employer, admin)
  data/                     Supabase data fetchers + adapters that map DB rows onto the
                             existing UI's `Job`/`Company` shape, and the original static
                             demo datasets used as fallback
  validation/                Zod schemas
  rabotaj-score.ts           Rabotaj Score calculation (unchanged from the design phase)
  profile-completion.ts      Career Passport completion calculation
components/                 UI components (unchanged design system: rabotaj-score/, jobs/,
                             companies/, home/, layout/, ui/) plus new career-passport/,
                             employer/, admin/ folders for the new authenticated panels
supabase/
  migrations/                 SQL schema + RLS policies, run in order
  seed.sql                    demo data (not run automatically anywhere)
  RLS_TESTING.md               manual policy verification checklist
```

## What's deliberately out of scope / simplified

- **Job alerts**: the "Alerty" dashboard tab is a UI placeholder — no
  `job_alerts` table exists (not in the original schema spec), so there's
  nothing to persist yet.
- **Candidate-job matching**: `matchPercent` on Supabase-sourced jobs is a
  neutral placeholder (no matching algorithm was in scope).
- **Deep employer/admin form copy** is Polish-only; the public-facing
  candidate flows (auth, job cards, apply/save, Rabotaj Score) keep the
  full PL/UA/RU/EN/DE/ES translations from the design phase.
