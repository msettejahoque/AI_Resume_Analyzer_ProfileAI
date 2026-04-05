'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/types';
import { User } from '@supabase/supabase-js';

interface SettingsForm {
  name: string;
}

interface PasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<SettingsForm>({ name: '' });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    newPassword: '',
    confirmPassword: '',
  });
  const [profileSuccess, setProfileSuccess] = useState<string>('');
  const [profileError, setProfileError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isOAuthUser, setIsOAuthUser] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? '');
      setUser(user);

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setForm({ name: data.name ?? '' });
      }

      const identities = user.identities ?? [];
      const hasOAuthIdentity = identities.some(
        (i) => i.provider === 'google' || i.provider === 'github'
      );
      setIsOAuthUser(hasOAuthIdentity);
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (): Promise<void> => {
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: form.name.trim(),
      });

      if (error) {
        setProfileError('Failed to update profile. Please try again.');
        return;
      }

      setProfileSuccess('Profile updated successfully.');
      setProfile((prev) =>
        prev
          ? { ...prev, name: form.name.trim() }
          : {
              id: user.id,
              name: form.name.trim(),
              created_at: new Date().toISOString(),
            }
      );
    } catch {
      setProfileError('Something went wrong. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (): Promise<void> => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in all fields.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    setPasswordLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) {
        setPasswordError(error.message);
        return;
      }

      setPasswordSuccess('Password updated successfully.');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch {
      setPasswordError('Something went wrong. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
    setDeleteLoading(true);

    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        setProfileError('Failed to delete account. Please try again.');
        return;
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    } catch {
      setProfileError('Something went wrong. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-160 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-extrabold text-text-primary tracking-[-0.02em] mb-1">
          Settings
        </h1>
        <p className="text-sm text-text-muted">
          Manage your account preferences.
        </p>
      </div>

      {/* Profile section */}
      <Card className="bg-bg-card border-border-default mb-6">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-[15px] font-bold text-text-primary">
            Profile
          </CardTitle>
        </CardHeader>
        <Separator className="bg-border-subtle" />
        <CardContent className="px-6 py-5 flex flex-col gap-4">
          {profileSuccess && (
            <Alert className="border-[rgba(16,185,129,.25)] bg-[rgba(16,185,129,.08)]">
              <AlertDescription className="text-success text-sm">
                {profileSuccess}
              </AlertDescription>
            </Alert>
          )}

          {profileError && (
            <Alert className="border-[rgba(239,68,68,.25)] bg-[rgba(239,68,68,.08)]">
              <AlertDescription className="text-danger-light text-sm">
                {profileError}
              </AlertDescription>
            </Alert>
          )}

          {/* Email — read only */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] font-medium text-text-secondary">
              Email
            </Label>
            <Input
              value={email}
              disabled
              className="bg-bg-elevated border-border-default text-text-muted cursor-not-allowed"
            />
            <p className="text-[11px] text-text-muted">
              Email cannot be changed.
            </p>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[13px] font-medium text-text-secondary">
              Name
            </Label>
            <Input
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={profileLoading}
              className="bg-bg-input border-border-default text-text-primary placeholder:text-text-muted focus:border-border-focus"
            />
          </div>

          <Button
            onClick={handleUpdateProfile}
            disabled={profileLoading}
            className={`w-fit cursor-pointer ${
              profileLoading
                ? 'bg-bg-input text-text-muted cursor-not-allowed'
                : 'bg-linear-to-br from-brand to-brand-hover text-white shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85'
            } transition-opacity border-none font-bold`}
          >
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Password section — conditional */}
      {isOAuthUser === null ? null : isOAuthUser ? (
        <Card className="bg-bg-card border-border-default mb-6">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="text-[15px] font-bold text-text-primary">
              Password
            </CardTitle>
          </CardHeader>
          <Separator className="bg-border-subtle" />
          <CardContent className="px-6 py-5">
            <p className="text-sm text-text-muted">
              You signed in with{' '}
              <span className="text-text-secondary font-medium capitalize">
                {user?.identities?.[0]?.provider ?? 'a social provider'}
              </span>
              . Password management is handled by your provider.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-bg-card border-border-default mb-6">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="text-[15px] font-bold text-text-primary">
              Change Password
            </CardTitle>
          </CardHeader>
          <Separator className="bg-border-subtle" />
          <CardContent className="px-6 py-5 flex flex-col gap-4">
            {passwordSuccess && (
              <Alert className="border-[rgba(16,185,129,.25)] bg-[rgba(16,185,129,.08)]">
                <AlertDescription className="text-success text-sm">
                  {passwordSuccess}
                </AlertDescription>
              </Alert>
            )}

            {passwordError && (
              <Alert className="border-[rgba(239,68,68,.25)] bg-[rgba(239,68,68,.08)]">
                <AlertDescription className="text-danger-light text-sm">
                  {passwordError}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-text-secondary">
                New Password
              </Label>
              <Input
                type="password"
                placeholder="Min. 8 characters"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                disabled={passwordLoading}
                className="bg-bg-input border-border-default text-text-primary placeholder:text-text-muted focus:border-border-focus"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium text-text-secondary">
                Confirm New Password
              </Label>
              <Input
                type="password"
                placeholder="Repeat new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                disabled={passwordLoading}
                className="bg-bg-input border-border-default text-text-primary placeholder:text-text-muted focus:border-border-focus"
              />
            </div>

            <Button
              onClick={handleUpdatePassword}
              disabled={passwordLoading}
              className={`w-fit cursor-pointer ${
                passwordLoading
                  ? 'bg-bg-input text-text-muted cursor-not-allowed'
                  : 'bg-linear-to-br from-brand to-brand-hover text-white shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85'
              } transition-opacity border-none font-bold`}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Danger zone */}
      <Card className="bg-bg-card border-[rgba(239,68,68,.25)] mb-8">
        <CardHeader className="pb-3 pt-5 px-6">
          <CardTitle className="text-[15px] font-bold text-danger-light">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <Separator className="bg-border-subtle" />
        <CardContent className="px-6 py-5">
          <p className="text-sm text-text-muted mb-4">
            Permanently delete your account and all your analyses. This action
            cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-transparent border border-[rgba(239,68,68,.4)] cursor-pointer text-danger-light hover:bg-[rgba(239,68,68,.08)] transition-colors font-bold"
            >
              Delete Account
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-danger-light">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="bg-danger hover:opacity-85 text-white border-none font-bold transition-opacity"
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, delete my account'}
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary transition-colors font-bold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


