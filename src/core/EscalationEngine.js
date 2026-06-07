export class EscalationEngine {
  static check(attacks = []) {
    if (attacks.length < 5) return false;

    const recent = attacks.slice(-5);

    const highSeverity = recent.filter(
      (a) => a.severity >= 80
    );

    return highSeverity.length >= 3;
  }
}