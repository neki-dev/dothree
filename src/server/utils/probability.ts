export function probability(v: number): boolean {
  return Math.floor(1 + Math.random() * 100) <= v;
}
