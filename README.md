# MiMoArena 🏁

**Race every Xiaomi MiMo variant on the same prompt. Compare reasoning depth, speed, and style across the entire MiMo lineup.**

Built for the [Xiaomi MiMo 100T Token Plan](https://100t.xiaomimimo.com).

## What it does

MiMoArena is a side-by-side benchmarking playground that fires the same prompt at every available MiMo variant in parallel and shows the results in real time:

- 🏆 **MiMo v2.5 Pro** — flagship reasoning model
- **MiMo v2.5** — balanced standard
- **MiMo v2 Pro** — agentic foundation model
- **MiMo v2 Omni** — omni-modal (sees, understands, acts)
- **MiMo v2 Flash** — speed-optimized

Each card shows the response, end-to-end latency, output tokens, reasoning tokens, and tokens/sec throughput. The fastest finisher wins a 🏆 badge. For models that emit `reasoning_content` (chain-of-thought), there's a one-click toggle to inspect how the model thought through the problem.

## Why it matters

The MiMo lineup spans flagship reasoning to high-speed inference. Picking the right variant for your use case used to mean reading model cards and guessing. MiMoArena is the dirt-simple alternative: throw your real prompt at all of them at once and let your eyes decide.

Five built-in presets cover hard math, code generation, creative writing, classic reasoning puzzles, and multilingual nuance — categories where intra-MiMo differences actually matter.

## Stack

- **Next.js 14** App Router + RSC, deployed on Vercel
- **TailwindCSS** with a dark MiMo-orange theme
- **Official Xiaomi MiMo API** at `api.xiaomimimo.com/v1` (OpenAI-compatible)
- Edge-friendly serverless `/api/race` route firing 5 parallel `fetch`es

## Local dev

```bash
pnpm install
cp .env.example .env.local   # add your MiMo key from platform.xiaomimimo.com
pnpm dev
```

## Deploy

```bash
vercel --prod --yes
```

Set `MIMO_API_KEY` in the Vercel project env before the prod build.

## License

MIT — fork it, hack it, race your own MiMo prompts.
