import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABC Loan Management",
  description: "Modern lending operations platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
