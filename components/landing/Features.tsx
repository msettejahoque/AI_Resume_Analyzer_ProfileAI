'use client';
import { FadeIn } from '@/components/shared/FadeIn';
import { Ic } from '@/components/shared/Icons';

const features = [
  {
    Icon: Ic.Chart,
    title: 'AI Match Score',
    desc: 'See a 0–100 score instantly. Know if your resume is a strong fit before you hit send.',
  },
  {
    Icon: Ic.Bulb,
    title: 'Strengths & Gaps',
    desc: "Find exactly what's working and what's missing. No more guessing why you're ghosted.",
  },
  {
    Icon: Ic.Scan,
    title: 'Actionable Recommendations',
    desc: 'Specific, line-by-line suggestions. Add this. Rephrase that. Remove this section.',
  },
  {
    Icon: Ic.Doc,
    title: 'Cover Letter Generator',
    desc: 'A tailored, human-sounding cover letter in seconds, customized to the role.',
  },
  {
    Icon: Ic.Clock,
    title: 'Analysis History',
    desc: 'Track every application. Compare versions and watch your score improve over time.',
  },
  {
    Icon: Ic.Zap,
    title: 'ATS Optimization',
    desc: 'Beat Applicant Tracking Systems before your resume ever reaches a human recruiter.',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-bg-app py-24 px-6 relative overflow-hidden"
    >
      {/* Orb */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-175 h-87.5 pointer-events-none blur-[20px]"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(59,130,246,.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-250 mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand mb-3">
              Features
            </p>
            <h2
              className="font-black text-text-primary leading-[1.1]"
              style={{ fontSize: 'clamp(32px,5vw,48px)' }}
            >
              Everything you need
              <br />
              to get the interview.
            </h2>
          </div>
        </FadeIn>

        <div
          className="grid gap-3.5"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          }}
        >
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 55}>
              <div
                className="p-6 rounded-[18px] bg-bg-card border border-border-default h-full box-border transition-all duration-250"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,.28)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 0 24px rgba(59,130,246,.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Icon box */}
                <div
                  className="w-10.5 h-10.5 rounded-xl flex items-center justify-center mb-4 text-brand border border-[rgba(59,130,246,.2)]"
                  style={{ background: 'rgba(59,130,246,.10)' }}
                >
                  <f.Icon />
                </div>

                <h3 className="text-[15px] font-bold text-text-primary mb-1.5">
                  {f.title}
                </h3>
                <p className="text-[13px] text-text-secondary leading-[1.65]">
                  {f.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}


