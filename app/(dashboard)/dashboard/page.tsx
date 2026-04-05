import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getScoreBadgeVariant, getScoreColor } from '@/lib/utilities/score';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? '';

  // Query 1 — ALL analyses for correct stats
  const { data: allAnalyses } = await supabase
    .from('analyses')
    .select('score')
    .eq('user_id', user?.id ?? '');

  // Query 2 — only 3 recent for the list
  const { data: recentAnalyses } = await supabase
    .from('analyses')
    .select('id, company_name, score, created_at')
    .eq('user_id', user?.id ?? '')
    .order('created_at', { ascending: false })
    .limit(3);

  const hasAnalyses = recentAnalyses && recentAnalyses.length > 0;

  const stats = {
    total: allAnalyses?.length ?? 0,
    average:
      allAnalyses && allAnalyses.length > 0
        ? Math.round(
            allAnalyses.reduce((a, b) => a + b.score, 0) / allAnalyses.length
          )
        : 0,
    best:
      allAnalyses && allAnalyses.length > 0
        ? Math.max(...allAnalyses.map((a) => a.score))
        : 0,
  };

  return (
    <div className="max-w-215 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-extrabold text-text-primary tracking-[-0.02em] mb-1">
          {getGreeting()} 👋
        </h1>
        <p className="text-sm text-text-muted">{email}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Analyses',
            value: stats.total === 0 ? '0' : stats.total,
          },
          {
            label: 'Average Score',
            value: stats.average === 0 ? '--' : `${stats.average}%`,
          },
          {
            label: 'Best Score',
            value: stats.best === 0 ? '--' : `${stats.best}%`,
          },
        ].map((stat) => (
          <Card key={stat.label} className="bg-bg-card border-border-default">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-[13px] font-medium text-text-muted">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className="text-2xl font-extrabold text-text-primary tracking-[-0.02em]">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {!hasAnalyses && (
        <Card className="bg-bg-card border-border-default">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-[rgba(59,130,246,.2)]"
              style={{ background: 'rgba(59,130,246,.08)' }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3B82F6"
                strokeWidth={1.8}
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-2 tracking-[-0.01em]">
              No analyses yet
            </h2>
            <p className="text-sm text-text-muted leading-[1.7] mb-7 max-w-[320px]">
              Paste your resume and a job description to get your AI match score
              in 30 seconds.
            </p>
            <Button
              asChild
              className="bg-linear-to-br from-brand to-brand-hover text-white font-bold shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85 transition-opacity border-none"
            >
              <Link href="/analyze">+ Start your first analysis</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent analyses */}
      {hasAnalyses && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-text-primary">
              Recent Analyses
            </h2>
            <Link
              href="/history"
              className="text-[13px] text-brand font-medium no-underline hover:opacity-80 transition-opacity"
            >
              View all →
            </Link>
          </div>

          <Card className="bg-bg-card border-border-default overflow-hidden">
            {recentAnalyses.map((analysis, index) => (
              <Link
                key={analysis.id}
                href={`/results/${analysis.id}`}
                className={`flex items-center justify-between px-5 py-4 no-underline hover:bg-bg-elevated transition-colors duration-150 ${
                  index !== recentAnalyses.length - 1
                    ? 'border-b border-border-subtle'
                    : ''
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-text-primary">
                    {analysis.company_name
                      ? `@ ${analysis.company_name}`
                      : 'Analysis'}
                  </span>
                  <span className="text-xs text-text-muted">
                    {timeAgo(analysis.created_at)}
                  </span>
                </div>
                <Badge
                  variant={getScoreBadgeVariant(analysis.score)}
                  className={`text-xs font-bold ${getScoreColor(analysis.score)}`}
                >
                  {analysis.score}%
                </Badge>
              </Link>
            ))}
          </Card>

          <div className="mt-6 flex justify-center">
            <Button
              asChild
              className="bg-linear-to-br from-brand to-brand-hover text-white font-bold shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85 transition-opacity border-none"
            >
              <Link href="/analyze">+ New Analysis</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


