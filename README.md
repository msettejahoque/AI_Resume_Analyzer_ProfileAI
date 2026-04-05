# ProFileAI

AI-powered resume analyzer that scores your resume against any job description, identifies gaps, matches ATS keywords, and generates tailored cover letters.

🔗 **Live:** [getclarityai.vercel.app](https://getclarityai.vercel.app)

---

## Features

- **AI Match Score** — Get a 0-100 match score between your resume and any job description
- **ATS Keyword Analysis** — See exactly which keywords you're missing and which you have
- **Strengths & Gaps** — Understand what's working and what needs improvement
- **Tailored Cover Letter** — AI-generated cover letter based on your resume and the job
- **Smart Recommendations** — Actionable steps to improve your resume for the specific role
- **Requirements Detection** — Automatically flags visa, location, and experience requirements
- **Job Application Tracker** — Track applications with status, notes, and important links
- **PDF Resume Upload** — Upload your resume as a PDF or paste text directly
- **Analysis History** — Revisit all your past analyses anytime

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Email, Google, GitHub) |
| AI | Google Gemini 2.5 Flash |
| UI Components | shadcn/ui |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Google Gemini API key

### Installation
```bash
git clone https://github.com/prio12/ClarityAI.git
cd clarityai
npm install
```

### Environment Variables

Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### Database Setup

Run these SQL queries in your Supabase SQL editor:
```sql
-- Analyses table
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  score INTEGER NOT NULL,
  strengths TEXT[] NOT NULL,
  gaps TEXT[] NOT NULL,
  requirements JSONB NOT NULL,
  ats_keywords JSONB NOT NULL,
  recommendations TEXT[] NOT NULL,
  cover_letter TEXT NOT NULL,
  company_name TEXT,
  application_link TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Job applications table
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company_url TEXT,
  job_url TEXT,
  status TEXT DEFAULT 'Applied' NOT NULL,
  applied_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

Enable RLS on all tables and add appropriate policies.

### Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure
```
clarityai/
├── app/
│   ├── (auth)/          # Login, signup, check-email
│   ├── (dashboard)/     # Dashboard, analyze, results, history, tracker, settings
│   ├── api/             # API routes (analyze, delete-account)
│   └── auth/            # Auth callback routes
├── components/
│   ├── dashboard/       # Dashboard-specific components
│   ├── landing/         # Landing page sections
│   ├── shared/          # Reusable components
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── ai/              # Gemini AI integration
│   ├── supabase/        # Supabase client setup
│   └── utils/           # Utility functions
└── types/               # TypeScript interfaces
```

---

## License

MIT
