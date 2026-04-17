let seq = 0;

export function resetIdCounter(): void {
  seq = 0;
}

export function createInstanceId(prefix: string): string {
  seq += 1;
  return `${prefix}_${seq}`;
}
