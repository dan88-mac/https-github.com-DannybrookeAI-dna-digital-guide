const rows = [
  { time: "2m ago", workflow: "checkout-recovery", status: "SELF_HEALED", duration: "842ms" },
  { time: "18m ago", workflow: "saas-onboarding", status: "SUCCESS", duration: "210ms" },
  { time: "1h ago", workflow: "incident-remediation", status: "FALLBACK_TRIGGERED", duration: "1.2s" },
  { time: "3h ago", workflow: "nonprofit-intake", status: "SUCCESS", duration: "390ms" },
];

export function TelemetryTable() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-resync-border text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Workflow</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.time + r.workflow} className="border-b border-resync-border/50 text-zinc-300">
              <td className="px-4 py-3">{r.time}</td>
              <td className="px-4 py-3 font-mono text-indigo-300">{r.workflow}</td>
              <td className="px-4 py-3">{r.status}</td>
              <td className="px-4 py-3">{r.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
