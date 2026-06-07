import { useThreatStore } from "../state/useThreatStore";
import { Html } from "@react-three/drei";

export default function HeatmapLayer() {
  const attacks = useThreatStore((s) => s.attacks);

  const density = attacks.length;

  return (
    <Html position={[0, -3, 0]}>
      <div className="text-xs text-red-400">
        Density: {density}
      </div>
    </Html>
  );
}