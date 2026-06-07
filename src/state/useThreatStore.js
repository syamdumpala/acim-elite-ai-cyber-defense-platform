import { create } from "zustand";
import { MODES, SYSTEM_LIMITS } from "../utils/constants";

import { RiskEngine } from "../core/RiskEngine";
import { ModeEngine } from "../core/ModeEngine";
import { ClusterEngine } from "../core/ClusterEngine";
import { EscalationEngine } from "../core/EscalationEngine";
import { DecayEngine } from "../core/DecayEngine";
import { ReplayEngine } from "../core/ReplayEngine";

import { getLatency } from "../services/latencyMonitor";

export const useThreatStore = create((set, get) => ({

  // =============================
  // CORE SYSTEM STATE
  // =============================

  attacks: [],
  risk: 0,
  mode: MODES.STABLE,
  clusterDetected: false,
  lockdownActive: false,
  recoveryActive: false,
  latency: 0,

  // =============================
  // ADD ATTACK PIPELINE
  // =============================

  addAttack: (attack) => {
    const state = get();

    const risk = RiskEngine.calculateRisk(attack);

    const updatedAttacks = [
      ...state.attacks,
      attack,
    ].slice(-SYSTEM_LIMITS.MAX_ATTACK_HISTORY);

    const cluster = ClusterEngine.detect(updatedAttacks);
    const escalation = EscalationEngine.check(updatedAttacks);

    const nextMode = escalation
      ? MODES.LOCKDOWN
      : ModeEngine.determineMode(risk);

    ReplayEngine.record(attack);

    set({
      attacks: updatedAttacks,
      risk,
      clusterDetected: cluster,
      mode: nextMode,
      lockdownActive: nextMode === MODES.LOCKDOWN,
      recoveryActive: false,
    });
  },

  // =============================
  // APPLY RISK DECAY
  // =============================

  applyDecay: () => {
    const state = get();

    const decayed = DecayEngine.apply(state.risk);
    const nextMode = ModeEngine.determineMode(decayed);

    set({
      risk: decayed,
      mode: nextMode,
      recoveryActive: nextMode === MODES.RECOVERY,
      lockdownActive: nextMode === MODES.LOCKDOWN,
    });
  },

  // =============================
  // SYSTEM RESET
  // =============================

  resetSystem: () => {
    ReplayEngine.clear();

    set({
      attacks: [],
      risk: 0,
      mode: MODES.STABLE,
      clusterDetected: false,
      lockdownActive: false,
      recoveryActive: false,
    });
  },

  // =============================
  // LATENCY SYNC
  // =============================

  syncLatency: () => {
    set({
      latency: getLatency(),
    });
  },

  // =============================
  // REPLAY ACCESS
  // =============================

  getReplayHistory: () =>
    ReplayEngine.getHistory(),

}));