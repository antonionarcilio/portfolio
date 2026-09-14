export function circularIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) return 0;
  return ((index % itemCount) + itemCount) % itemCount;
}
