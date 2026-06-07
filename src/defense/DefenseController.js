import { MODES } from "../utils/constants";

export class DefenseController {
  static activeMode = MODES.STABLE;

  static activate(mode) {
    this.activeMode = mode;

    if (mode === MODES.CRITICAL) {
      console.log("⚠ Activating Defensive Shield");
    }

    if (mode === MODES.LOCKDOWN) {
      console.log("🚨 LOCKDOWN DEFENSE PROTOCOL ENGAGED");
    }
  }

  static getMode() {
    return this.activeMode;
  }
}