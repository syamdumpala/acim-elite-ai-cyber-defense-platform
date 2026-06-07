import { clamp } from "../utils/mathHelpers";

export class DecayEngine {
  static apply(currentRisk) {
    const decayRate = 3;

    const decayed = currentRisk - decayRate;

    return clamp(decayed, 0, 100);
  }
}