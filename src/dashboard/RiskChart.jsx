import { useThreatStore } from "../state/useThreatStore";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

export default function RiskChart() {
  const risk = useThreatStore((s) => s.risk);
  const history = useThreatStore((s) => s.attacks);

  const data = history.slice(-20).map((a, i) => ({
    name: i,
    risk: a.severity || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#111827] rounded-xl p-4 border border-gray-800 h-[300px]"
    >
      <h2 className="text-sm font-semibold mb-3 text-gray-400 tracking-widest">
        RISK TREND
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis hide />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}