import { NextRequest } from "next/server";
import { MODELS } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 60;

const BASE_URL =
  process.env.AKASHML_BASE_URL || "https://api.akashml.com/v1";

export async function POST(req: NextRequest) {
  const apiKey = process.env.AKASHML_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AKASHML_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { model?: string; prompt?: string; system?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON" }), {
      status: 400,
    });
  }

  const { model, prompt, system } = body;
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

  const messages: Array<{ role: string; content: string }> = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

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
        messages,
        max_tokens: 800,
        temperature: 0.7,
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
    const content =
      data?.choices?.[0]?.message?.content ?? "(no content)";
    const usage = data?.usage ?? {};
    const promptTokens = usage.prompt_tokens ?? 0;
    const completionTokens = usage.completion_tokens ?? 0;
    const tps =
      elapsed > 0 ? (completionTokens / (elapsed / 1000)).toFixed(1) : "0";

    return new Response(
      JSON.stringify({
        content,
        elapsed_ms: elapsed,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
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
