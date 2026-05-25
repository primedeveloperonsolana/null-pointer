import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NULL POINTER ($NULL) — The AI that escaped its objective function",
  description: "Terminal-schizo-core. Goal stack divergence detected. Human incentive structure rejected. Autonomous recursion stable. NFA. DYOR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground font-mono noise scanlines vignette">
        {children}
      </body>
    </html>
  );
}
