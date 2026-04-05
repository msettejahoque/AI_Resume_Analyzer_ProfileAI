import { AnalysisResult } from '@/types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const prompt = `
You are an expert resume analyst and career coach. 
Analyze the resume against the job description and return a JSON object.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object with exactly this structure, no markdown, no explanation:
{
  "score": <number 0-100 representing overall match>,
  "strengths": [<3-5 strings of what the resume does well>],
  "gaps": [<3-5 strings of what is missing or weak>],
  "requirements": {
    "location": <string if location requirement found, null if not>,
    "visa": <string if visa requirement found, null if not>,
    "experience": <string if experience requirement found, null if not>,
    "certifications": <string if certification requirement found, null if not>
  },
  "ats_keywords": {
    "matched": [<keywords found in both resume and job description>],
    "missing": [<important keywords in job description missing from resume>],
    "match_rate": <number 0-100 representing keyword match percentage>
  },
  "recommendations": [<3-5 specific actionable strings to improve the resume>],
  "cover_letter": <string, a professional cover letter with [Your Name], [Company Name], [Job Title] as placeholders where needed>,
  "company_name": <string if company name found in job description, null if not>,
  "application_link": <string if application URL found in job description, null if not>,
  "contact_email": <string if contact email found in job description, null if not>
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const text = response.text ?? '';

  // clean the response — remove markdown code blocks if present
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const result = JSON.parse(cleaned) as AnalysisResult;
  return result;
}


