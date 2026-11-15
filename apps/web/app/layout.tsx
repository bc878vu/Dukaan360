import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dukaan360 — Manage. Grow. Succeed.",
  description:
    "Multi-tenant business management SaaS: inventory, sales, purchases, expenses, digital khata and reports — for Pakistan and beyond.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
