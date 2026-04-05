import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center px-5">
      <div className="w-full max-w-100 text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-[rgba(59,130,246,.2)]"
          style={{ background: 'rgba(59,130,246,.08)' }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3B82F6"
            strokeWidth={1.8}
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-[26px] font-extrabold text-text-primary tracking-[-0.02em] mb-3">
          Check your email
        </h1>
        <p className="text-sm text-text-muted leading-[1.7] mb-8">
          We sent a confirmation link to your email address. Click the link to
          activate your account.
        </p>

        <p className="text-xs text-text-muted">
          Already confirmed?{' '}
          <Link href="/login" className="text-brand font-medium no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


