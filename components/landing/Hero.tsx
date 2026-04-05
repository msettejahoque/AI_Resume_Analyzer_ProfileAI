'use client';

/* eslint-disable react/no-unescaped-entities */

import { Ic } from '@/components/shared/Icons';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { scrollTo } from '@/lib/scrollTo';
import Link from 'next/link';

export default function Hero() {
  return (
    <>
      <section className="bg-bg-app min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
  <div
    className="absolute top-[8%] left-1/2 -translate-x-1/2 w-175 h-175 rounded-full blur-xs"
    style={{
      background:
        'radial-gradient(circle, rgba(37,99,235,.06) 0%, rgba(37,99,235,.02) 45%, transparent 70%)',
    }}
  />
  <div
    className="absolute -top-20 -left-30 w-105 h-105 rounded-full blur-[50px]"
    style={{
      background:
        'radial-gradient(circle, rgba(37,99,235,.05) 0%, transparent 65%)',
    }}
  />
  <div
    className="absolute -bottom-15 -right-20 w-90 h-90 rounded-full blur-[50px]"
    style={{
      background:
        'radial-gradient(circle, rgba(59,130,246,.04) 0%, transparent 65%)',
    }}
  />
  <div
    className="absolute top-0 left-0 right-0 h-px"
    style={{
      background:
        'linear-gradient(90deg, transparent 5%, rgba(37,99,235,.15) 50%, transparent 95%)',
    }}
  />
</div>

        <div className="relative max-w-250 mx-auto px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(37,99,235,.25)] bg-[rgba(37,99,235,.08)] mb-8"
            style={{ animation: 'hfd .55s ease both' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
            <span className="text-xs text-brand-light font-medium tracking-[0.05em]">
              AI-Powered Resume Analysis
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-black text-text-primary leading-[1.05] tracking-[-0.03em] mb-5"
            style={{
              fontSize: 'clamp(40px,7vw,72px)',
              animation: 'hfd .55s ease .08s both',
            }}
          >
            Your resume is{' '}
            <span className="bg-linear-to-br from-brand to-brand-light bg-clip-text text-transparent">
              getting ignored.
            </span>
            <br />
            Let's fix that.
          </h1>

          {/* Subheading */}
          <p
            className="text-lg text-text-secondary max-w-145 mx-auto mb-10 leading-[1.7]"
            style={{ animation: 'hfd .55s ease .16s both' }}
          >
            Upload your resume, paste the job description, and get an AI match
            score with precise feedback — in under 30 seconds.
          </p>

          {/* CTAs */}
          <div
            className="flex items-center justify-center gap-3 mb-14 flex-wrap"
            style={{ animation: 'hfd .55s ease .24s both' }}
          >
            <Link href="/signup">
              <button
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-linear-to-br from-brand to-brand-hover text-white font-bold text-[15px] border-none cursor-pointer"
                style={{
                  boxShadow:
                    '0 0 28px rgba(59,130,246,.30), 0 0 0 1px rgba(59,130,246,.25)',
                }}
              >
                Analyze Your Resume Free <Ic.Arrow />
              </button>
            </Link>
            <span
              onClick={() => scrollTo('how-it-works')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border-default text-text-secondary font-semibold text-[15px] cursor-pointer"
            >
              See How It Works
            </span>
          </div>

          {/* Hero Card */}
          <div style={{ animation: 'hfu .7s ease .32s both' }}>
            <div className="max-w-140 mx-auto rounded-[20px] overflow-hidden bg-bg-card border border-border-default shadow-[0_0_0_1px_rgba(37,99,235,.08),0_32px_72px_rgba(0,0,0,.08)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border-subtle bg-[#f1f5f9]">
                <span className="w-3 h-3 rounded-full bg-danger opacity-60" />
                <span className="w-3 h-3 rounded-full bg-warning opacity-60" />
                <span className="w-3 h-3 rounded-full bg-success opacity-60" />
                <div className="flex-1 ml-3 h-5 rounded-[6px] bg-bg-input flex items-center px-2.5">
                  <span className="text-[11px] text-text-secondary">
                    app.ProfileAI.com/analyze
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 flex gap-6 items-center flex-wrap">
                <ScoreRing score={87} />
                <div className="flex-1 min-w-50">
                  {[
                    { label: 'Keyword Match', pct: 91, color: 'bg-brand' },
                    {
                      label: 'Skills Alignment',
                      pct: 78,
                      color: 'bg-brand-light',
                    },
                    { label: 'Experience Fit', pct: 85, color: 'bg-success' },
                  ].map(({ label, pct, color }, i) => (
                    <div key={label} className="mb-3.5">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] text-text-secondary">
                          {label}
                        </span>
                        <span className="text-[11px] text-brand-light font-semibold font-mono">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.25 rounded-full bg-border-default overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{
                            width: `${pct}%`,
                            transition: `width 1.1s ease ${0.8 + i * 0.2}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      "Add 'TypeScript'",
                      'Quantify impact',
                      'Remove objective',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-[rgba(59,130,246,.3)] bg-[rgba(59,130,246,.08)] text-brand-light"
                      >
                        💡 {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p
            className="mt-4 text-xs text-text-secondary"
            style={{ animation: 'hfd .5s ease .5s both' }}
          >
            No credit card required · Free during beta
          </p>
        </div>
      </section>

      <style>{`
        @keyframes hfd { from { opacity:0; transform:translateY(-14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hfu { from { opacity:0; transform:translateY(20px);  } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}


