export interface CustomerStory {
  company: string;
  industry: string;
  logo: string;
  quote: string;
  person: string;
  role: string;
  metrics: { value: string; label: string }[];
  summary: string;
}

export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    company: "Northwind Commerce",
    industry: "E-commerce",
    logo: "NW",
    quote:
      "Checkout failures used to page an engineer at 2am. Now self-heal patches the payload and we read about it in telemetry the next morning.",
    person: "Ava Chen",
    role: "VP Engineering",
    summary:
      "Northwind replaced a brittle checkout retry service with a self-healing workflow, cutting after-hours pages and recovering revenue that used to leak on failed orders.",
    metrics: [
      { value: "92%", label: "of checkout errors auto-healed" },
      { value: "−78%", label: "after-hours incidents" },
      { value: "3.4x", label: "faster recovery" },
    ],
  },
  {
    company: "Helio Support",
    industry: "SaaS",
    logo: "HS",
    quote:
      "We triage thousands of support calls a week. The voice-to-intent workflow routes them before a human ever opens the queue.",
    person: "Marcus Reed",
    role: "Head of Support Ops",
    summary:
      "Helio built a voice triage pipeline — transcribe, classify, and route — that handles the first pass on every inbound call.",
    metrics: [
      { value: "40%", label: "tickets auto-routed" },
      { value: "−6h", label: "avg. first response" },
      { value: "18k", label: "calls / month" },
    ],
  },
  {
    company: "Lumen Health",
    industry: "Healthcare",
    logo: "LH",
    quote:
      "Document intake with OCR and a human-approval gate gave us automation without giving up compliance control.",
    person: "Priya Nair",
    role: "Director of Operations",
    summary:
      "Lumen automated intake of clinical documents with OCR, summarization, encryption, and an audit trail — keeping a human in the loop where it matters.",
    metrics: [
      { value: "5x", label: "faster intake" },
      { value: "100%", label: "audit coverage" },
      { value: "0", label: "compliance findings" },
    ],
  },
];
