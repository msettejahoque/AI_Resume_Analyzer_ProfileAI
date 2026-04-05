'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { JobApplication, JobStatus } from '@/types';

interface JobForm {
  company_name: string;
  job_title: string;
  company_url: string;
  job_url: string;
  status: JobStatus;
  applied_date: string;
  notes: string;
}

const defaultForm: JobForm = {
  company_name: '',
  job_title: '',
  company_url: '',
  job_url: '',
  status: 'Applied',
  applied_date: new Date().toISOString().split('T')[0],
  notes: '',
};

interface AddJobDialogProps {
  open: boolean;
  onClose: () => void;
  editJob?: JobApplication | null;
}

export default function AddJobDialog({
  open,
  onClose,
  editJob,
}: AddJobDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<JobForm>(
    editJob
      ? {
          company_name: editJob.company_name,
          job_title: editJob.job_title,
          company_url: editJob.company_url ?? '',
          job_url: editJob.job_url ?? '',
          status: editJob.status,
          applied_date: editJob.applied_date,
          notes: editJob.notes ?? '',
        }
      : defaultForm
  );
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (editJob) {
      setForm({
        company_name: editJob.company_name,
        job_title: editJob.job_title,
        company_url: editJob.company_url ?? '',
        job_url: editJob.job_url ?? '',
        status: editJob.status,
        applied_date: editJob.applied_date,
        notes: editJob.notes ?? '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editJob]);

  const handleSubmit = async (): Promise<void> => {
    setError('');

    if (!form.company_name.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!form.job_title.trim()) {
      setError('Job title is required.');
      return;
    }
    if (!form.applied_date) {
      setError('Applied date is required.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (editJob) {
        // update existing
        const { error: dbError } = await supabase
          .from('job_applications')
          .update({
            company_name: form.company_name.trim(),
            job_title: form.job_title.trim(),
            company_url: form.company_url.trim() || null,
            job_url: form.job_url.trim() || null,
            status: form.status,
            applied_date: form.applied_date,
            notes: form.notes.trim() || null,
          })
          .eq('id', editJob.id);

        if (dbError) {
          setError('Failed to update. Please try again.');
          return;
        }
      } else {
        // insert new
        const { error: dbError } = await supabase
          .from('job_applications')
          .insert({
            user_id: user.id,
            company_name: form.company_name.trim(),
            job_title: form.job_title.trim(),
            company_url: form.company_url.trim() || null,
            job_url: form.job_url.trim() || null,
            status: form.status,
            applied_date: form.applied_date,
            notes: form.notes.trim() || null,
          });

        if (dbError) {
          setError('Failed to save. Please try again.');
          return;
        }
      }

      router.refresh();
      onClose();
      setForm(defaultForm);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-bg-card border-border-default max-w-130 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text-primary font-bold text-[17px]">
            {editJob ? 'Edit Application' : 'Add Job Application'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {error && (
            <div
              className="px-3.5 py-2.5 rounded-lg border border-[rgba(239,68,68,.25)] text-danger-light text-[13px]"
              style={{ background: 'rgba(239,68,68,.08)' }}
            >
              {error}
            </div>
          )}

          {/* Company name + Job title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-text-secondary">
                Company Name *
              </Label>
              <Input
                placeholder="e.g. Google"
                value={form.company_name}
                onChange={(e) =>
                  setForm({ ...form, company_name: e.target.value })
                }
                disabled={loading}
                className="bg-bg-input border-border-default text-text-primary placeholder:text-text-muted focus:border-border-focus"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-text-secondary">
                Job Title *
              </Label>
              <Input
                placeholder="e.g. Frontend Developer"
                value={form.job_title}
                onChange={(e) =>
                  setForm({ ...form, job_title: e.target.value })
                }
                disabled={loading}
                className="bg-bg-input border-border-default text-text-primary placeholder:text-text-muted focus:border-border-focus"
              />
            </div>
          </div>

          {/* Status + Applied date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-text-secondary">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm({ ...form, status: value as JobStatus })
                }
                disabled={loading}
              >
                <SelectTrigger className="bg-bg-input border-border-default text-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {['Applied', 'Interview', 'Offer', 'Rejected'].map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="text-text-primary focus:bg-[#2D2D2D] focus:text-text-primary cursor-pointer"
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-text-secondary">
                Applied Date *
              </Label>
              <Input
                type="date"
                value={form.applied_date}
                onChange={(e) =>
                  setForm({ ...form, applied_date: e.target.value })
                }
                disabled={loading}
                className="bg-bg-input border-border-default text-text-primary focus:border-border-focus"
              />
            </div>
          </div>

          {/* Company URL + Job URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-text-secondary">
                Company URL
              </Label>
              <Input
                placeholder="https://company.com"
                value={form.company_url}
                onChange={(e) =>
                  setForm({ ...form, company_url: e.target.value })
                }
                disabled={loading}
                className="bg-bg-input border-border-default text-text-primary placeholder:text-text-muted focus:border-border-focus"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-text-secondary">
                Job URL
              </Label>
              <Input
                placeholder="https://company.com/jobs/123"
                value={form.job_url}
                onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                disabled={loading}
                className="bg-bg-input border-border-default text-text-primary placeholder:text-text-muted focus:border-border-focus"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] font-medium text-text-secondary">
              Notes
            </Label>
            <Textarea
              placeholder="Any notes about this application..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              disabled={loading}
              className="h-20 bg-bg-input border-border-default text-text-primary placeholder:text-text-muted resize-none focus:border-border-focus"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              onClick={onClose}
              disabled={loading}
              className="bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary transition-colors font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={`font-bold border-none transition-opacity ${
                loading
                  ? 'bg-bg-input text-text-muted cursor-not-allowed'
                  : 'bg-linear-to-br cursor-pointer from-brand to-brand-hover text-white shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85'
              }`}
            >
              {loading
                ? editJob
                  ? 'Saving...'
                  : 'Adding...'
                : editJob
                  ? 'Save Changes'
                  : 'Add Application'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


