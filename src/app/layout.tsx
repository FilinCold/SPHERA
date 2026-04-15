import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/shared/components/Header/Header";
import { getPublicEnv } from "@/shared/config/env";

import { Providers } from "./providers";

import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sphera Frontend Skeleton",
  description: "Infrastructure rails for the HR product.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  getPublicEnv();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
