import { useThreatStore } from "../state/useThreatStore";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

export default function CountryDistribution() {
  const attacks = useThreatStore((s) => s.attacks);

  const countryMap = {};
  attacks.forEach((a) => {
    if (!a.country) return;
    countryMap[a.country] = (countryMap[a.country] || 0) + 1;
  });

  const data = Object.keys(countryMap).map((key) => ({
    name: key,
    value: countryMap[key],
  }));

  const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-gray-800 h-[300px]">
      <h2 className="text-sm font-semibold mb-3 text-gray-400 tracking-widest">
        COUNTRY DISTRIBUTION
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}