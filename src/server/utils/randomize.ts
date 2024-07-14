export function randomize<T>(v: T[]): T {
  return v[Math.floor(Math.random() * v.length)];
}
