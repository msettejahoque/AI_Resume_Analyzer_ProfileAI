/* eslint-disable react/no-unescaped-entities */
'use client';
import { FadeIn } from '@/components/shared/FadeIn';
import { Ic } from '@/components/shared/Icons';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="bg-bg-app py-24 px-6">
      <FadeIn>
        <div className="max-w-170 mx-auto text-center relative px-12 py-16 rounded-[28px] overflow-hidden bg-bg-card border border-[rgba(59,130,246,.2)] shadow-[0_0_60px_rgba(59,130,246,.07)]">
          {/* Orb */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-70 rounded-full pointer-events-none blur-[20px]"
            style={{
              background:
                'radial-gradient(ellipse, rgba(59,130,246,.13) 0%, transparent 70%)',
            }}
          />

          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand mb-4">
              Get Started Today
            </p>

            <h2
              className="font-black text-text-primary leading-[1.1] mb-4"
              style={{ fontSize: 'clamp(32px,5vw,48px)' }}
            >
              Stop sending
              <br />
              blind applications.
            </h2>

            <p className="text-[17px] text-text-secondary leading-[1.7] max-w-115 mx-auto mb-8">
              You've put in the work. Make sure your resume shows it. First
              analysis is free — no credit card, no commitment.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-[14px] bg-linear-to-br from-brand to-brand-hover text-white font-bold text-base border-none cursor-pointer"
              style={{
                boxShadow:
                  '0 0 32px rgba(59,130,246,.32), 0 0 0 1px rgba(59,130,246,.25)',
              }}
            >
              Analyze Your Resume Free <Ic.Arrow />
            </Link>

            <p className="mt-4 text-[13px] text-text-secondary">
              No credit card required · Free during beta
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}


