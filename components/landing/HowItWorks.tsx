'use client';
import { FadeIn } from '@/components/shared/FadeIn';
import { Ic } from '@/components/shared/Icons';

const steps = [
  {
    Icon: Ic.Upload,
    n: 1,
    title: 'Upload your resume',
    body: 'Drop your PDF or paste resume text, then add the job description. Done in 30 seconds.',
  },
  {
    Icon: Ic.Scan,
    n: 2,
    title: 'AI analyzes the match',
    body: 'Scores keyword coverage, skills alignment, and experience fit from 0 to 100.',
  },
  {
    Icon: Ic.Send,
    n: 3,
    title: 'Apply with confidence',
    body: 'Get specific edits, a gap list, and a tailored cover letter. Stand out every time.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bg-app py-24 px-6">
      <div className="max-w-250 mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand mb-3">
              How It Works
            </p>
            <h2
              className="font-black text-text-primary leading-[1.1]"
              style={{ fontSize: 'clamp(32px,5vw,48px)' }}
            >
              Three steps.
              <br />
              Zero guesswork.
            </h2>
          </div>
        </FadeIn>

        <div
          className="grid gap-8 relative"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 100}>
              <div className="flex flex-col items-center text-center">
                {/* Icon box */}
                <div
                  className="relative w-20 h-20 rounded-[18px] flex items-center justify-center mb-6 border border-[rgba(59,130,246,.22)]"
                  style={{ background: 'rgba(59,130,246,.08)' }}
                >
                  {/* Step number badge */}
                  <span className="absolute -top-2.5 -right-2.5 w-5.5 h-5.5 rounded-full bg-linear-to-br from-brand to-brand-hover text-white text-[11px] font-black flex items-center justify-center">
                    {s.n}
                  </span>
                  <span className="text-brand">
                    <s.Icon />
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-text-primary mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-text-secondary leading-[1.65]">
                  {s.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}


