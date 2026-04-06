import { generateInterviewQuestions } from '@/lib/ai/interview';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and job description are required.' },
        { status: 400 }
      );
    }

    const result = await generateInterviewQuestions(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as { status: number }).status === 429
    ) {
      return NextResponse.json(
        { error: 'AI is temporarily busy. Please try again.' },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to generate questions. Please try again.' },
      { status: 500 }
    );
  }
}