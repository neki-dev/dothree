export function probability(v: number): boolean {
  return (Math.floor(1 + Math.random() * 100) <= v);
}

export function randomize<T>(v: T[]): T {
  return v[Math.floor(Math.random() * v.length)];
}

export function generateUUID(): string {
  return Math.random().toString(36).substr(2, 9);
}
