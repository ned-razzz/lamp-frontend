import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "용인 함박 교회",
  description: "성경 말씀으로 살아가는 믿음의 교회입니다.",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="max-w-[425px] min-h-screen mx-auto border-x-2 flex flex-col">
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
