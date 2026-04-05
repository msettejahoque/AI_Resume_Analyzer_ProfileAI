'use client';

import { LogoFull } from "../shared/Logo";

export default function Footer() {
  return (
    <footer className="bg-bg-app border-t border-border-subtle pt-12 pb-10 px-6">
      <div className="max-w-250 mx-auto">
        <div
          className="grid gap-8 mb-10"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          {/* Brand col */}
          <div className="mb-3">
              <LogoFull />
            </div>

          {/* Link cols */}
          {[
            {
              heading: 'Product',
              links: ['Features', 'Pricing', 'How It Works', 'Changelog'],
            },
            {
              heading: 'Company',
              links: ['About', 'Privacy Policy', 'Terms of Service', 'Contact'],
            },
          ].map((col) => (
            <div key={col.heading}>
              <p className="text-[13px] font-semibold text-text-primary mb-4">
                {col.heading}
              </p>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <span className="text-[13px] text-text-muted cursor-pointer transition-colors duration-200 hover:text-text-primary">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-border-subtle">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} ProfileAI. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[13px] text-text-muted">
              hello@ProfileAI.com
            </span>
            <span className="text-border-default">·</span>

            {[
              {
                label: 'Twitter',
                path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
              },
              {
                label: 'LinkedIn',
                path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
              },
            ].map((s) => (
              <span
                key={s.label}
                aria-label={s.label}
                className="text-text-muted cursor-pointer transition-colors duration-200 hover:text-brand"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.75 h-3.75"
                >
                  <path d={s.path} />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


