import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ModelArena — Multi-LLM Playground powered by MiMo",
  description:
    "Compare MiMo, DeepSeek, Qwen, Llama, and Gemma side-by-side on the same prompt. Built for the MiMo 100T grant.",
  openGraph: {
    title: "ModelArena — Powered by Xiaomi MiMo",
    description:
      "Race 5 frontier LLMs on the same prompt. See which one wins.",
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
