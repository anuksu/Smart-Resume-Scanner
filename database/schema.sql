-- Run this in Supabase Dashboard → SQL Editor
-- All tables are connected via user_id → auth.users(id)


-- ============================================================
-- 1. USER_PROFILE (extends Supabase Auth with extra user info)
-- ============================================================
create table if not exists user_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text default 'seeker',
  profile_picture text,
  email text,
  phone text,
  location text,
  linkedin_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_profile enable row level security;

create policy "Users can view their own profile"
  on user_profile for select using (auth.uid() = id);

create policy "Users can insert their own profile"
  on user_profile for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on user_profile for update using (auth.uid() = id);


-- ============================================================
-- 2. USER_RESUME (uploaded resume files)
-- ============================================================
create table if not exists user_resume (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  file_url text,
  extracted_text text,
  created_at timestamptz default now()
);

create index if not exists idx_user_resume_user_id on user_resume(user_id);
alter table user_resume enable row level security;

create policy "Users can view their own resumes"
  on user_resume for select using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
  on user_resume for insert with check (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on user_resume for delete using (auth.uid() = user_id);


-- ============================================================
-- 3. USER_EDUCATION
-- ============================================================
create table if not exists user_education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  education text not null,
  specialisation text,
  year text,
  created_at timestamptz default now()
);

create index if not exists idx_user_education_user_id on user_education(user_id);
alter table user_education enable row level security;

create policy "Users can view their own education"
  on user_education for select using (auth.uid() = user_id);

create policy "Users can insert their own education"
  on user_education for insert with check (auth.uid() = user_id);

create policy "Users can update their own education"
  on user_education for update using (auth.uid() = user_id);

create policy "Users can delete their own education"
  on user_education for delete using (auth.uid() = user_id);


-- ============================================================
-- 4. USER_CERTIFICATION
-- ============================================================
create table if not exists user_certification (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  year text,
  created_at timestamptz default now()
);

create index if not exists idx_user_certification_user_id on user_certification(user_id);
alter table user_certification enable row level security;

create policy "Users can view their own certifications"
  on user_certification for select using (auth.uid() = user_id);

create policy "Users can insert their own certifications"
  on user_certification for insert with check (auth.uid() = user_id);

create policy "Users can update their own certifications"
  on user_certification for update using (auth.uid() = user_id);

create policy "Users can delete their own certifications"
  on user_certification for delete using (auth.uid() = user_id);


-- ============================================================
-- 5. USER_SKILLS
-- ============================================================
create table if not exists user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  skill_name text not null,
  created_at timestamptz default now()
);

create index if not exists idx_user_skills_user_id on user_skills(user_id);
alter table user_skills enable row level security;

create policy "Users can view their own skills"
  on user_skills for select using (auth.uid() = user_id);

create policy "Users can insert their own skills"
  on user_skills for insert with check (auth.uid() = user_id);

create policy "Users can delete their own skills"
  on user_skills for delete using (auth.uid() = user_id);


-- ============================================================
-- 6. USER_JOBDESCRIPTION (user's own job experience from resume)
-- ============================================================
create table if not exists user_jobdescription (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  job_title text not null,
  company text,
  location text,
  start_date text,
  end_date text,
  description text,
  created_at timestamptz default now()
);

create index if not exists idx_user_jobdescription_user_id on user_jobdescription(user_id);
alter table user_jobdescription enable row level security;

create policy "Users can view their own job descriptions"
  on user_jobdescription for select using (auth.uid() = user_id);

create policy "Users can insert their own job descriptions"
  on user_jobdescription for insert with check (auth.uid() = user_id);

create policy "Users can update their own job descriptions"
  on user_jobdescription for update using (auth.uid() = user_id);

create policy "Users can delete their own job descriptions"
  on user_jobdescription for delete using (auth.uid() = user_id);


-- ============================================================
-- 7. COMPANY_JOBDESCRIPTION (JD pasted from company job portal)
-- ============================================================
create table if not exists company_jobdescription (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  company text,
  description text not null,
  location text,
  experience_required text,
  education_required text,
  created_at timestamptz default now()
);

create index if not exists idx_company_jobdescription_user_id on company_jobdescription(user_id);
alter table company_jobdescription enable row level security;

create policy "Users can view their own company jds"
  on company_jobdescription for select using (auth.uid() = user_id);

create policy "Users can insert their own company jds"
  on company_jobdescription for insert with check (auth.uid() = user_id);

create policy "Users can delete their own company jds"
  on company_jobdescription for delete using (auth.uid() = user_id);


-- ============================================================
-- 8. COMPANY_SKILL (skills extracted from company JD)
-- ============================================================
create table if not exists company_skill (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company_jobdescription_id uuid references company_jobdescription(id) on delete cascade not null,
  skill_name text not null,
  created_at timestamptz default now()
);

create index if not exists idx_company_skill_user_id on company_skill(user_id);
create index if not exists idx_company_skill_jd_id on company_skill(company_jobdescription_id);
alter table company_skill enable row level security;

create policy "Users can view their own company skills"
  on company_skill for select using (auth.uid() = user_id);

create policy "Users can insert their own company skills"
  on company_skill for insert with check (auth.uid() = user_id);

create policy "Users can delete their own company skills"
  on company_skill for delete using (auth.uid() = user_id);


-- ============================================================
-- 9. VALIDATE_SKILLS (AI comparison — per company JD)
-- ============================================================
create table if not exists validate_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company_jobdescription_id uuid references company_jobdescription(id) on delete cascade not null,
  skill_name text not null,
  match boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_validate_skills_user_id on validate_skills(user_id);
create index if not exists idx_validate_skills_jd_id on validate_skills(company_jobdescription_id);
alter table validate_skills enable row level security;

create policy "Users can view their own skill validations"
  on validate_skills for select using (auth.uid() = user_id);

create policy "Users can insert their own skill validations"
  on validate_skills for insert with check (auth.uid() = user_id);

create policy "Users can delete their own skill validations"
  on validate_skills for delete using (auth.uid() = user_id);


-- ============================================================
-- 10. VALIDATE_JOBDESCRIPTION (full AI analysis results)
-- ============================================================
create table if not exists validate_jobdescription (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company_jobdescription_id uuid references company_jobdescription(id) on delete cascade not null,
  resume_id uuid references user_resume(id) on delete set null,
  overall_score integer default 0,
  experience_match boolean default false,
  education_match boolean default false,
  location_match boolean default false,
  missing_keywords jsonb default '[]'::jsonb,
  rewrite_suggestions jsonb default '[]'::jsonb,
  ats_bullet_points jsonb default '[]'::jsonb,
  resume_update_guide jsonb default '{}'::jsonb,
  results jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_validate_jobdescription_user_id on validate_jobdescription(user_id);
create index if not exists idx_validate_jobdescription_jd_id on validate_jobdescription(company_jobdescription_id);
alter table validate_jobdescription enable row level security;

create policy "Users can view their own jd validations"
  on validate_jobdescription for select using (auth.uid() = user_id);

create policy "Users can insert their own jd validations"
  on validate_jobdescription for insert with check (auth.uid() = user_id);

create policy "Users can delete their own jd validations"
  on validate_jobdescription for delete using (auth.uid() = user_id);


-- ============================================================
-- 11. USER_CONTACT_MESSAGE (contact form submissions)
-- ============================================================
create table if not exists user_contact_message (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table user_contact_message enable row level security;

create policy "Anyone can insert contact messages"
  on user_contact_message for insert with check (true);

