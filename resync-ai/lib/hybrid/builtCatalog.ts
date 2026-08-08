import catalog from "@/lib/hybrid/builtImplementations.json";

export function getBuiltImplementations() {
  return catalog as Array<{
    id: string;
    name: string;
    runtime: string;
    libraries: string[];
    functionCall: string;
    assemblyStep: number;
    purpose: string;
  }>;
}
