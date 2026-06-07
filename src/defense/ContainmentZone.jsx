import { motion } from "framer-motion";
import { useThreatStore } from "../state/useThreatStore";

export default function ContainmentZone() {
  const risk = useThreatStore((s) => s.risk);

  const active = risk > 75;

  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.3 }}
      className="bg-[#111827] border border-red-700 rounded-xl p-4 h-[150px]"
    >
      <h2 className="text-xs text-red-400 tracking-widest mb-2">
        CONTAINMENT ZONE
      </h2>

      <div className="text-xs">
        {active ? "Active Containment Engaged" : "Monitoring State"}
      </div>
    </motion.div>
  );
}