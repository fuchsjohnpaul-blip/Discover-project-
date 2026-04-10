import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Discover",
  description:
    "Discover is a dietary-safe dining map focused on verified meals and dietary-friendly options in Tuscaloosa, Alabama."
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
