import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll, CustomCursor } from "@/components/Providers";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Shubham Rathod | AI Context Engineer",
  description: "Explore the portfolio of Shubham Rathod, an AI Context Engineer passionate about AI/ML development and innovative solutions.",
  keywords: ["Shubham Rathod", "AI", "Machine Learning", "Portfolio", "Engineer"],
  openGraph: {
    title: "Shubham Rathod | AI Context Engineer",
    description: "Building the future of AI Context and Intelligent Systems.",
    type: "website",
    locale: "en_US",
    url: "https://shubhamrathod.dev", // Placeholder
    siteName: "Shubham Rathod Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased font-body`}>
        <CustomCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
