import { motion } from "framer-motion";
import { useThreatStore } from "../state/useThreatStore";

export default function NeutralizationEffect() {
  const attacks = useThreatStore((s) => s.attacks);

  const high = attacks.filter((a) => a.severity >= 80);

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#111827] border border-green-700 rounded-xl p-4 h-[200px]"
    >
      <h2 className="text-xs text-green-400 tracking-widest mb-2">
        NEUTRALIZATION EVENTS
      </h2>

      <div className="space-y-1 text-xs">
        {high.length === 0 && (
          <div className="text-gray-500">No neutralizations</div>
        )}

        {high.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-300"
          >
            Neutralized: {a.ip}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}