-- Rabotaj.com — core schema
-- Safe to re-run on a fresh database only. Do NOT run against a database
-- that already has application data without reviewing for conflicts first.

create extension if not exists "pgcrypto";

-- =========================================================================
-- ENUMS
-- =========================================================================

create type user_role as enum ('candidate', 'employer', 'admin');
create type work_mode as enum ('remote', 'hybrid', 'onsite');
create type contract_type as enum ('employment', 'b2b', 'mandate', 'temporary');
create type experience_level as enum ('no_experience', 'junior', 'mid', 'senior');
create type salary_period as enum ('month', 'year', 'hour');
create type job_status as enum (
  'draft', 'pending_review', 'published', 'paused', 'rejected', 'expired', 'archived'
);
create type application_status as enum (
  'submitted', 'viewed', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'
);
create type skill_level as enum ('beginner', 'intermediate', 'advanced', 'expert');
create type language_level as enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native');

-- =========================================================================
-- updated_at helper
-- =========================================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- profiles (1:1 with auth.users)
-- =========================================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'candidate',
  first_name text,
  last_name text,
  email text not null,
  phone text,
  avatar_url text,
  preferred_language text not null default 'pl',
  country text,
  city text,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row whenever a new auth user is created. Role and
-- name come from the signUp() `options.data` payload; 'admin' can never be
-- self-assigned at signup — only a server-side admin action may promote a
-- user, so we hard-clamp anything other than candidate/employer here.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'role';
  safe_role user_role := 'candidate';
begin
  if requested_role = 'employer' then
    safe_role := 'employer';
  end if;

  insert into public.profiles (id, role, first_name, last_name, email)
  values (
    new.id,
    safe_role,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =========================================================================
-- candidate_profiles (Career Passport)
-- =========================================================================

create table candidate_profiles (
  user_id uuid primary key references profiles(id) on delete cascade,
  professional_title text,
  summary text,
  expected_salary_min integer,
  expected_salary_max integer,
  salary_currency text not null default 'PLN',
  preferred_work_mode work_mode,
  relocation_ready boolean not null default false,
  availability_date date,
  profile_completion integer not null default 0,
  email_verified boolean not null default false,
  phone_verified boolean not null default false,
  public_slug text unique,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_salary_range_chk check (
    expected_salary_min is null or expected_salary_max is null or expected_salary_min <= expected_salary_max
  ),
  constraint candidate_profile_completion_chk check (profile_completion between 0 and 100)
);

create trigger candidate_profiles_set_updated_at
  before update on candidate_profiles
  for each row execute function set_updated_at();

create table candidate_experience (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  position text not null,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  description text,
  created_at timestamptz not null default now()
);

create index candidate_experience_user_id_idx on candidate_experience(user_id);

create table candidate_education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  institution text not null,
  field text,
  degree text,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

create index candidate_education_user_id_idx on candidate_education(user_id);

create table candidate_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  skill_name text not null,
  level skill_level,
  years_experience numeric(4, 1),
  created_at timestamptz not null default now(),
  unique (user_id, skill_name)
);

create index candidate_skills_user_id_idx on candidate_skills(user_id);

create table candidate_languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  language_code text not null,
  level language_level not null,
  created_at timestamptz not null default now(),
  unique (user_id, language_code)
);

create index candidate_languages_user_id_idx on candidate_languages(user_id);

-- =========================================================================
-- companies
-- =========================================================================

create table companies (
  id uuid primary key default gen_random_uuid(),
  -- One company per employer account — matches the singular /employer/company route.
  owner_user_id uuid not null unique references profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  cover_url text,
  description text,
  industry text,
  website text,
  country text,
  city text,
  employee_count text,
  founded_year integer,
  verified boolean not null default false,
  average_response_days numeric(4, 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index companies_owner_user_id_idx on companies(owner_user_id);

create trigger companies_set_updated_at
  before update on companies
  for each row execute function set_updated_at();

-- =========================================================================
-- jobs
-- =========================================================================

create table jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  nice_to_have text[] not null default '{}',
  benefits text[] not null default '{}',
  country text not null,
  city text not null,
  work_mode work_mode not null,
  contract_type contract_type not null,
  experience_level experience_level not null,
  work_language text,
  salary_min integer,
  salary_max integer,
  salary_currency text not null default 'PLN',
  salary_period salary_period not null default 'month',
  recruitment_process text[] not null default '{}',
  response_time_days integer,
  start_date date,
  accommodation_provided boolean not null default false,
  no_experience_required boolean not null default false,
  status job_status not null default 'draft',
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_salary_range_chk check (salary_min is null or salary_max is null or salary_min <= salary_max)
);

create index jobs_company_id_idx on jobs(company_id);
create index jobs_status_published_at_idx on jobs(status, published_at desc);
create index jobs_country_city_idx on jobs(country, city);
create index jobs_work_mode_idx on jobs(work_mode);

create trigger jobs_set_updated_at
  before update on jobs
  for each row execute function set_updated_at();

create table job_skills (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  skill_name text not null,
  required boolean not null default true,
  unique (job_id, skill_name)
);

create index job_skills_job_id_idx on job_skills(job_id);

-- =========================================================================
-- applications + status history
-- =========================================================================

create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  candidate_user_id uuid not null references profiles(id) on delete cascade,
  employer_user_id uuid not null references profiles(id) on delete cascade,
  status application_status not null default 'submitted',
  message text,
  expected_salary integer,
  availability_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One application per candidate per job — the DB-level duplicate-application guard.
  unique (job_id, candidate_user_id)
);

create index applications_job_id_idx on applications(job_id);
create index applications_candidate_user_id_idx on applications(candidate_user_id);
create index applications_employer_user_id_idx on applications(employer_user_id);

create trigger applications_set_updated_at
  before update on applications
  for each row execute function set_updated_at();

create table application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  previous_status application_status,
  new_status application_status not null,
  changed_by uuid not null references profiles(id),
  note text,
  created_at timestamptz not null default now()
);

create index application_events_application_id_idx on application_events(application_id);

-- Every application status change is mirrored into application_events —
-- enforced in the database so no code path can skip the audit trail.
create or replace function log_application_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into application_events (application_id, previous_status, new_status, changed_by)
    values (new.id, null, new.status, coalesce(auth.uid(), new.candidate_user_id));
  elsif tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into application_events (application_id, previous_status, new_status, changed_by)
    values (new.id, old.status, new.status, coalesce(auth.uid(), new.candidate_user_id));
  end if;
  return new;
end;
$$;

create trigger applications_log_status_change
  after insert or update on applications
  for each row execute function log_application_status_change();

-- =========================================================================
-- saved_jobs
-- =========================================================================

create table saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create index saved_jobs_user_id_idx on saved_jobs(user_id);

-- =========================================================================
-- job_views (lightweight analytics)
-- =========================================================================

create table job_views (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index job_views_job_id_idx on job_views(job_id);
