import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import ThemeProvider from './theme-provider';
import { CssBaseline } from '@mui/material';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "beije",
  description: "beije Frontend Assignment",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className={inter.className}>
        <ThemeProvider>
          <CssBaseline />
          <Providers>
            <Navbar />
            {children}
          </Providers>
          <Footer />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
