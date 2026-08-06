"use client";

import { useState } from "react";

const REPORT_REASONS = [
  "Spam or misleading",
  "Harassment or hate speech",
  "Copyright violation",
  "Inappropriate content",
  "Other",
];

export function ReportModal({
  targetLabel,
  onSubmit,
  onClose,
}: {
  targetLabel: string;
  onSubmit: (reason: string, details?: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(reason, details || undefined);
    setDone(true);
    setTimeout(onClose, 1500);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-resync-border bg-resync-surface p-6">
        <h3 className="text-lg font-semibold text-white">Report {targetLabel}</h3>
        {done ? (
          <p className="mt-4 text-sm text-emerald-400">Report submitted. Thank you.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-resync-border bg-resync-bg/50 px-4 py-2 text-sm text-white"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Additional details (optional)"
              rows={3}
              className="w-full rounded-xl border border-resync-border bg-resync-bg/50 p-3 text-sm text-white placeholder:text-zinc-600"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-500"
              >
                Submit report
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-resync-border px-4 py-2 text-sm text-zinc-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
