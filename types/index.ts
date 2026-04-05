export interface Requirements {
  location: string | null;
  visa: string | null;
  experience: string | null;
  certifications: string | null;
}

export interface ATSKeywords {
  matched: string[];
  missing: string[];
  match_rate: number;
}

export interface AnalysisResult {
  score: number;
  strengths: string[];
  gaps: string[];
  requirements: Requirements;
  ats_keywords: ATSKeywords;
  recommendations: string[];
  cover_letter: string;
  company_name: string | null;
  application_link: string | null;
  contact_email: string | null;
}

export interface Analysis extends AnalysisResult {
  id: string;
  created_at: string;
  job_description: string;
  resume_text: string;
  user_id: string;
}

export interface Profile {
  id: string;
  name: string | null;
  created_at: string;
}

export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  company_url: string | null;
  job_url: string | null;
  status: JobStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
}

