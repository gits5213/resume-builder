import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Build ATS-friendly resumes from scratch or by uploading DOCX/PDF. Choose a template; your data is automatically formatted for applicant tracking systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <Nav />
        <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 sm:py-10 max-w-6xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
