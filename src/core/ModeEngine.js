import { MODES, RISK_THRESHOLDS } from "../utils/constants";

export class ModeEngine {
  static determineMode(risk) {
    if (risk >= RISK_THRESHOLDS.LOCKDOWN) {
      return MODES.LOCKDOWN;
    }

    if (risk >= RISK_THRESHOLDS.CRITICAL) {
      return MODES.CRITICAL;
    }

    if (risk >= RISK_THRESHOLDS.ELEVATED) {
      return MODES.ELEVATED;
    }

    return MODES.STABLE;
  }
}