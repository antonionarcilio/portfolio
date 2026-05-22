export function skillRank(level: number): 'S' | 'A' | 'B' | 'C' | 'F' {
  if (level >= 9) return 'S';
  if (level >= 7) return 'A';
  if (level >= 4) return 'B';
  if (level >= 1) return 'C';
  return 'F';
}
