import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getScoreBadgeVariant, getScoreColor } from '@/lib/utilities/score';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: analyses } = await supabase
    .from('analyses')
    .select('id, score, company_name, created_at, job_description')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const hasAnalyses = analyses && analyses.length > 0;

  return (
    <div className="max-w-215 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-extrabold text-text-primary tracking-[-0.02em] mb-1">
          History
        </h1>
        <p className="text-sm text-text-muted">
          {hasAnalyses
            ? `${analyses.length} analysis${analyses.length > 1 ? 'es' : ''} total`
            : 'No analyses yet'}
        </p>
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-2">
              No analyses yet
            </h2>
            <p className="text-sm text-text-muted leading-[1.7] mb-7 max-w-[320px]">
              Your analysis history will appear here after your first resume
              analysis.
            </p>
            <Link
              href="/analyze"
              className="px-6 py-2.5 rounded-[10px] bg-linear-to-br from-brand to-brand-hover text-white text-sm font-bold no-underline shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85 transition-opacity"
            >
              + Start your first analysis
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Analyses list */}
      {hasAnalyses && (
        <Card className="bg-bg-card border-border-default overflow-hidden">
          {analyses.map((analysis, index) => (
            <Link
              key={analysis.id}
              href={`/results/${analysis.id}`}
              className={`flex items-center justify-between px-5 py-4 no-underline hover:bg-bg-elevated transition-colors duration-150 group ${
                index !== analyses.length - 1
                  ? 'border-b border-border-subtle'
                  : ''
              }`}
            >
              {/* Left side */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Score circle */}
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{
                    borderColor:
                      analysis.score >= 90
                        ? '#10B981'
                        : analysis.score >= 70
                          ? '#3B82F6'
                          : analysis.score >= 50
                            ? '#F59E0B'
                            : '#EF4444',
                  }}
                >
                  <span
                    className={`text-xs font-extrabold ${getScoreColor(analysis.score)}`}
                  >
                    {analysis.score}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-text-primary truncate">
                    {analysis.company_name
                      ? `@ ${analysis.company_name}`
                      : `Analysis · ${formatDate(analysis.created_at)}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">
                      {timeAgo(analysis.created_at)}
                    </span>
                    <span className="text-text-muted text-xs">·</span>
                    <span className="text-xs text-text-muted">
                      {formatDate(analysis.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  variant={getScoreBadgeVariant(analysis.score)}
                  className={`text-xs font-bold hidden sm:flex ${getScoreColor(analysis.score)}`}
                >
                  {analysis.score}%
                </Badge>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors duration-150"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}


