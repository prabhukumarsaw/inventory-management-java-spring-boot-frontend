import type React from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Inventory Management System',
  description: 'A comprehensive inventory management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Providers>
              {children}
              <Toaster />
            </Providers>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css';
import { Providers } from './providers';
