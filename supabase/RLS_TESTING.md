# RLS verification

This environment has no Docker / Supabase CLI available, so the Row Level
Security policies in `migrations/0002_rls.sql` could not be exercised against
a running Postgres instance during development — only reviewed line-by-line
against the rules in the spec. **Run the checks below once a real Supabase
project exists**, either via `supabase test db` (pgTAP, if you set it up) or
manually through the SQL editor / two browser sessions logged in as
different demo users from `seed.sql`.

Demo accounts (password `Password123!` for all, see `seed.sql`):
- `employer.technova@example.com` — owns the TechNova company
- `employer.nordcargo@example.com` — owns a different company
- `candidate.demo@example.com` — has one application (to a TechNova job)
- `candidate.demo2@example.com` — has no applications

## Candidate checks

1. Log in as `candidate.demo@example.com`.
   - [ ] Can `select`/`update` their own `profiles` row, but an `update`
     attempting to change `role` to `employer` is rejected or silently no-ops.
   - [ ] Can `insert`/`update`/`delete` their own `candidate_profiles`,
     `candidate_experience`, `candidate_education`, `candidate_skills`,
     `candidate_languages` rows.
   - [ ] Cannot read `candidate_profiles` / `candidate_experience` etc. for
     `candidate.demo2@example.com` (not public, no shared application).
   - [ ] Can `insert` into `applications` for a `published` job with
     `candidate_user_id` = their own id.
   - [ ] Cannot `insert` a second `applications` row for a job they already
     applied to (unique constraint `(job_id, candidate_user_id)` — expect a
     `23505` error).
   - [ ] Can `update` their own application's `status` to `withdrawn` only —
     attempting any other status value, or changing `message`/
     `expected_salary` in the same statement, is rejected by
     `enforce_candidate_application_update`.
   - [ ] Can `insert`/`delete` their own `saved_jobs` rows; cannot see or
     modify another candidate's saved jobs.
   - [ ] Can `select` `application_events` for their own applications only.

2. Log in as `candidate.demo2@example.com`.
   - [ ] Cannot `select` `candidate.demo`'s private (non-public)
     `candidate_profiles` row.
   - [ ] Cannot `update` an `applications` row belonging to `candidate.demo`.

## Employer checks

1. Log in as `employer.technova@example.com`.
   - [ ] Can `update` their own `companies` row; cannot `update` another
     employer's company row.
   - [ ] Can `insert` a `jobs` row for their own `company_id` with
     `status` in `('draft', 'pending_review')` — attempting to `insert`
     directly with `status = 'published'` is rejected.
   - [ ] Can `update` their own jobs, but attempting to set
     `status = 'published'` or `status = 'rejected'` via a direct `update`
     is rejected (only the admin/service-role path may do this).
   - [ ] Can `select` `applications` where `employer_user_id` = their id;
     cannot see applications for jobs owned by `employer.nordcargo@example.com`.
   - [ ] Can `update` an application's `status` to any value except
     `withdrawn`.
   - [ ] Can `select` `profiles` / `candidate_profiles` for a candidate who
     applied to one of their jobs; cannot for a candidate who never applied.
   - [ ] Can `select` `job_views` for their own jobs (basic analytics);
     cannot for another employer's jobs.

2. Log in as `employer.nordcargo@example.com`.
   - [ ] Cannot `update` or `delete` TechNova's `companies` row.
   - [ ] Cannot `update` a TechNova job.

## Public / anonymous checks

- [ ] `select * from jobs` (no session) returns only `status = 'published'`
  rows.
- [ ] `select * from companies` (no session) returns all rows (company pages
  are public marketing pages by design — see `0002_rls.sql` comments).
- [ ] `select * from candidate_profiles` (no session) returns only rows
  where `is_public = true`.
- [ ] `insert into job_views` works for anonymous requests against a
  published job (`user_id` left null).

## Admin checks

- [ ] The regular (anon-key, RLS-scoped) client, even when logged in as the
  admin demo user, still can't bypass employer/candidate ownership checks —
  admin elevation only happens through `lib/supabase/admin.ts` (service-role)
  after `lib/auth/require-admin.ts` confirms `profiles.role = 'admin'` for
  the caller's own session.
- [ ] `approveJobAction` / `rejectJobAction` / `verifyCompanyAction` /
  `blockUserAction` (in `lib/actions/admin.ts`) fail closed (return
  `{ ok: false }`) when called by a non-admin session — verify by
  temporarily calling one from a candidate/employer session and confirming
  no row changes.

If any of the above fails once you're on a real project, the fix almost
always lives in `supabase/migrations/0002_rls.sql` — re-run that migration
after editing (Supabase migrations are not automatically re-applied on
edit; you need a new migration file for changes to an already-deployed
project).
