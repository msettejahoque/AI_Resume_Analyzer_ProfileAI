export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-brand';
  if (score >= 50) return 'text-warning';
  return 'text-danger-light';
}

export function getScoreBadgeVariant(
  score: number
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (score >= 70) return 'default';
  if (score >= 50) return 'secondary';
  return 'destructive';
}


