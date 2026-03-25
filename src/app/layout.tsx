import { Geist, Geist_Mono } from "next/font/google";

import CompanyCard from "@/shared/components/CompanyCard/CompanyCard";
import { CourseCard } from "@/shared/components/CourseCard/CourseCard";
import { Header } from "@/shared/components/Header/Header";
import PopupCardWrapper from "@/shared/components/popupCard/PopupCardWrapper";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { getPublicEnv } from "@/shared/config/env";

import { Providers } from "./providers";

import type { Metadata } from "next";

// 👇 добавили обертку

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

          <CompanyCard />

          <CourseCard
            title="Работа с возражениями"
            description="Lorem ipsum dolor sit amet..."
            image="https://picsum.photos/403/300"
            status="active"
            usersCount={89}
            date="20.02.2026"
            link="#"
          />

          <SearchBar />

          <PopupCardWrapper />
        </Providers>
      </body>
    </html>
  );
}
