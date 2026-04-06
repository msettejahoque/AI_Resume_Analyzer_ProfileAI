import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CopyButton from '@/components/shared/CopyButton';
import { Analysis } from '@/types';
import { getScoreColor } from '@/lib/utilities/score';
import InterviewPrepSection from '@/components/dashboard/InterviewPrep';

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent Match';
  if (score >= 70) return 'Good Match';
  if (score >= 50) return 'Needs Work';
  return 'Poor Match';
}

function getProgressColor(score: number): string {
  if (score >= 90) return 'bg-success';
  if (score >= 70) return 'bg-brand';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: analysis, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !analysis) {
    notFound();
  }

  const typedAnalysis = analysis as Analysis;

  return (
    <div className="max-w-215 mx-auto">
      {/* Header */}
      {/* Header */}
      <div className="mb-8">
        {/* Desktop layout — side by side */}
        <div className="hidden md:flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {typedAnalysis.company_name && (
                <span className="text-sm text-text-muted">
                  {typedAnalysis.company_name}
                </span>
              )}
              <span className="text-text-muted text-sm">·</span>
              <span className="text-sm text-text-muted">
                {formatDate(typedAnalysis.created_at)}
              </span>
            </div>
            <h1 className="text-[26px] font-extrabold text-text-primary tracking-[-0.02em]">
              Analysis Results
            </h1>
          </div>
          <Button
            asChild
            className="bg-linear-to-br from-brand to-brand-hover text-white font-bold shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85 transition-opacity border-none w-fit"
          >
            <Link href="/analyze">+ New Analysis</Link>
          </Button>
        </div>

        {/* Mobile layout — centered */}
        <div className="flex md:hidden flex-col items-center text-center gap-1">
          <div className="flex items-center gap-2">
            {typedAnalysis.company_name && (
              <span className="text-sm text-text-muted">
                {typedAnalysis.company_name}
              </span>
            )}
            <span className="text-text-muted text-sm">·</span>
            <span className="text-sm text-text-muted">
              {formatDate(typedAnalysis.created_at)}
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold text-text-primary tracking-[-0.02em]">
            Analysis Results
          </h1>
        </div>
      </div>
      {/* Score card */}
      <Card className="bg-bg-card border-border-default mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Score circle */}
            <div
              className="flex flex-col items-center justify-center w-30 h-30 rounded-full border-4 shrink-0 mx-auto md:mx-0"
              style={{
                borderColor:
                  typedAnalysis.score >= 90
                    ? '#10B981'
                    : typedAnalysis.score >= 70
                      ? '#3B82F6'
                      : typedAnalysis.score >= 50
                        ? '#F59E0B'
                        : '#EF4444',
              }}
            >
              <span
                className={`text-4xl font-black tracking-[-0.03em] ${getScoreColor(typedAnalysis.score)}`}
              >
                {typedAnalysis.score}
              </span>
              <span className="text-xs text-text-muted font-medium">/ 100</span>
            </div>

            {/* Score details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-extrabold text-text-primary tracking-[-0.02em]">
                  {getScoreLabel(typedAnalysis.score)}
                </h2>
                <Badge
                  className={`font-bold text-xs  ${getScoreColor(typedAnalysis.score)}`}
                  variant={
                    typedAnalysis.score >= 70
                      ? 'default'
                      : typedAnalysis.score >= 50
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {typedAnalysis.score}%
                </Badge>
              </div>
              <p className="text-sm text-text-muted mb-4">
                Your resume matches {typedAnalysis.score}% of the job
                requirements.
              </p>
              <div className="relative h-2 w-full rounded-full bg-bg-elevated overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(typedAnalysis.score)}`}
                  style={{ width: `${typedAnalysis.score}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company info */}
      {(typedAnalysis.company_name ||
        typedAnalysis.application_link ||
        typedAnalysis.contact_email) && (
        <Card className="bg-bg-card border-border-default mb-6">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="text-[15px] font-bold text-text-primary">
              Company Info
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-5 flex flex-wrap gap-4">
            {typedAnalysis.company_name && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Company</span>
                <span className="text-sm font-semibold text-text-primary">
                  {typedAnalysis.company_name}
                </span>
              </div>
            )}
            {typedAnalysis.application_link && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Apply at</span>

                <a
                  href={typedAnalysis.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-brand hover:opacity-80 transition-opacity"
                >
                  {typedAnalysis.application_link}
                </a>
              </div>
            )}
            {typedAnalysis.contact_email && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Contact</span>
                <span className="text-sm font-semibold text-text-primary">
                  {typedAnalysis.contact_email}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Two column — strengths + gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <Card className="bg-bg-card border-border-default">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="text-[15px] font-bold text-text-primary flex items-center gap-2">
              <span className="text-success">✓</span>
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-5 flex flex-col gap-3">
            {typedAnalysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0 mt-2" />
                <p className="text-sm text-text-secondary leading-[1.6]">
                  {strength}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gaps */}
        <Card className="bg-bg-card border-border-default">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="text-[15px] font-bold text-text-primary flex items-center gap-2">
              <span className="text-danger">✗</span>
              Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-5 flex flex-col gap-3">
            {typedAnalysis.gaps.map((gap, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-danger shrink-0 mt-2" />
                <p className="text-sm text-text-secondary leading-[1.6]">
                  {gap}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ATS Keywords */}
      <Card className="bg-bg-card border-border-default mb-6">
        <CardHeader className="pb-3 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[15px] font-bold text-text-primary">
              ATS Keyword Match
            </CardTitle>
            <Badge
              variant={
                typedAnalysis.ats_keywords.match_rate >= 70
                  ? 'default'
                  : 'secondary'
              }
              className="font-bold"
            >
              {typedAnalysis.ats_keywords.match_rate}% match
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-5">
          {/* Progress bar */}
          <div className="relative h-2 w-full rounded-full bg-bg-elevated overflow-hidden mb-5">
            <div
              className={`h-full rounded-full ${getProgressColor(typedAnalysis.ats_keywords.match_rate)}`}
              style={{ width: `${typedAnalysis.ats_keywords.match_rate}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched */}
            <div>
              <p className="text-xs font-semibold text-success mb-3 uppercase tracking-wider">
                ✓ Matched Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {typedAnalysis.ats_keywords.matched.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border border-[rgba(16,185,129,.25)] text-success"
                    style={{ background: 'rgba(16,185,129,.08)' }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div>
              <p className="text-xs font-semibold text-danger mb-3 uppercase tracking-wider">
                ✗ Missing Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {typedAnalysis.ats_keywords.missing.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border border-[rgba(239,68,68,.25)] text-danger"
                    style={{ background: 'rgba(239,68,68,.08)' }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      {Object.values(typedAnalysis.requirements).some((v) => v !== null) && (
        <Card className="bg-bg-card border-border-default mb-6">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="text-[15px] font-bold text-text-primary">
              Important Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-5 flex flex-col gap-3">
            {Object.entries(typedAnalysis.requirements).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="flex items-start gap-3">
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shrink-0 mt-0.5 border border-[rgba(245,158,11,.25)] text-warning"
                    style={{ background: 'rgba(245,158,11,.08)' }}
                  >
                    {key}
                  </span>
                  <p className="text-sm text-text-secondary leading-[1.6]">
                    {value}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="bg-bg-card border-border-default mb-6">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-[15px] font-bold text-text-primary">
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-5 flex flex-col gap-4">
          {typedAnalysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-4">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-brand shrink-0 border border-[rgba(59,130,246,.25)]"
                style={{ background: 'rgba(59,130,246,.08)' }}
              >
                {index + 1}
              </span>
              <p className="text-sm text-text-secondary leading-[1.6]">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cover Letter */}
      <Card className="bg-bg-card border-border-default mb-8">
        <CardHeader className="pb-3 pt-5 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[15px] font-bold text-text-primary">
              Cover Letter
            </CardTitle>
            <CopyButton text={typedAnalysis.cover_letter} />
          </div>
        </CardHeader>
        <Separator className="bg-border-subtle" />
        <CardContent className="px-6 py-5">
          <p className="text-sm text-text-secondary leading-[1.8] whitespace-pre-line">
            {typedAnalysis.cover_letter}
          </p>
        </CardContent>
      </Card>

      {/* Interview Preparation */}
      
<InterviewPrepSection
  resumeText={typedAnalysis.resume_text}
  jobDescription={typedAnalysis.job_description}
/>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pb-8">
        <Button
          asChild
          className="bg-linear-to-br from-brand to-brand-hover text-white font-bold shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85 transition-opacity border-none"
        >
          <Link href="/analyze">+ New Analysis</Link>
        </Button>
        <Button
          asChild
          className="bg-bg-card border border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all duration-200"
        >
          <Link href="/history">View History</Link>
        </Button>
      </div>
    </div>
  );
}
