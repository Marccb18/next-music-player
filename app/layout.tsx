import { Toaster } from 'sonner';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AlertDialog } from '@/components/alert-dialog';
import { SidebarProvider } from '@/components/primitives/sidebar';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: 'Next Music Player',
  description: 'A modern music player built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <SidebarProvider>
          {children}
          <Toaster position="bottom-center" />
          <AlertDialog />
        </SidebarProvider>
      </body>
    </html>
  );
}
