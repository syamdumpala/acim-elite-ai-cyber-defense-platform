import React, { useEffect, useState, useRef, useMemo } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars, Line as DreiLine } from "@react-three/drei";
import * as THREE from "three";

/* ================================================= */
/*                    MAIN APP                       */
/* ================================================= */

export default function App() {
  const [booting, setBooting] = useState(true);
  const [globalRisk, setGlobalRisk] = useState(0);
  const [riskHistory, setRiskHistory] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [classification, setClassification] = useState("STABLE");
  const [aiConfidence, setAiConfidence] = useState(0);
  const [anomalyScore, setAnomalyScore] = useState(0);

  const [warMode, setWarMode] = useState(false);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [show3D, setShow3D] = useState(true);

  const [attacks3D, setAttacks3D] = useState([]);
  const [attackHistory, setAttackHistory] = useState([]);
  const [ipTracker, setIpTracker] = useState([]);
  const [blacklist, setBlacklist] = useState([]);

  const alarmRef = useRef(null);
  const generateId = () => crypto.randomUUID();

  /* ================= BOOT ================= */

  useEffect(() => {
    alarmRef.current = new Audio("/alarm.mp3");
    setTimeout(() => setBooting(false), 2000);
  }, []);

  const triggerAlarm = () => {
    if (!alarmRef.current) return;
    alarmRef.current.currentTime = 0;
    alarmRef.current.play();
  };

  /* ================= SOCKET ================= */

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.globalRisk !== undefined) {
        const risk = msg.globalRisk;

        setGlobalRisk(risk);
        setAiConfidence(msg.ai_confidence || risk);
        setAnomalyScore(msg.anomaly_score || 0);
        setRiskHistory(prev => [...prev.slice(-40), risk]);

        if (risk < 40) setClassification("STABLE");
        else if (risk < 70) setClassification("ELEVATED");
        else if (risk < 85) setClassification("CRITICAL");
        else {
          setClassification("LOCKDOWN");
          setWarMode(true);
          triggerAlarm();
        }
      }

      if (msg.attack && msg.ip_data) {
        const attack = {
          id: generateId(),
          lat: msg.ip_data.lat,
          lon: msg.ip_data.lon,
          ip: msg.ip_data.ip,
          country: msg.ip_data.country,
        };

        setAttacks3D(prev => [attack, ...prev.slice(0, 15)]);
        setAttackHistory(prev => [attack, ...prev.slice(0, 50)]);
        setIpTracker(prev => [msg.ip_data, ...prev.slice(0, 10)]);

        setConsoleLogs(prev => [
          {
            id: generateId(),
            message: `Attack from ${attack.ip}`,
            time: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 40),
        ]);
      }
    };

    return () => socket.close();
  }, []);

  if (booting) return <BootScreen />;

  const layout = [
    { i: "kpi", x: 0, y: 0, w: 4, h: 4 },
    { i: "anomaly", x: 4, y: 0, w: 4, h: 4 },
    { i: "distribution", x: 8, y: 0, w: 4, h: 4 },
    { i: "risk", x: 0, y: 4, w: 6, h: 4 },
    { i: "cluster", x: 6, y: 4, w: 6, h: 4 },
    { i: "blacklist", x: 0, y: 8, w: 6, h: 4 },
    { i: "replay", x: 6, y: 8, w: 6, h: 4 },
    { i: "map", x: 0, y: 12, w: 12, h: 8 },
  ];

  return (
    <div className={`soc-shell ${warMode ? "war-mode" : ""} ${cinematicMode ? "cinematic-mode" : ""}`}>

      <CommandHeader
        classification={classification}
        show3D={show3D}
        warMode={warMode}
        cinematicMode={cinematicMode}
        setShow3D={setShow3D}
        setWarMode={setWarMode}
        setCinematicMode={setCinematicMode}
      />

      <GridLayout layout={layout} cols={12} rowHeight={80} width={1400}>

        <div key="kpi">
          <Panel title="ENTERPRISE KPI BOARD">
            <Metric label="Global Risk" value={`${globalRisk}%`} />
            <Metric label="AI Confidence" value={`${aiConfidence}%`} />
            <Metric label="Active Attacks" value={attacks3D.length} />
          </Panel>
        </div>

        <div key="anomaly">
          <Panel title="ML ANOMALY ENGINE">
            <Metric label="Anomaly Score" value={`${anomalyScore}%`} />
            <Metric label="Model" value="IsolationForest" />
          </Panel>
        </div>

        <div key="distribution">
          <ThreatDistribution />
        </div>

        <div key="risk">
          <RiskChart data={riskHistory} />
        </div>

        <div key="cluster">
          <ClusterHeatmap ipData={ipTracker} />
        </div>

        <div key="blacklist">
          <BlacklistPanel
            ipData={ipTracker}
            blacklist={blacklist}
            setBlacklist={setBlacklist}
          />
        </div>

        <div key="replay">
          <ReplayPanel
            history={attackHistory}
            setAttacks3D={setAttacks3D}
          />
        </div>

        <div key="map">
          <Panel title="3D GLOBAL ATTACK GRID">
            {show3D ? (
              <Canvas camera={{ position: [0, 0, 4] }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} />
                <Stars />
                <Globe />

                {attacks3D.map(a => (
                  <AttackArc key={a.id} lat={a.lat} lon={a.lon} />
                ))}

                <OrbitControls autoRotate />
              </Canvas>
            ) : (
              <ComposableMap projectionConfig={{ scale: 150 }}>
                <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json">
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#111827"
                        stroke="#00F5FF"
                      />
                    ))
                  }
                </Geographies>
              </ComposableMap>
            )}
          </Panel>
        </div>

      </GridLayout>

      <TacticalConsole logs={consoleLogs} />
    </div>
  );
}

/* ================= 3D GLOBE ================= */

function Globe() {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.001));
  return (
    <Sphere ref={ref} args={[1.5, 64, 64]}>
      <meshStandardMaterial wireframe color="#00F5FF" />
    </Sphere>
  );
}

function AttackArc({ lat, lon }) {
  const points = useMemo(() => {
    const radius = 1.5;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const start = new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );

    const mid = start.clone().multiplyScalar(1.4);
    const end = new THREE.Vector3(0, 0, 0);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(50);
  }, [lat, lon]);

  return <DreiLine points={points} color="red" lineWidth={2} />;
}

/* ================= PANELS ================= */

function ThreatDistribution() {
  const data = [
    { name: "DDoS", value: 35 },
    { name: "Injection", value: 25 },
    { name: "Recon", value: 20 },
    { name: "Brute", value: 20 },
  ];

  const COLORS = ["#FF3B3B", "#00F5FF", "#8B5CF6", "#00FF99"];

  return (
    <Panel title="THREAT DISTRIBUTION">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={70}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Panel>
  );
}

function RiskChart({ data }) {
  return (
    <Panel title="RISK TREND">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data.map((v, i) => ({ i, risk: v }))}>
          <XAxis dataKey="i" hide />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="risk" stroke="#FF3B3B" />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  );
}

function ClusterHeatmap({ ipData }) {
  const clusterMap = {};
  ipData.forEach(ip => {
    clusterMap[ip.country] = (clusterMap[ip.country] || 0) + 1;
  });

  const data = Object.entries(clusterMap).map(([country, count]) => ({
    country,
    count,
  }));

  return (
    <Panel title="ATTACK CLUSTER HEATMAP">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="country" />
          <YAxis />
          <Bar dataKey="count" fill="#FF3B3B" />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}

function BlacklistPanel({ ipData, blacklist, setBlacklist }) {
  const blockIP = (ip) => {
    if (!blacklist.includes(ip)) {
      setBlacklist(prev => [...prev, ip]);
    }
  };

  return (
    <Panel title="IP BLACKLIST CONTROL">
      {ipData.map((ip, i) => (
        <div key={i} className="metric">
          <span>{ip.ip}</span>
          <button onClick={() => blockIP(ip.ip)}>Block</button>
        </div>
      ))}

      <hr />
      <strong>Blocked IPs:</strong>
      {blacklist.map((ip, i) => (
        <div key={i}>{ip}</div>
      ))}
    </Panel>
  );
}

function ReplayPanel({ history, setAttacks3D }) {
  const replay = () => {
    if (!history.length) return;
    setAttacks3D([history[0]]);
  };

  return (
    <Panel title="ATTACK REPLAY MODE">
      <button onClick={replay}>Replay Last Attack</button>
    </Panel>
  );
}

function TacticalConsole({ logs }) {
  return (
    <div className="tactical-console open">
      {logs.map(log => (
        <div key={log.id} className="console-line">
          [{log.time}] {log.message}
        </div>
      ))}
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="glass-panel">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CommandHeader({
  classification,
  show3D,
  warMode,
  cinematicMode,
  setShow3D,
  setWarMode,
  setCinematicMode,
}) {
  return (
    <div className="command-header">
      <div>
        ACIM ELITE v18 AUTONOMOUS GRID
        <span className={`threat-badge ${classification.toLowerCase()}`}>
          {classification}
        </span>
      </div>

      <div>
        <button onClick={() => setShow3D(!show3D)}>
          {show3D ? "2D" : "3D"}
        </button>

        <button onClick={() => setWarMode(!warMode)}>
          {warMode ? "EXIT WAR" : "WAR"}
        </button>

        <button onClick={() => setCinematicMode(!cinematicMode)}>
          {cinematicMode ? "NORMAL" : "CINEMATIC"}
        </button>
      </div>
    </div>
  );
}

function BootScreen() {
  return (
    <div className="boot-screen">
      <div>Initializing Neural Defense Core...</div>
      <div>Loading ML Models...</div>
      <div className="boot-final">SYSTEM READY</div>
    </div>
  );
}