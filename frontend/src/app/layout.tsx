// src\app\layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import NavBar from "./_components/NavBar";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ['latin'],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Emergency News",
  description: "ALX Frontend Engineering Capstone Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.className} antialiased bg-[#FCF7F7]  `}
      >
        <NavBar/>
        <div className=" mt-[7rem] md:mt-[5rem] h-full">
          {children}
        </div>
        
      </body>
    </html>
  );
}
