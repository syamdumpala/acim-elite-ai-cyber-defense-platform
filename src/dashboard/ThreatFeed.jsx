import { useThreatStore } from "../state/useThreatStore";
import { motion } from "framer-motion";

export default function ThreatFeed() {
  const attacks = useThreatStore((s) => s.attacks);

  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-gray-800 h-[300px] overflow-y-auto">
      <h2 className="text-sm font-semibold mb-3 tracking-widest text-gray-400">
        LIVE THREAT FEED
      </h2>

      {attacks.slice().reverse().map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between text-xs py-1 border-b border-gray-800"
        >
          <span>{a.ip || "Unknown"}</span>
          <span className="text-red-400">{a.severity || 0}</span>
        </motion.div>
      ))}
    </div>
  );
}