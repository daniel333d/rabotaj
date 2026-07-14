-- Rabotaj.com — Row Level Security
-- Admin access is intentionally NOT modeled as an RLS bypass policy here.
-- Per spec, admin actions run exclusively server-side via the service-role
-- client (lib/supabase/admin.ts), which bypasses RLS entirely after the
-- caller's own session has been checked for role === 'admin' server-side.
-- This keeps "who is an admin" out of client-evaluated policy logic.

alter table profiles enable row level security;
alter table candidate_profiles enable row level security;
alter table candidate_experience enable row level security;
alter table candidate_education enable row level security;
alter table candidate_skills enable row level security;
alter table candidate_languages enable row level security;
alter table companies enable row level security;
alter table jobs enable row level security;
alter table job_skills enable row level security;
alter table applications enable row level security;
alter table saved_jobs enable row level security;
alter table application_events enable row level security;
alter table job_views enable row level security;

-- =========================================================================
-- profiles
-- =========================================================================

create policy "profiles_select_own" on profiles
  for select using (id = auth.uid());

-- An employer may see the basic profile of a candidate who applied to one
-- of their jobs (needed to review applications).
create policy "profiles_select_by_employer_for_applicants" on profiles
  for select using (
    exists (
      select 1 from applications a
      where a.candidate_user_id = profiles.id
        and a.employer_user_id = auth.uid()
    )
  );

-- Public Career Passport: a candidate's profile is readable when their
-- candidate_profiles row is marked public.
create policy "profiles_select_public_passport" on profiles
  for select using (
    exists (
      select 1 from candidate_profiles cp
      where cp.user_id = profiles.id and cp.is_public = true
    )
  );

-- Self-update only; role can never be changed from the client (only a
-- server-side admin action using the service-role key may promote a user).
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from profiles p where p.id = auth.uid()));

-- =========================================================================
-- candidate_profiles
-- =========================================================================

create policy "candidate_profiles_select_own" on candidate_profiles
  for select using (user_id = auth.uid());

create policy "candidate_profiles_select_public" on candidate_profiles
  for select using (is_public = true);

create policy "candidate_profiles_select_by_employer" on candidate_profiles
  for select using (
    exists (
      select 1 from applications a
      where a.candidate_user_id = candidate_profiles.user_id and a.employer_user_id = auth.uid()
    )
  );

create policy "candidate_profiles_insert_own" on candidate_profiles
  for insert with check (user_id = auth.uid());

create policy "candidate_profiles_update_own" on candidate_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "candidate_profiles_delete_own" on candidate_profiles
  for delete using (user_id = auth.uid());

-- =========================================================================
-- candidate_experience / candidate_education / candidate_skills / candidate_languages
-- Same shape for all four: owner full access, readable when the owning
-- Career Passport is public, readable by an employer reviewing the
-- candidate's application.
-- =========================================================================

create policy "candidate_experience_select_own" on candidate_experience
  for select using (user_id = auth.uid());
create policy "candidate_experience_select_public" on candidate_experience
  for select using (exists (select 1 from candidate_profiles cp where cp.user_id = candidate_experience.user_id and cp.is_public = true));
create policy "candidate_experience_select_by_employer" on candidate_experience
  for select using (exists (select 1 from applications a where a.candidate_user_id = candidate_experience.user_id and a.employer_user_id = auth.uid()));
create policy "candidate_experience_write_own" on candidate_experience
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "candidate_education_select_own" on candidate_education
  for select using (user_id = auth.uid());
create policy "candidate_education_select_public" on candidate_education
  for select using (exists (select 1 from candidate_profiles cp where cp.user_id = candidate_education.user_id and cp.is_public = true));
create policy "candidate_education_select_by_employer" on candidate_education
  for select using (exists (select 1 from applications a where a.candidate_user_id = candidate_education.user_id and a.employer_user_id = auth.uid()));
create policy "candidate_education_write_own" on candidate_education
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "candidate_skills_select_own" on candidate_skills
  for select using (user_id = auth.uid());
create policy "candidate_skills_select_public" on candidate_skills
  for select using (exists (select 1 from candidate_profiles cp where cp.user_id = candidate_skills.user_id and cp.is_public = true));
create policy "candidate_skills_select_by_employer" on candidate_skills
  for select using (exists (select 1 from applications a where a.candidate_user_id = candidate_skills.user_id and a.employer_user_id = auth.uid()));
create policy "candidate_skills_write_own" on candidate_skills
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "candidate_languages_select_own" on candidate_languages
  for select using (user_id = auth.uid());
create policy "candidate_languages_select_public" on candidate_languages
  for select using (exists (select 1 from candidate_profiles cp where cp.user_id = candidate_languages.user_id and cp.is_public = true));
create policy "candidate_languages_select_by_employer" on candidate_languages
  for select using (exists (select 1 from applications a where a.candidate_user_id = candidate_languages.user_id and a.employer_user_id = auth.uid()));
create policy "candidate_languages_write_own" on candidate_languages
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- =========================================================================
-- companies — public company pages, owner-managed
-- =========================================================================

create policy "companies_select_all" on companies
  for select using (true);

create policy "companies_insert_own" on companies
  for insert with check (
    owner_user_id = auth.uid()
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'employer')
  );

create policy "companies_update_own" on companies
  for update using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

create policy "companies_delete_own" on companies
  for delete using (owner_user_id = auth.uid());

-- =========================================================================
-- jobs
-- =========================================================================

create policy "jobs_select_published_or_own" on jobs
  for select using (
    status = 'published'
    or exists (select 1 from companies c where c.id = jobs.company_id and c.owner_user_id = auth.uid())
  );

create policy "jobs_insert_own_company" on jobs
  for insert with check (
    exists (select 1 from companies c where c.id = company_id and c.owner_user_id = auth.uid())
    and status in ('draft', 'pending_review')
  );

-- Employers manage their own jobs but can never self-publish or self-reject —
-- those transitions are admin-only (via the service-role client).
create policy "jobs_update_own_company" on jobs
  for update using (
    exists (select 1 from companies c where c.id = jobs.company_id and c.owner_user_id = auth.uid())
  )
  with check (
    exists (select 1 from companies c where c.id = jobs.company_id and c.owner_user_id = auth.uid())
    and status not in ('published', 'rejected')
  );

create policy "jobs_delete_own_draft" on jobs
  for delete using (
    status = 'draft'
    and exists (select 1 from companies c where c.id = jobs.company_id and c.owner_user_id = auth.uid())
  );

-- =========================================================================
-- job_skills — visibility/ownership mirrors the parent job
-- =========================================================================

create policy "job_skills_select" on job_skills
  for select using (
    exists (
      select 1 from jobs j
      where j.id = job_skills.job_id
        and (j.status = 'published' or exists (select 1 from companies c where c.id = j.company_id and c.owner_user_id = auth.uid()))
    )
  );

create policy "job_skills_write_own" on job_skills
  for all using (
    exists (
      select 1 from jobs j join companies c on c.id = j.company_id
      where j.id = job_skills.job_id and c.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from jobs j join companies c on c.id = j.company_id
      where j.id = job_skills.job_id and c.owner_user_id = auth.uid()
    )
  );

-- =========================================================================
-- applications
-- =========================================================================

create policy "applications_select_participant" on applications
  for select using (candidate_user_id = auth.uid() or employer_user_id = auth.uid());

-- employer_user_id is derived from the job's own company owner, never taken
-- from client input, so a candidate cannot misroute an application.
create policy "applications_insert_own" on applications
  for insert with check (
    candidate_user_id = auth.uid()
    and exists (select 1 from jobs j where j.id = job_id and j.status = 'published')
    and employer_user_id = (
      select c.owner_user_id from jobs j join companies c on c.id = j.company_id where j.id = job_id
    )
  );

-- Candidate: may only withdraw their own application (no other field or
-- status value may change) — enforced together with the trigger below.
create policy "applications_update_candidate_withdraw" on applications
  for update using (candidate_user_id = auth.uid())
  with check (candidate_user_id = auth.uid() and status = 'withdrawn');

-- Employer: may move the application through the recruitment pipeline for
-- their own jobs, but may never set it back to 'withdrawn' (candidate-only).
create policy "applications_update_employer_pipeline" on applications
  for update using (employer_user_id = auth.uid())
  with check (employer_user_id = auth.uid() and status <> 'withdrawn');

-- Belt-and-braces column guard: when the candidate is the one making the
-- change, only `status` (to 'withdrawn') may differ from the stored row —
-- RLS alone is row-level and can't express "only this column changed".
create or replace function enforce_candidate_application_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() = old.candidate_user_id and auth.uid() <> old.employer_user_id then
    if new.status <> 'withdrawn'
      or new.job_id <> old.job_id
      or new.candidate_user_id <> old.candidate_user_id
      or new.employer_user_id <> old.employer_user_id
      or new.message is distinct from old.message
      or new.expected_salary is distinct from old.expected_salary
      or new.availability_date is distinct from old.availability_date
    then
      raise exception 'candidates may only withdraw their own application';
    end if;
  end if;
  return new;
end;
$$;

create trigger applications_enforce_candidate_update
  before update on applications
  for each row execute function enforce_candidate_application_update();

-- =========================================================================
-- saved_jobs
-- =========================================================================

create policy "saved_jobs_select_own" on saved_jobs
  for select using (user_id = auth.uid());

create policy "saved_jobs_insert_own" on saved_jobs
  for insert with check (user_id = auth.uid());

create policy "saved_jobs_delete_own" on saved_jobs
  for delete using (user_id = auth.uid());

-- =========================================================================
-- application_events — system-managed audit trail (no direct writes)
-- =========================================================================

create policy "application_events_select_participant" on application_events
  for select using (
    exists (
      select 1 from applications a
      where a.id = application_events.application_id
        and (a.candidate_user_id = auth.uid() or a.employer_user_id = auth.uid())
    )
  );

-- =========================================================================
-- job_views
-- =========================================================================

create policy "job_views_insert_any" on job_views
  for insert with check (
    (user_id is null or user_id = auth.uid())
    and exists (select 1 from jobs j where j.id = job_id and j.status = 'published')
  );

create policy "job_views_select_by_owner" on job_views
  for select using (
    exists (
      select 1 from jobs j join companies c on c.id = j.company_id
      where j.id = job_views.job_id and c.owner_user_id = auth.uid()
    )
  );
