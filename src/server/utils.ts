export default {
  probability(v: number): boolean {
    return (Math.floor(1 + Math.random() * 100) <= v);
  },

  randomize<T>(v: T[]): T {
    return v[Math.floor(Math.random() * v.length)];
  },

  generate(): string {
    return Math.random().toString(36).substr(2, 9);
  },
};
