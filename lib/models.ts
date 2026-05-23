export type ModelDef = {
  id: string;
  label: string;
  vendor: string;
  accent: string;
  featured?: boolean;
  blurb: string;
};

export const MODELS: ModelDef[] = [
  {
    id: "MiMo-VL-7B-RL-2508",
    label: "MiMo VL 7B",
    vendor: "Xiaomi",
    accent: "#f97316",
    featured: true,
    blurb: "Xiaomi's flagship multimodal reasoning model",
  },
  {
    id: "deepseek-ai/DeepSeek-V3.1",
    label: "DeepSeek V3.1",
    vendor: "DeepSeek",
    accent: "#3b82f6",
    blurb: "671B MoE, strong on code & math",
  },
  {
    id: "Qwen/Qwen3-30B-A3B",
    label: "Qwen3 30B-A3B",
    vendor: "Alibaba",
    accent: "#a855f7",
    blurb: "Hybrid reasoning, multilingual",
  },
  {
    id: "meta-llama/Llama-3.3-70B",
    label: "Llama 3.3 70B",
    vendor: "Meta",
    accent: "#06b6d4",
    blurb: "Meta's open-weight workhorse",
  },
  {
    id: "google/gemma-2-27b-it",
    label: "Gemma 2 27B",
    vendor: "Google",
    accent: "#22c55e",
    blurb: "Compact but capable",
  },
];
