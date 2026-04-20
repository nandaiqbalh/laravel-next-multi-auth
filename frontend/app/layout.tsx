import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/layout/SessionProviderWrapper";
import { Toaster } from "@/components/ui/sonner";
import { bebasNeue, dmSans } from "@/lib/fonts";
import { JetBrains_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata: Metadata = {
  title: "Next Laravel Multi Auth",
  description: "Professional fullstack starter with Next.js and Laravel API",
};

/**
 * Root layout wraps all pages with global styles and session provider.
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cn("light", jetbrainsMono.variable, "font-sans", inter.variable)}>
      <body className={`${bebasNeue.variable} ${dmSans.variable} antialiased`}>
        <SessionProviderWrapper>
          {children}
          <Toaster position="top-right" richColors />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
