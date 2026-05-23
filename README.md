# ModelArena 🏁

**Race 5 frontier LLMs on the same prompt. See who's fastest, smartest, and why MiMo belongs in the conversation.**

Built for the [Xiaomi MiMo 100T Grant](https://100t.xiaomimimo.com).

## What it does

ModelArena is a side-by-side multi-LLM playground that fires the same prompt at 5 different frontier models in parallel and shows you the results in real time:

- 🏆 **MiMo VL 7B** (Xiaomi) — *featured*
- **DeepSeek V3.1**
- **Qwen3 30B-A3B**
- **Llama 3.3 70B**
- **Gemma 2 27B**

Each card shows the response, end-to-end latency, completion tokens, and tokens/sec throughput. The fastest finisher wins a 🏆 badge.

## Why it matters

Picking the right model for the job used to mean reading 50 benchmarks, none of which match your actual use case. ModelArena is the dirt-simple alternative: throw your real prompt at all of them at once and let your eyes decide.

Five built-in presets cover hard math, code generation, creative writing, classic reasoning puzzles, and multilingual nuance — the categories where model differences actually show.

## Stack

- **Next.js 14** (App Router, RSC) on Vercel
- **TailwindCSS** with a dark MiMo-orange theme
- **AkashML** as the unified LLM gateway (one API, all 5 models)
- Edge-friendly serverless `/api/race` route with parallel fetches

## Local dev

```bash
pnpm install
cp .env.example .env.local   # add your AkashML key
pnpm dev
```

## Deploy

```bash
vercel --prod --yes
```

Set `AKASHML_API_KEY` in the Vercel project env before the prod build.

## License

MIT — fork it, hack it, race your own models.
