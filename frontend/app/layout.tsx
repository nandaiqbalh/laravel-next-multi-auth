import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/layout/SessionProviderWrapper";
import { bebasNeue, dmSans } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Next Laravel Multi Auth",
  description: "Professional fullstack starter with Next.js and Laravel API",
};

/**
 * Root layout wraps all pages with global styles and session provider.
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="light">
      <body className={`${bebasNeue.variable} ${dmSans.variable} antialiased`}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
