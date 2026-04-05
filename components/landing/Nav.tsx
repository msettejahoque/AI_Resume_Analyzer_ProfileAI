'use client';
import { useState, useEffect } from 'react';
import { useScrolled } from '@/hooks/useScrolled';
import { scrollTo } from '@/lib/scrollTo';
import Link from 'next/link';
import { LogoFull } from '../shared/Logo';

export default function Nav() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-[rgba(248,250,252,0.92)] backdrop-blur-[14px] border-b border-border-subtle'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-275 mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="cursor-pointer">
          <LogoFull />
        </div>
        {/* Desktop links */}
        {isMobile === false && (
          <div className="flex items-center gap-9">
            {navLinks.map((l) => (
              <span
                key={l.label}
                onClick={() => {
                  scrollTo(l.id);
                  setMenuOpen(false);
                }}
                className="text-sm text-text-secondary cursor-pointer transition-colors duration-200 font-medium hover:text-text-primary"
              >
                {l.label}
              </span>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          {isMobile === false && (
            <Link href="/signup">
              {' '}
              <button className="inline-flex items-center px-5 py-2.25 rounded-[10px] bg-linear-to-br from-brand to-brand-hover text-white text-sm font-semibold border-none cursor-pointer shadow-[0_0_16px_rgba(59,130,246,0.25)] transition-opacity duration-200 hover:opacity-85">
                Get Started Free
              </button>
            </Link>
          )}

          {/* Hamburger */}
          {isMobile === true && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-transparent border-none cursor-pointer p-2 flex flex-col gap-1.25"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5.5 h-0.5 bg-text-primary rounded-sm transition-all duration-300 ${menuOpen ? 'translate-y-1.75 rotate-45' : ''}`}
              />
              <span
                className={`block w-5.5 h-0.5 bg-text-primary rounded-sm transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`block w-5.5 h-0.5 bg-text-primary rounded-sm transition-all duration-300 ${menuOpen ? '-translate-y-1.75 -rotate-45' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobile === true && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-80 border-t border-border-subtle' : 'max-h-0'
          }`}
        >
          <div className="px-6 pt-3 pb-6 flex flex-col gap-0">
            {navLinks.map((l) => (
              <span
                key={l.label}
                onClick={() => {
                  scrollTo(l.id);
                  setMenuOpen(false);
                }}
                className="text-[15px] text-text-secondary cursor-pointer py-3.5 border-b border-border-subtle transition-colors duration-200 font-medium hover:text-text-primary"
              >
                {l.label}
              </span>
            ))}
            <Link href="/signup">
              <button
                onClick={() => setMenuOpen(false)}
                className="mt-4 px-6 py-3.25 rounded-[10px] bg-linear-to-br from-brand to-brand-hover text-white text-[15px] font-semibold border-none cursor-pointer w-full shadow-[0_0_16px_rgba(59,130,246,0.25)]"
              >
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}


