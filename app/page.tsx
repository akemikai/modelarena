"use client";

import { useState, useCallback } from "react";
import { MODELS } from "@/lib/models";

type Result = {
  status: "idle" | "running" | "done" | "error";
  content?: string;
  error?: string;
  elapsed_ms?: number;
  completion_tokens?: number;
  tokens_per_second?: string;
};

const PRESETS = [
  {
    label: "🧮 Hard math",
    prompt:
      "A fair 6-sided die is rolled until the sum of rolls exceeds 50. What is the expected number of rolls? Show your reasoning briefly.",
  },
  {
    label: "💻 Code task",
    prompt:
      "Write a Python function that returns the longest palindromic substring. Use Manacher's algorithm. Include 2 test cases.",
  },
  {
    label: "🎭 Creative",
    prompt:
      "Write a 4-line cyberpunk poem about an AI watching the rain on Mars at midnight. Use vivid sensory imagery.",
  },
  {
    label: "🧠 Reasoning",
    prompt:
      "Three doors. Behind one is a car, behind two are goats. You pick door 1. The host opens door 3 (a goat). Should you switch? Explain in 3 sentences.",
  },
  {
    label: "🌏 Multilingual",
    prompt:
      "Translate this Indonesian phrase into English, French, Mandarin, and Japanese, then explain its cultural nuance: 'Mangan ora mangan asal kumpul.'",
  },
];

export default function Home() {
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [results, setResults] = useState<Record<string, Result>>(
    Object.fromEntries(MODELS.map((m) => [m.id, { status: "idle" }]))
  );
  const [racing, setRacing] = useState(false);

  const race = useCallback(async () => {
    if (!prompt.trim() || racing) return;
    setRacing(true);
    setResults(
      Object.fromEntries(MODELS.map((m) => [m.id, { status: "running" }]))
    );

    await Promise.all(
      MODELS.map(async (m) => {
        try {
          const r = await fetch("/api/race", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: m.id, prompt }),
          });
          const data = await r.json();
          if (!r.ok) {
            setResults((prev) => ({
              ...prev,
              [m.id]: {
                status: "error",
                error: data.error || `HTTP ${r.status}`,
              },
            }));
            return;
          }
          setResults((prev) => ({
            ...prev,
            [m.id]: {
              status: "done",
              content: data.content,
              elapsed_ms: data.elapsed_ms,
              completion_tokens: data.completion_tokens,
              tokens_per_second: data.tokens_per_second,
            },
          }));
        } catch (e: any) {
          setResults((prev) => ({
            ...prev,
            [m.id]: { status: "error", error: String(e?.message || e) },
          }));
        }
      })
    );

    setRacing(false);
  }, [prompt, racing]);

  const winnerId = (() => {
    const done = Object.entries(results).filter(
      ([, r]) => r.status === "done" && r.elapsed_ms
    );
    if (!done.length) return null;
    return done.sort(
      (a, b) => (a[1].elapsed_ms || 0) - (b[1].elapsed_ms || 0)
    )[0][0];
  })();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mimo-900/30 border border-mimo-600/40 text-xs font-mono text-mimo-400 mb-4">
          <span className="w-2 h-2 rounded-full bg-mimo-500 pulse-dot" />
          POWERED BY XIAOMI MiMo · 100T GRANT SUBMISSION
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-3">
          Model<span className="gradient-text">Arena</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Race 5 frontier LLMs on the same prompt. See who's fastest, who's
          smartest, and why <span className="text-mimo-400">MiMo</span> belongs
          in the conversation.
        </p>
      </header>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8 backdrop-blur">
        <label className="block text-sm font-mono text-zinc-400 mb-2">
          PROMPT
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full bg-black/50 border border-zinc-800 rounded-lg p-3 text-sm font-mono text-zinc-100 focus:border-mimo-500 focus:outline-none resize-none scrollbar-thin"
          placeholder="Type a prompt to race all 5 models..."
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPrompt(p.prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-zinc-800/60 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={race}
          disabled={racing || !prompt.trim()}
          className="mt-4 w-full md:w-auto px-8 py-3 bg-mimo-500 hover:bg-mimo-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black font-bold rounded-lg transition glow"
        >
          {racing ? "🏁 Racing..." : "🚀 Race All Models"}
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODELS.map((m) => {
          const r = results[m.id];
          const isWinner = winnerId === m.id;
          return (
            <article
              key={m.id}
              className={`bg-zinc-900/60 border rounded-xl p-4 flex flex-col min-h-[280px] transition ${
                isWinner
                  ? "border-mimo-500 glow"
                  : m.featured
                  ? "border-mimo-600/50"
                  : "border-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: m.accent }}
                    />
                    <h3 className="font-bold text-zinc-100">{m.label}</h3>
                    {m.featured && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-mimo-500/20 text-mimo-400 border border-mimo-600/40">
                        FEATURED
                      </span>
                    )}
                    {isWinner && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-600/40">
                        🏆 FASTEST
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {m.vendor} · {m.blurb}
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-black/40 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 font-mono overflow-auto max-h-64 scrollbar-thin whitespace-pre-wrap">
                {r.status === "idle" && (
                  <span className="text-zinc-600">Waiting for prompt...</span>
                )}
                {r.status === "running" && (
                  <span className="text-mimo-400 pulse-dot">
                    Generating...
                  </span>
                )}
                {r.status === "error" && (
                  <span className="text-red-400">⚠ {r.error}</span>
                )}
                {r.status === "done" && r.content}
              </div>

              {r.status === "done" && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-zinc-800/50 rounded p-2 text-center">
                    <div className="text-zinc-500">latency</div>
                    <div className="text-zinc-100 font-bold">
                      {r.elapsed_ms}ms
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded p-2 text-center">
                    <div className="text-zinc-500">tokens</div>
                    <div className="text-zinc-100 font-bold">
                      {r.completion_tokens}
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded p-2 text-center">
                    <div className="text-zinc-500">tok/s</div>
                    <div className="text-zinc-100 font-bold">
                      {r.tokens_per_second}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <footer className="mt-12 text-center text-xs font-mono text-zinc-600">
        <p>
          ModelArena · Built with Next.js + AkashML · Submission for{" "}
          <a
            href="https://100t.xiaomimimo.com"
            className="text-mimo-400 hover:underline"
          >
            Xiaomi MiMo 100T Grant
          </a>
        </p>
      </footer>
    </main>
  );
}
