import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import type { WorkflowTemplate } from "@/types/database";

export function TemplateCard({ template }: { template: WorkflowTemplate }) {
  return (
    <Link
      href={`/builder?template=${template.slug}`}
      className="glass group block rounded-2xl p-6 transition hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-900/20"
    >
      <span className="text-xs font-medium uppercase tracking-wider text-indigo-400">
        {template.category}
      </span>
      <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-indigo-200">
        {template.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{template.description}</p>
      <p className="mt-4 text-xs text-zinc-500">
        {formatNumber(template.uses)} runs in the community
      </p>
    </Link>
  );
}
