export class ClusterEngine {
  static detect(attacks = []) {
    if (attacks.length < 3) return false;

    const recent = attacks.slice(-10);

    const countryMap = {};

    recent.forEach((a) => {
      if (!a.country) return;
      countryMap[a.country] =
        (countryMap[a.country] || 0) + 1;
    });

    const clusterDetected = Object.values(countryMap).some(
      (count) => count >= 3
    );

    return clusterDetected;
  }
}