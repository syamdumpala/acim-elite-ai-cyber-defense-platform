import { useThreatStore } from "../state/useThreatStore";
import { motion } from "framer-motion";

export default function IncidentLog() {
  const attacks = useThreatStore((s) => s.attacks);

  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-gray-800 h-[200px] overflow-y-auto">
      <h2 className="text-sm text-gray-400 mb-3 tracking-widest">
        INCIDENT LOG
      </h2>

      {attacks.slice(-10).map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs border-b border-gray-800 py-1"
        >
          [{new Date().toLocaleTimeString()}] {a.ip || "Unknown"} → Severity {a.severity}
        </motion.div>
      ))}
    </div>
  );
}