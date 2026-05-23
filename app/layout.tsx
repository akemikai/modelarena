import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiMoArena — Race every Xiaomi MiMo variant",
  description:
    "Compare MiMo v2.5 Pro, v2.5, v2 Pro, v2 Omni, and v2 Flash side-by-side on the same prompt. Built on the official Xiaomi MiMo API.",
  openGraph: {
    title: "MiMoArena — Powered by Xiaomi MiMo",
    description: "Race every MiMo variant on the same prompt.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
