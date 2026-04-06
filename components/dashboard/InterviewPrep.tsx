'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewQuestion } from '@/types';

const categoryColors: Record<string, string> = {
  Behavioral: 'bg-[rgba(59,130,246,.08)] text-brand border-[rgba(59,130,246,.25)]',
  Technical: 'bg-[rgba(16,185,129,.08)] text-success border-[rgba(16,185,129,.25)]',
  Situational: 'bg-[rgba(245,158,11,.08)] text-warning border-[rgba(245,158,11,.25)]',
  'Role-Specific': 'bg-[rgba(139,92,246,.08)] text-[#7c3aed] border-[rgba(139,92,246,.25)]',
  'Culture Fit': 'bg-[rgba(236,72,153,.08)] text-[#db2777] border-[rgba(236,72,153,.25)]',
};

function QuestionCard({ q, index }: { q: InterviewQuestion; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border-default rounded-[14px] overflow-hidden transition-all duration-200 hover:border-border-hover">
      {/* Question header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left bg-bg-card hover:bg-bg-elevated transition-colors duration-150 border-none cursor-pointer"
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-brand shrink-0 mt-0.5 border border-[rgba(59,130,246,.25)]"
          style={{ background: 'rgba(59,130,246,.08)' }}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[q.category] ?? categoryColors['Behavioral']}`}
            >
              {q.category}
            </span>
          </div>
          <p className="text-sm font-semibold text-text-primary leading-[1.5]">
            {q.question}
          </p>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`w-4 h-4 text-text-muted shrink-0 mt-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Suggested answer */}
      {open && (
        <div className="px-5 py-4 border-t border-border-subtle bg-bg-elevated">
          <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-2">
            Suggested Answer
          </p>
          <p className="text-sm text-text-secondary leading-[1.7]">
            {q.suggested_answer}
          </p>
        </div>
      )}
    </div>
  );
}

interface InterviewPrepProps {
  resumeText: string;
  jobDescription: string;
}

export default function InterviewPrepSection({ resumeText, jobDescription }: InterviewPrepProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!response.ok) {
        setError('Failed to generate questions. Please try again.');
        return;
      }

      const data = await response.json();
      setQuestions(data.questions);
      setGenerated(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-bg-card border-border-default mb-6">
      <CardHeader className="pb-3 pt-5 px-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-[15px] font-bold text-text-primary flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-[rgba(59,130,246,.2)]"
              style={{ background: 'rgba(59,130,246,.08)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={1.8} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
              </svg>
            </span>
            Interview Preparation
          </CardTitle>
          {!generated && (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-bold text-white border-none cursor-pointer transition-opacity duration-200 ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-85'
              }`}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 0 16px rgba(37,99,235,.25)',
              }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Questions
                </>
              )}
            </button>
          )}
          {generated && (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="text-xs text-brand font-medium cursor-pointer bg-transparent border-none hover:opacity-80 transition-opacity"
            >
              ↻ Regenerate
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-5">
        {/* Not generated yet */}
        {!generated && !loading && (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-sm text-text-muted max-w-sm leading-[1.7]">
              Generate 10 AI-powered interview questions tailored to this specific job and your resume — with suggested answers.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-[10px] mb-4 border border-[rgba(239,68,68,.25)] text-danger text-sm"
            style={{ background: 'rgba(239,68,68,.08)' }}
          >
            {error}
          </div>
        )}

        {/* Questions list */}
        {generated && questions.length > 0 && (
          <div className="flex flex-col gap-3">
            {questions.map((q, i) => (
              <QuestionCard key={i} q={q} index={i} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}