/* eslint-disable react/no-unescaped-entities */
'use client';
import { FadeIn } from '@/components/shared/FadeIn';
import Link from 'next/link';

const freePerks = [
  'Unlimited resume analyses',
  'AI match score + breakdown',
  'Full recommendations',
  'Gap analysis',
  'ATS optimization tips',
];

const proPerks = [
  'Everything in Free',
  'Cover letter generation',
  'Analysis history',
  'Priority support',
  'Early access to new features',
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className="w-3 h-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-bg-app py-24 px-6 relative overflow-hidden"
    >
      {/* Bg orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-125 rounded-full pointer-events-none blur-[20px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(59,130,246,.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-175 mx-auto relative">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand mb-3">
              Pricing
            </p>
            <h2
              className="font-black text-text-primary mb-3 leading-[1.1]"
              style={{ fontSize: 'clamp(32px,5vw,48px)' }}
            >
              Simple, honest pricing.
            </h2>
            <p className="text-base text-text-secondary">
              Start free. No credit card required.
            </p>
          </div>
        </FadeIn>

        {/* Cards */}
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          }}
        >
          {/* FREE CARD */}
          <FadeIn delay={0}>
            <div className="p-8 rounded-[20px] bg-bg-card flex flex-col h-full box-border relative border border-[rgba(59,130,246,.4)] shadow-[0_0_40px_rgba(59,130,246,.08)]">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-br from-brand to-brand-hover text-white text-[11px] font-bold whitespace-nowrap">
                Free During Beta
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-1">Free</h3>
              <p className="text-[13px] text-text-secondary mb-5">
                Everything free while we're in beta.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[48px] font-black text-text-primary leading-none">
                  $0
                </span>
                <span className="text-[13px] text-text-secondary">/month</span>
              </div>

              <ul className="list-none p-0 m-0 mb-8 flex-1 flex flex-col gap-2.5">
                {freePerks.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 text-sm text-text-secondary"
                  >
                    <span
                      className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 text-brand border border-[rgba(59,130,246,.3)]"
                      style={{ background: 'rgba(59,130,246,.15)' }}
                    >
                      <CheckIcon />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 rounded-xl font-bold text-sm border-none cursor-pointer bg-linear-to-br from-brand to-brand-hover text-white transition-opacity duration-200 shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85"
              >
                Get Started Free
              </Link>
            </div>
          </FadeIn>

          {/* PRO CARD — coming soon */}
          <FadeIn delay={100}>
            <div className="p-8 rounded-[20px] bg-bg-card border border-border-default flex flex-col h-full box-border relative opacity-60">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-bg-elevated border border-border-default text-text-secondary text-[11px] font-bold whitespace-nowrap">
                Coming Soon
              </div>

              <h3 className="text-xl font-bold text-text-secondary mb-1">
                Pro
              </h3>
              <p className="text-[13px] text-text-secondary mb-5">
                For serious job seekers who want every edge.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[48px] font-black text-text-muted leading-none">
                  $4.99
                </span>
                <span className="text-[13px] text-text-secondary">/month</span>
              </div>

              <ul className="list-none p-0 m-0 mb-8 flex-1 flex flex-col gap-2.5">
                {proPerks.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 text-sm text-text-secondary"
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center shrink-0 text-text-secondary">
                      <CheckIcon />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="block w-full text-center px-6 py-3 rounded-xl font-bold text-sm border border-border-default bg-transparent text-border-hover cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Bottom note */}
        <FadeIn>
          <p className="text-center text-xs text-text-secondary mt-6">
            Free during beta · Pro plan with advanced features coming soon
          </p>
        </FadeIn>
      </div>
    </section>
  );
}


