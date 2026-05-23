import { NextRequest } from "next/server";
import { MODELS } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 60;

const BASE_URL =
  process.env.MIMO_BASE_URL || "https://api.xiaomimimo.com/v1";

const SYSTEM_PROMPT =
  "You are MiMo, an AI assistant developed by Xiaomi. Your knowledge cutoff is December 2024. Be concise, accurate, and helpful.";

export async function POST(req: NextRequest) {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "MIMO_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { model?: string; prompt?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON" }), {
      status: 400,
    });
  }

  const { model, prompt } = body;
  if (!model || !prompt) {
    return new Response(
      JSON.stringify({ error: "model and prompt required" }),
      { status: 400 }
    );
  }

  const allowed = MODELS.find((m) => m.id === model);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "model not allowed" }), {
      status: 400,
    });
  }

  const start = Date.now();
  try {
    const upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 4000,
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(
        JSON.stringify({
          error: `upstream ${upstream.status}`,
          detail: text.slice(0, 500),
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await upstream.json();
    const elapsed = Date.now() - start;
    const choice = data?.choices?.[0]?.message ?? {};
    const content = choice.content ?? "(no content)";
    const reasoning = choice.reasoning_content ?? null;
    const usage = data?.usage ?? {};
    const promptTokens = usage.prompt_tokens ?? 0;
    const completionTokens = usage.completion_tokens ?? 0;
    const reasoningTokens =
      usage.completion_tokens_details?.reasoning_tokens ?? 0;
    const tps =
      elapsed > 0 ? (completionTokens / (elapsed / 1000)).toFixed(1) : "0";

    return new Response(
      JSON.stringify({
        content,
        reasoning,
        elapsed_ms: elapsed,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        reasoning_tokens: reasoningTokens,
        tokens_per_second: tps,
        model,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "fetch failed",
        detail: String(err?.message || err).slice(0, 300),
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
