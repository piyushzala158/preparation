'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { getCompletedCount, getReadinessPercent, getTotalLessons } from '../lib/progress';
import { useStudy } from './study-provider';

const workspaceLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/learn', label: 'Learn' },
  { href: '/rounds', label: 'Interview rounds' },
  { href: '/machine-coding', label: 'Machine coding' },
  { href: '/communication', label: 'Communication' },
];

const personalLinks = [
  { href: '/search', label: 'Search' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/progress', label: 'Progress' },
  { href: '/settings', label: 'Settings' },
];

function pageTitle(pathname: string) {
  if (pathname === '/') return 'Today';
  const segment = pathname.split('/')[1];
  if (!segment) return 'Workspace';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useStudy();
  const completed = getCompletedCount(state);
  const total = getTotalLessons();
  const readiness = getReadinessPercent(state);
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">P</span>
          <span className="brand-name">
            prep<span>desk</span>
          </span>
        </Link>

        <nav className="nav">
          {workspaceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${active(link.href) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="nav nav-secondary">
          {personalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${active(link.href) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            {completed === 0 ? (
              <span className="subtle">0 of {total} lessons</span>
            ) : (
              <span className="subtle">
                {completed} of {total} lessons · {readiness}%
              </span>
            )}
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb">{pageTitle(pathname)}</div>
          <div className="top-actions">
            <Link href="/search" className="top-link">
              Search
            </Link>
          </div>
        </header>
        {children}
      </main>

      <nav className="mobile-nav">
        {workspaceLinks.slice(0, 5).map((link) => (
          <Link key={link.href} href={link.href} className={active(link.href) ? 'active' : ''}>
            {link.label.split(' ')[0]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
