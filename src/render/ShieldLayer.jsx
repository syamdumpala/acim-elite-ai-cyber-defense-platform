import { useThreatStore } from "../state/useThreatStore";

export default function ShieldLayer() {
  const risk = useThreatStore((s) => s.risk);

  if (risk < 75) return null;

  return (
    <mesh>
      <sphereGeometry args={[2.2, 32, 32]} />
      <meshBasicMaterial
        color="#3B82F6"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}