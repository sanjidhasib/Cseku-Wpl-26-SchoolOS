import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchoolOS",
  description: "Interactive school management frontend for administrators, teachers, students, guardians, and AI learning support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
