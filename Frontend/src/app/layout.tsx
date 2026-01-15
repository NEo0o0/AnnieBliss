import type { ReactNode } from 'react';
import '../styles/globals.css';
import { AppShell } from './AppShell';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
