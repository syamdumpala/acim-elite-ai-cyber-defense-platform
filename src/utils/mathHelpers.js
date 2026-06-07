export const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

export const lerp = (a, b, t) =>
  a + (b - a) * t;

export const normalize = (value, min, max) =>
  max === min ? 0 : (value - min) / (max - min);

export const randomInRange = (min, max) =>
  Math.random() * (max - min) + min;

export const average = (arr = []) =>
  arr.length === 0
    ? 0
    : arr.reduce((a, b) => a + b, 0) / arr.length;

export const standardDeviation = (arr = []) => {
  if (arr.length === 0) return 0;
  const avg = average(arr);
  const squareDiffs = arr.map((v) =>
    Math.pow(v - avg, 2)
  );
  return Math.sqrt(average(squareDiffs));
};