import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DotBackground } from "@/components/ui/dot-background";
import ClientWrapper from "@/components/client-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerVision AI - Unlock Your Future Career Path",
  description: "AI-powered career prediction, skill gap analysis, and personalized roadmaps to transform your potential into success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        <DotBackground dotSize="20px" />
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
