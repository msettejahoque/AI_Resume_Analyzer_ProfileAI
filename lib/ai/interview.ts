import { InterviewPrep } from '@/types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateInterviewQuestions(
  resumeText: string,
  jobDescription: string
): Promise<InterviewPrep> {
  const prompt = `
You are an expert interview coach.
Based on the resume and job description below, generate 10 likely interview questions the candidate will face.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object with exactly this structure, no markdown, no explanation:
{
  "questions": [
    {
      "question": <the interview question as a string>,
      "category": <one of: "Behavioral", "Technical", "Situational", "Role-Specific", "Culture Fit">,
      "suggested_answer": <a 2-3 sentence suggested answer tailored to the candidate's resume>
    }
  ]
}

Generate exactly 10 questions. Mix different categories. Make questions specific to the job role and the candidate's background.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const text = response.text ?? '';
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const result = JSON.parse(cleaned) as InterviewPrep;
  return result;
}