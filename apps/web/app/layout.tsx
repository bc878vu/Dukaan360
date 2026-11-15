import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Dukaan360 — Manage. Grow. Succeed.", description: "A unified business management platform for growing businesses." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
