/**
 * Hand-written to match supabase/migrations/0001_schema.sql.
 * Once a real Supabase project exists, regenerate with:
 *   npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
 * The shape (Database.public.Tables.<table>.Row/Insert/Update) matches the
 * Supabase CLI output, so the regenerated file is a drop-in replacement.
 */

export type UserRole = "candidate" | "employer" | "admin";
export type WorkMode = "remote" | "hybrid" | "onsite";
export type ContractType = "employment" | "b2b" | "mandate" | "temporary";
export type ExperienceLevel = "no_experience" | "junior" | "mid" | "senior";
export type SalaryPeriod = "month" | "year" | "hour";
export type JobStatus = "draft" | "pending_review" | "published" | "paused" | "rejected" | "expired" | "archived";
export type ApplicationStatus =
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          first_name: string | null;
          last_name: string | null;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          preferred_language: string;
          country: string | null;
          city: string | null;
          is_blocked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          preferred_language?: string;
          country?: string | null;
          city?: string | null;
          is_blocked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      candidate_profiles: {
        Row: {
          user_id: string;
          professional_title: string | null;
          summary: string | null;
          expected_salary_min: number | null;
          expected_salary_max: number | null;
          salary_currency: string;
          preferred_work_mode: WorkMode | null;
          relocation_ready: boolean;
          availability_date: string | null;
          profile_completion: number;
          email_verified: boolean;
          phone_verified: boolean;
          public_slug: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          professional_title?: string | null;
          summary?: string | null;
          expected_salary_min?: number | null;
          expected_salary_max?: number | null;
          salary_currency?: string;
          preferred_work_mode?: WorkMode | null;
          relocation_ready?: boolean;
          availability_date?: string | null;
          profile_completion?: number;
          email_verified?: boolean;
          phone_verified?: boolean;
          public_slug?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "candidate_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_experience: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          position: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          position: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_experience"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "candidate_experience_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_education: {
        Row: {
          id: string;
          user_id: string;
          institution: string;
          field: string | null;
          degree: string | null;
          start_date: string;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution: string;
          field?: string | null;
          degree?: string | null;
          start_date: string;
          end_date?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_education"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "candidate_education_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          level: SkillLevel | null;
          years_experience: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_name: string;
          level?: SkillLevel | null;
          years_experience?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_skills"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "candidate_skills_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      candidate_languages: {
        Row: {
          id: string;
          user_id: string;
          language_code: string;
          level: LanguageLevel;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          language_code: string;
          level: LanguageLevel;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_languages"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "candidate_languages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      companies: {
        Row: {
          id: string;
          owner_user_id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          cover_url: string | null;
          description: string | null;
          industry: string | null;
          website: string | null;
          country: string | null;
          city: string | null;
          employee_count: string | null;
          founded_year: number | null;
          verified: boolean;
          average_response_days: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          cover_url?: string | null;
          description?: string | null;
          industry?: string | null;
          website?: string | null;
          country?: string | null;
          city?: string | null;
          employee_count?: string | null;
          founded_year?: number | null;
          verified?: boolean;
          average_response_days?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "companies_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          slug: string;
          title: string;
          description: string | null;
          responsibilities: string[];
          requirements: string[];
          nice_to_have: string[];
          benefits: string[];
          country: string;
          city: string;
          work_mode: WorkMode;
          contract_type: ContractType;
          experience_level: ExperienceLevel;
          work_language: string | null;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          salary_period: SalaryPeriod;
          recruitment_process: string[];
          response_time_days: number | null;
          start_date: string | null;
          accommodation_provided: boolean;
          no_experience_required: boolean;
          status: JobStatus;
          published_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          slug: string;
          title: string;
          description?: string | null;
          responsibilities?: string[];
          requirements?: string[];
          nice_to_have?: string[];
          benefits?: string[];
          country: string;
          city: string;
          work_mode: WorkMode;
          contract_type: ContractType;
          experience_level: ExperienceLevel;
          work_language?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          salary_period?: SalaryPeriod;
          recruitment_process?: string[];
          response_time_days?: number | null;
          start_date?: string | null;
          accommodation_provided?: boolean;
          no_experience_required?: boolean;
          status?: JobStatus;
          published_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      job_skills: {
        Row: {
          id: string;
          job_id: string;
          skill_name: string;
          required: boolean;
        };
        Insert: {
          id?: string;
          job_id: string;
          skill_name: string;
          required?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["job_skills"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          }
        ];
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_user_id: string;
          employer_user_id: string;
          status: ApplicationStatus;
          message: string | null;
          expected_salary: number | null;
          availability_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_user_id: string;
          employer_user_id: string;
          status?: ApplicationStatus;
          message?: string | null;
          expected_salary?: number | null;
          availability_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_candidate_user_id_fkey";
            columns: ["candidate_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_employer_user_id_fkey";
            columns: ["employer_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["saved_jobs"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "saved_jobs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_jobs_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          }
        ];
      };
      application_events: {
        Row: {
          id: string;
          application_id: string;
          previous_status: ApplicationStatus | null;
          new_status: ApplicationStatus;
          changed_by: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          previous_status?: ApplicationStatus | null;
          new_status: ApplicationStatus;
          changed_by: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["application_events"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "application_events_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "application_events_changed_by_fkey";
            columns: ["changed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      job_views: {
        Row: {
          id: string;
          job_id: string;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          user_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["job_views"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "job_views_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_views_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      work_mode: WorkMode;
      contract_type: ContractType;
      experience_level: ExperienceLevel;
      salary_period: SalaryPeriod;
      job_status: JobStatus;
      application_status: ApplicationStatus;
      skill_level: SkillLevel;
      language_level: LanguageLevel;
    };
    CompositeTypes: Record<string, never>;
  };
};
