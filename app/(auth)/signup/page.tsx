/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/components/shared/LoadingButton';
import { LogoFull } from '@/components/shared/Logo';

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (): Promise<void> => {
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);

    try {
      //supabase signup logic here
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      //redirect to the dashboard
      router.push('/check-email');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (): Promise<void> => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGithubAuth = async (): Promise<void> => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding, desktop only */}
      <div
        className="flex-[0_0_45%] border-r border-border-subtle hidden md:flex flex-col justify-center px-14 py-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #EFF6FF 0%, #F8FAFC 60%)',
        }}
      >
        {/* Orb */}
        <div
          className="absolute top-[20%] left-[30%] w-100 h-100 rounded-full pointer-events-none blur-[30px]"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,.10) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
       <div className="mb-14">
          <LogoFull />
        </div>

        <h2
          className="font-black text-text-primary leading-[1.15] tracking-[-0.03em] mb-4"
          style={{ fontSize: 'clamp(28px,3vw,38px)' }}
        >
          Land more interviews.
          <br />
          <span className="bg-linear-to-br from-brand to-brand-light bg-clip-text text-transparent">
            Starting today.
          </span>
        </h2>

        <p className="text-[15px] text-text-secondary leading-[1.7] mb-12 max-w-85">
          Get your AI resume match score in 30 seconds. Know exactly what to fix
          before you apply.
        </p>

        {/* Perks */}
        {[
          'Unlimited resume analyses during beta',
          'AI match score + full breakdown',
          'Actionable recommendations instantly',
          'ATS optimization tips included',
        ].map((perk) => (
          <div key={perk} className="flex items-center gap-3 mb-4">
            <div
              className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center border border-[rgba(59,130,246,.3)]"
              style={{ background: 'rgba(59,130,246,.15)' }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2.5}
                className="w-2.5 h-2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <span className="text-sm text-text-secondary">{perk}</span>
          </div>
        ))}

        {/* Testimonial */}
        <div
          className="mt-12 p-5 rounded-[14px] border border-[rgba(59,130,246,.15)]"
          style={{ background: 'rgba(59,130,246,.06)' }}
        >
          <p className="text-[13px] text-text-secondary leading-[1.65] mb-3">
            "Added missing keywords, got 3 interviews in one week."
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,.2)' }}
            >
              <span className="text-[11px] font-bold text-brand-light">SK</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary m-0">
                Sarah K.
              </p>
              <p className="text-[11px] text-text-muted m-0">
                Frontend Developer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form (always visible) */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-6 py-12">
        <div className="w-full max-w-100">
          {/* Logo — visible on mobile only */}
        <div className="flex md:hidden items-center justify-center mb-8">
            <LogoFull />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-[26px] font-extrabold text-text-primary mb-2 tracking-[-0.02em]">
              Create your account
            </h1>
            <p className="text-sm text-text-secondary">
              Free during beta. No credit card required.
            </p>
          </div>

          {/* OAuth */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className={`w-full px-4 py-2.75 rounded-[10px] bg-bg-card border border-border-default text-text-primary text-sm font-medium flex items-center justify-center gap-2.5 transition-all duration-200 ${
                loading
                  ? 'opacity-40 cursor-not-allowed'
                  : 'cursor-pointer hover:border-border-hover'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleGithubAuth}
              disabled={loading}
              className={`w-full px-4 py-2.75 rounded-[10px] bg-bg-card border border-border-default text-text-primary text-sm font-medium flex items-center justify-center gap-2.5 transition-all duration-200 ${
                loading
                  ? 'opacity-40 cursor-not-allowed'
                  : 'cursor-pointer hover:border-border-hover'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4.5 h-4.5 text-text-primary"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border-default" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-border-default" />
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-3.5 py-2.5 rounded-lg mb-4 border border-[rgba(239,68,68,.25)] text-danger-light text-[13px]"
              style={{ background: 'rgba(239,68,68,.08)' }}
            >
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-3.5">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
                className={`w-full px-3.5 py-2.5 rounded-[10px] bg-bg-input border border-border-default text-text-primary text-sm outline-none box-border transition-colors duration-200 focus:border-border-focus ${
                  loading ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
                className={`w-full px-3.5 py-2.5 rounded-[10px] bg-bg-input border border-border-default text-text-primary text-sm outline-none box-border transition-colors duration-200 focus:border-border-focus ${
                  loading ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                disabled={loading}
                className={`w-full px-3.5 py-2.5 rounded-[10px] bg-bg-input border border-border-default text-text-primary text-sm outline-none box-border transition-colors duration-200 focus:border-border-focus ${
                  loading ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <LoadingButton
              loading={loading}
              onClick={handleSubmit}
              loadingText="Creating account..."
            >
              Create Account
            </LoadingButton>
          </div>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand font-medium no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


