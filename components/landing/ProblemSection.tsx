/* eslint-disable react/no-unescaped-entities */
'use client';
import { FadeIn } from '@/components/shared/FadeIn';

const problems = [
  {
    emoji: '📭',
    title: 'Sending into the void',
    body: "You apply to 40 jobs and hear back from 2. Your resume isn't matching what ATS systems and hiring managers scan for.",
  },
  {
    emoji: '🎯',
    title: 'One resume, every job',
    body: 'Using the same resume everywhere is leaving you invisible. Tailoring manually takes hours — most people skip it. Big mistake.',
  },
  {
    emoji: '🤷',
    title: 'Zero feedback loop',
    body: "You never know why you got ghosted. Wrong keywords? Bad format? Missing skills? You're flying blind every single time.",
  },
  {
    emoji: '✍️',
    title: 'Cover letters that fall flat',
    body: 'Writing a compelling cover letter for every job is exhausting — and that generic template? Hiring managers can tell instantly.',
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-bg-app py-24 px-6 relative overflow-hidden">
      {/* Orb */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-95 h-95 rounded-full pointer-events-none blur-[30px]"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-250 mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand mb-3">
              The Problem
            </p>
            <h2
              className="font-black text-text-primary leading-[1.1]"
              style={{ fontSize: 'clamp(32px,5vw,48px)' }}
            >
              Job searching shouldn't feel
              <br />
              <span className="text-text-muted">
                like shouting into the dark.
              </span>
            </h2>
          </div>
        </FadeIn>

        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {problems.map((p, i) => (
            <FadeIn key={p.title} delay={i * 75}>
              <div
                className="p-6 rounded-[18px] bg-bg-card border border-border-default h-full box-border transition-all duration-250"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.transform = '';
                }}
              >
                <div className="text-[32px] mb-4">{p.emoji}</div>
                <h3 className="text-[17px] font-bold text-text-primary mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-text-secondary leading-[1.65]">
                  {p.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}


