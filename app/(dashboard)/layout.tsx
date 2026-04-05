'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogoFull, LogoIcon } from '@/components/shared/Logo';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4.5 h-4.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        />
      </svg>
    ),
  },
  {
    label: 'History',
    href: '/history',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4.5 h-4.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    label: 'Job Tracker',
    href: '/tracker',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-4.5 h-4.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
];

// ✅ Sidebar declared OUTSIDE the layout component
interface SidebarProps {
  pathname: string;
  onNavClick: () => void;
  onLogout: () => void;
}

function Sidebar({ pathname, onNavClick, onLogout }: SidebarProps) {
  return (
    <div className="flex flex-col h-full px-3 py-5">
      {/* Logo */}
      <div className="px-3 mb-8">
        <LogoFull />
      </div>

      {/* New Analysis CTA */}
      <Link
        href="/analyze"
        onClick={onNavClick}
        className="flex items-center justify-center gap-2 mx-1 mb-6 px-4 py-2.5 rounded-[10px] bg-linear-to-br from-brand to-brand-hover text-white text-sm font-bold no-underline shadow-[0_0_20px_rgba(59,130,246,.25)] hover:opacity-85 transition-opacity duration-200"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Analysis
      </Link>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium no-underline transition-all duration-200 ${
                isActive
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              }`}
            >
              <span className={isActive ? 'text-brand' : 'text-text-muted'}>
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — Settings + Logout */}
      <div className="flex flex-col gap-1 mt-4 border-t border-border-subtle pt-4">
        <Link
          href="/settings"
          onClick={onNavClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium no-underline transition-all duration-200 ${
            pathname === '/settings'
              ? 'bg-bg-elevated text-text-primary'
              : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </Link>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-text-muted hover:text-danger hover:bg-bg-elevated transition-all duration-200 cursor-pointer border-none bg-transparent w-full text-left mt-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="w-4.5 h-4.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-bg-app">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border-subtle bg-bg-card fixed top-0 left-0 h-screen">
        <Sidebar
          pathname={pathname}
          onNavClick={() => setDrawerOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-60 bg-bg-card border-r border-border-subtle z-50 md:hidden transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          pathname={pathname}
          onNavClick={() => setDrawerOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="flex md:hidden items-center justify-between px-5 py-4 border-b border-border-subtle bg-bg-card">
          <div className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span className="text-text-primary font-bold text-[15px] tracking-[-0.03em] leading-none">
              Profile<span className="text-brand">AI</span>
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors duration-200 border-none bg-transparent cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}


