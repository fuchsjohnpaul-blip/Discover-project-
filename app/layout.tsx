import type { Metadata } from "next";

import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
