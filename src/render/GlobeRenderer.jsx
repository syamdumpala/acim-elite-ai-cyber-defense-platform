import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useThreatStore } from "../state/useThreatStore";
import ArcManager from "./ArcManager";
import HeatmapLayer from "./HeatmapLayer";
import ShockwaveLayer from "./ShockwaveLayer";
import ShieldLayer from "./ShieldLayer";
import RadarLayer from "./RadarLayer";
import DistortionLayer from "./DistortionLayer";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Globe() {
  const ref = useRef();
  const risk = useThreatStore((s) => s.risk);

  useFrame(() => {
    ref.current.rotation.y += 0.0015;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        wireframe
        color="#1E293B"
        emissive={risk > 75 ? "#ef4444" : "#3B82F6"}
        emissiveIntensity={risk / 100}
      />
    </mesh>
  );
}

export default function GlobeRenderer() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <Stars />
      <Globe />
      <ArcManager />
      <HeatmapLayer />
      <ShockwaveLayer />
      <ShieldLayer />
      <RadarLayer />
      <DistortionLayer />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}