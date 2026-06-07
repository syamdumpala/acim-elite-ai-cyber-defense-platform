import { motion } from "framer-motion";
import { useThreatStore } from "../state/useThreatStore";

export default function HoneypotVisualizer() {
  const attacks = useThreatStore((s) => s.attacks);

  const trapped = attacks.filter((a) => a.anomaly);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#111827] border border-purple-700 rounded-xl p-4 h-[200px]"
    >
      <h2 className="text-xs text-purple-400 tracking-widest mb-2">
        HONEYPOT TRAPS
      </h2>

      <div className="space-y-1 text-xs">
        {trapped.length === 0 && (
          <div className="text-gray-500">No traps triggered</div>
        )}

        {trapped.map((a, i) => (
          <motion.div
            key={i}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-purple-300"
          >
            Trap: {a.ip}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}