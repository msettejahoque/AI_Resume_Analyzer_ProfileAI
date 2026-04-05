import { createClient } from '@/lib/supabase/server';
import TrackerClient from '@/components/dashboard/TrackerClient';
import type { JobApplication } from '@/types';

export default async function TrackerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: applications } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .order('applied_date', { ascending: false });

  return (
    <TrackerClient
      initialApplications={(applications as JobApplication[]) ?? []}
    />
  );
}


