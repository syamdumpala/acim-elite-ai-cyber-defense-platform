import React, { useEffect, useState } from "react";

export default function CommandHeader({
  globalRisk,
  attackCount,
  connected,
}) {
  const [time, setTime] = useState(new Date());
  const [animatedRisk, setAnimatedRisk] = useState(0);

  /* Live Clock */
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* Smooth Risk Animation */
  useEffect(() => {
    let frame;
    const animate = () => {
      setAnimatedRisk((prev) => {
        if (prev === globalRisk) return prev;
        return prev + (globalRisk - prev) * 0.1;
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [globalRisk]);

  const riskColor =
    globalRisk < 40
      ? "#00FF99"
      : globalRisk < 70
      ? "#FACC15"
      : "#FF3B3B";

  return (
    <div className="command-header">

      <div className="command-logo">
        ACIM ELITE
      </div>

      <div className="command-metrics">

        <Metric
          label="GLOBAL RISK"
          value={`${Math.round(animatedRisk)}%`}
          color={riskColor}
        />

        <Metric
          label="ACTIVE THREATS"
          value={attackCount}
          color="#FF3B3B"
        />

        <Metric
          label="AI CONFIDENCE"
          value={`${Math.max(70, 100 - globalRisk)}%`}
          color="#8B5CF6"
        />

        <Metric
          label="BACKEND"
          value={connected ? "ONLINE" : "OFFLINE"}
          color={connected ? "#00FF99" : "#FF3B3B"}
        />

        <Metric
          label="UTC TIME"
          value={time.toUTCString().slice(17, 25)}
          color="#00F5FF"
        />

      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div className="command-metric">
      <span className="metric-label">{label}</span>
      <span className="metric-value" style={{ color }}>
        {value}
      </span>
    </div>
  );
}