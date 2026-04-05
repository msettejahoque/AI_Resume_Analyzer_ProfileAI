'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AddJobDialog from '@/components/dashboard/AddJobDialog';
import type { JobApplication, JobStatus } from '@/types';
import JobNotes from './JobNotes';

interface TrackerClientProps {
  initialApplications: JobApplication[];
}

function getStatusColor(status: JobStatus): string {
  switch (status) {
    case 'Applied':
      return 'text-brand';
    case 'Interview':
      return 'text-warning';
    case 'Offer':
      return 'text-success';
    case 'Rejected':
      return 'text-danger-light';
  }
}

function getStatusBadgeVariant(
  status: JobStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Applied':
      return 'default';
    case 'Interview':
      return 'secondary';
    case 'Offer':
      return 'default';
    case 'Rejected':
      return 'destructive';
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function TrackerClient({
  initialApplications,
}: TrackerClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editJob, setEditJob] = useState<JobApplication | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<string>('all');

  // filter first, then sort
  const filtered =
    filterBy === 'all'
      ? initialApplications
      : initialApplications.filter((app) => app.status === filterBy);

  const handleDelete = async (id: string): Promise<void> => {
    setDeleteId(id);
    try {
      const supabase = createClient();
      await supabase.from('job_applications').delete().eq('id', id);
      router.refresh();
    } catch {
      console.error('Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (job: JobApplication): void => {
    setEditJob(job);
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
    setEditJob(null);
  };

  const hasApplications = initialApplications.length > 0;

  return (
    <div className="max-w-240 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold text-text-primary tracking-[-0.02em] mb-1">
            Job Tracker
          </h1>
          <p className="text-sm text-text-muted">
            {hasApplications
              ? `${initialApplications.length} application${initialApplications.length > 1 ? 's' : ''} tracked`
              : 'Track your job applications'}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditJob(null);
            setDialogOpen(true);
          }}
          className="bg-linear-to-br cursor-pointer from-brand to-brand-hover text-white font-bold shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85 transition-opacity border-none"
        >
          + Add Job
        </Button>
      </div>

      {/* Empty state */}
      {!hasApplications && (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-2">
              No applications yet
            </h2>
            <p className="text-sm text-text-muted leading-[1.7] mb-7 max-w-[320px]">
              Start tracking your job applications. Never lose track of where
              you applied.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-linear-to-br from-brand to-brand-hover cursor-pointer text-white font-bold shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85 transition-opacity border-none"
            >
              + Add your first application
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Applications list */}
      {hasApplications && (
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-sm text-text-muted">
              {filterBy !== 'all' ? (
                <span className="text-text-secondary font-medium">
                  {filtered.length} {filterBy} application
                  {filtered.length !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-text-secondary font-medium">
                  {initialApplications.length} application
                  {initialApplications.length !== 1 ? 's' : ''}
                </span>
              )}
            </p>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-45 bg-bg-card border-border-default text-text-primary text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {['all', 'Applied', 'Interview', 'Offer', 'Rejected'].map(
                  (s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="text-text-primary focus:bg-border-hover focus:text-text-primary cursor-pointer"
                    >
                      {s === 'all' ? 'All Status' : s}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((job) => (
              <Card
                key={job.id}
                className="bg-bg-card border-border-default hover:border-border-hover transition-colors duration-200"
              >
                <CardContent className="p-5">
                  {/* Top row — status + actions */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant={getStatusBadgeVariant(job.status)}
                      className={`text-xs font-bold ${getStatusColor(job.status)}`}
                    >
                      {job.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="text-text-muted hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none p-1"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        disabled={deleteId === job.id}
                        className="text-text-muted hover:text-danger-light transition-colors cursor-pointer bg-transparent border-none p-1"
                      >
                        {deleteId === job.id ? (
                          <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Company + Job title */}
                  <div className="mb-3">
                    <p className="text-[15px] font-bold text-text-primary leading-tight mb-0.5">
                      {job.job_title}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {job.company_url ? (
                        <a
                          href={job.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-brand hover:opacity-80 transition-opacity no-underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {job.company_name} ↗
                        </a>
                      ) : (
                        <p className="text-sm text-text-secondary font-medium">
                          {job.company_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-text-muted mb-3">
                    Applied {formatDate(job.applied_date)}
                  </p>

                  {/* Notes preview */}
                  {job.notes && <JobNotes notes={job.notes} />}

                  {/* Job URL */}
                  {job.job_url && (
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand font-medium no-underline hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                      View job posting ↗
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Dialog */}
      <AddJobDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editJob={editJob}
      />
    </div>
  );
}


