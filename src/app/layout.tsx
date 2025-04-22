import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import ThemeProvider from './theme-provider';
import { CssBaseline } from '@mui/material';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "beije",
  description: "beije Frontend Assignment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <CssBaseline />
          <Providers>
            <Navbar />
            {children}
          </Providers>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
