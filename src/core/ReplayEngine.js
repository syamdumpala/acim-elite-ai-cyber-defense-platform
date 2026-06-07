import { MAX_HISTORY } from "../utils/constants";

export class ReplayEngine {
  static history = [];

  static record(attack) {
    this.history.push({
      ...attack,
      timestamp: Date.now(),
    });

    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    }
  }

  static getHistory() {
    return this.history;
  }

  static clear() {
    this.history = [];
  }
}