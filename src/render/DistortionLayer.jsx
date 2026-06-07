import { useThreatStore } from "../state/useThreatStore";

export default function DistortionLayer() {
  const mode = useThreatStore((s) => s.mode);

  if (mode !== "LOCKDOWN") return null;

  return (
    <mesh>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshBasicMaterial
        color="#ff0000"
        transparent
        opacity={0.05}
      />
    </mesh>
  );
}