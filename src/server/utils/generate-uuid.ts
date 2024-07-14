export function generateUUID(): string {
  return Math.random().toString(36).substring(2, 11);
}
