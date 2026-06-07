import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function RadarLayer() {
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.z += 0.02;
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[0, 2, 32]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.1} />
    </mesh>
  );
}