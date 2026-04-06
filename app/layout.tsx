import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Gluten Guide Tuscaloosa",
  description: "A dietary-safe dining map focused on verified gluten-free options in Tuscaloosa, Alabama."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
