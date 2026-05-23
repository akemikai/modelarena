export type ModelDef = {
  id: string;
  label: string;
  vendor: string;
  accent: string;
  featured?: boolean;
  blurb: string;
  tier: string;
};

export const MODELS: ModelDef[] = [
  {
    id: "mimo-v2.5-pro",
    label: "MiMo v2.5 Pro",
    vendor: "Xiaomi · Flagship",
    accent: "#f97316",
    featured: true,
    tier: "Reasoning",
    blurb: "Latest flagship with deep chain-of-thought reasoning",
  },
  {
    id: "mimo-v2.5",
    label: "MiMo v2.5",
    vendor: "Xiaomi · Standard",
    accent: "#fb923c",
    tier: "Balanced",
    blurb: "Balanced reasoning + speed, the daily driver",
  },
  {
    id: "mimo-v2-pro",
    label: "MiMo v2 Pro",
    vendor: "Xiaomi · Agentic",
    accent: "#ef4444",
    tier: "Agent",
    blurb: "Agent-era foundation model, strong on tool use",
  },
  {
    id: "mimo-v2-omni",
    label: "MiMo v2 Omni",
    vendor: "Xiaomi · Multimodal",
    accent: "#a855f7",
    tier: "Omni",
    blurb: "Omni-modal — sees, understands and acts",
  },
  {
    id: "mimo-v2-flash",
    label: "MiMo v2 Flash",
    vendor: "Xiaomi · Speed",
    accent: "#22c55e",
    tier: "Fast",
    blurb: "Optimized for low-latency, high-throughput",
  },
];
