import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '../components/app-shell';
import { StudyProvider } from '../components/study-provider';

export const metadata: Metadata = {
  title: 'Prepdesk · Frontend Interview Cockpit',
  description: 'A private study cockpit for senior frontend interviews.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StudyProvider>
          <AppShell>{children}</AppShell>
        </StudyProvider>
      </body>
    </html>
  );
}
