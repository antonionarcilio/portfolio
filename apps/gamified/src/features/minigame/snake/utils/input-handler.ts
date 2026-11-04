import type { Direction } from '../types';

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
};

export function isOpposite(current: Direction, requested: Direction): boolean {
  return OPPOSITE[current] === requested;
}

export function directionFromKey(key: string): Direction | null {
  return KEY_MAP[key] ?? null;
}

const SWIPE_MIN_DELTA = 30;

export function directionFromSwipe(
  touchStartX: number,
  touchStartY: number,
  touchEndX: number,
  touchEndY: number,
): Direction | null {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) < SWIPE_MIN_DELTA && Math.abs(dy) < SWIPE_MIN_DELTA) {
    return null;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'RIGHT' : 'LEFT';
  }

  return dy > 0 ? 'DOWN' : 'UP';
}
