import { Line } from "@react-three/drei";
import { useThreatStore } from "../state/useThreatStore";
import { geoToSphere } from "../utils/geoToSphere";

export default function ArcManager() {
  const attacks = useThreatStore((s) => s.attacks);

  return (
    <>
      {attacks.map((a, i) => {
        if (!a.lat || !a.lon) return null;

        const start = geoToSphere(a.lat, a.lon);
        const end = geoToSphere(20, 78);

        const mid = [
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2 + 1,
          (start[2] + end[2]) / 2,
        ];

        return (
          <Line
            key={i}
            points={[start, mid, end]}
            color={a.severity > 75 ? "#ef4444" : "#f59e0b"}
            lineWidth={a.severity / 40}
            transparent
            opacity={0.8}
          />
        );
      })}
    </>
  );
}