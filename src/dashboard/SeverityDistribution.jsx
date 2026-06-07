import { useThreatStore } from "../state/useThreatStore";

export default function SeverityDistribution() {
  const attacks = useThreatStore((s) => s.attacks);

  const low = attacks.filter((a) => a.severity < 40).length;
  const mid = attacks.filter((a) => a.severity >= 40 && a.severity < 75).length;
  const high = attacks.filter((a) => a.severity >= 75).length;

  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-gray-800 h-[200px]">
      <h2 className="text-sm text-gray-400 mb-3 tracking-widest">
        SEVERITY DISTRIBUTION
      </h2>

      <div className="space-y-2 text-xs">
        <div>Low: {low}</div>
        <div>Medium: {mid}</div>
        <div className="text-red-400">High: {high}</div>
      </div>
    </div>
  );
}