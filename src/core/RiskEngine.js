import { clamp } from "../utils/mathHelpers";

export class RiskEngine {
  static calculateRisk(attack) {
    if (!attack) return 0;

    const base = attack.severity || 10;
    const geoFactor = attack.geoRisk || 1;
    const vectorFactor = attack.vectorWeight || 1;
    const anomalyBoost = attack.anomaly ? 1.5 : 1;

    const computed =
      base * geoFactor * vectorFactor * anomalyBoost;

    return clamp(Math.round(computed), 0, 100);
  }
}