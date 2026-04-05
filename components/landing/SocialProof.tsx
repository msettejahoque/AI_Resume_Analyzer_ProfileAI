/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState, useEffect } from 'react';
import { FadeIn } from '@/components/shared/FadeIn';
import { Ic } from '@/components/shared/Icons';
import { useCounter } from '@/hooks/useCounter';

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Frontend Developer',
    body: 'Applied to 30+ jobs, zero callbacks. Used ProfileAI, added missing keywords, got 3 interviews in one week.',
    avatar: 'SK',
    score: 94,
  },
  {
    name: 'Marcus T.',
    role: 'Product Manager',
    body: 'The gap analysis was eye-opening. Right experience, describing it completely wrong. The suggestions were incredibly specific.',
    avatar: 'MT',
    score: 88,
  },
  {
    name: 'Priya M.',
    role: 'UX Designer',
    body: 'The cover letter generator alone is worth it. Takes 2 minutes now and they actually sound like me.',
    avatar: 'PM',
    score: 91,
  },
  {
    name: 'James L.',
    role: 'Data Analyst',
    body: 'Went from 5% response rate to 40%. ATS optimization tips changed everything. Genuinely different from anything else.',
    avatar: 'JL',
    score: 79,
  },
];

function StatItem({
  to,
  suffix,
  label,
}: {
  to: number;
  suffix: string;
  label: string;
}) {
  const { ref, val } = useCounter(to);
  return (
    <div
      ref={ref}
      className="text-center py-8 px-4 rounded-[18px] bg-bg-card border border-border-default"
    >
      <div className="text-[36px] font-black text-text-primary mb-1">
        {to % 1 !== 0 ? to.toFixed(1) : val.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs text-text-secondary font-medium tracking-[0.04em]">
        {label}
      </div>
    </div>
  );
}

export default function SocialProof() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section className="bg-bg-app py-24 px-6">
      <div className="max-w-250 mx-auto">
        {/* Stats */}
        <div
          className="grid gap-3.5 mb-20"
          style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' }}
        >
          {[
            { to: 1000, suffix: '+', label: 'Resumes Analyzed' },
            { to: 89, suffix: '%', label: 'Interview Rate Lift' },
            { to: 4.9, suffix: '/5', label: 'Average Rating' },
          ].map((s) => (
            <StatItem
              key={s.label}
              to={s.to}
              suffix={s.suffix}
              label={s.label}
            />
          ))}
        </div>

        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand mb-3">
              Real Results
            </p>
            <h2
              className="font-black text-text-primary"
              style={{ fontSize: 'clamp(28px,4vw,40px)' }}
            >
              People getting hired with ProfileAI
            </h2>
          </div>
        </FadeIn>

        {/* Testimonials */}
        <div
          className="grid gap-3.5"
          style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)' }}
        >
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 65}>
              <div
                className="p-6 rounded-[18px] bg-bg-card border border-border-default h-full box-border flex flex-col transition-colors duration-250"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = '#404040')
                }
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
              >
                {/* Stars */}
                <div className="flex gap-0.75 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-warning">
                      <Ic.Star />
                    </span>
                  ))}
                </div>

                <p className="text-sm text-text-secondary leading-[1.65] flex-1 mb-5">
                  "{t.body}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(59,130,246,.3)]"
                      style={{ background: 'rgba(59,130,246,.15)' }}
                    >
                      <span className="text-xs font-bold text-brand-light">
                        {t.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-secondary m-0">
                        {t.name}
                      </p>
                      <p className="text-xs text-text-secondary m-0">
                        {t.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-brand font-mono">
                      {t.score}
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      match score
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Trust badges */}
        <FadeIn>
          <div
            className="flex flex-wrap justify-center mt-10"
            style={{ gap: isMobile ? 16 : 32 }}
          >
            {[
              {
                icon: <Ic.Shield />,
                text: 'Privacy first — your data stays yours',
              },
              { icon: <Ic.Zap />, text: 'Results in under 30 seconds' },
              { icon: <Ic.Check />, text: 'No credit card required' },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2 text-[13px] text-text-secondary"
              >
                <span className="text-text-secondary">{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}


