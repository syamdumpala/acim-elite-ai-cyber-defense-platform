import { randomInRange, clamp } from "../utils/mathHelpers";

export function ingestAttack(raw = {}) {
  const severity = clamp(
    raw.severity ?? randomInRange(10, 100),
    0,
    100
  );

  return {
    id: raw.id || Date.now(),
    ip: raw.ip || generateRandomIP(),
    lat: raw.lat ?? randomInRange(-60, 60),
    lon: raw.lon ?? randomInRange(-180, 180),
    country: raw.country || "Unknown",
    severity,
    anomaly: raw.anomaly ?? false,
    geoRisk: raw.geoRisk ?? 1,
    vectorWeight: raw.vectorWeight ?? 1,
    timestamp: Date.now(),
  };
}

function generateRandomIP() {
  return `${rand255()}.${rand255()}.${rand255()}.${rand255()}`;
}

function rand255() {
  return Math.floor(Math.random() * 255);
}