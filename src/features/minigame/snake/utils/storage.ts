import { HIGH_SCORE_KEY } from './constants';

export function getHighScore(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  if (stored === null) return 0;
  const parsed = Number(stored);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function setHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HIGH_SCORE_KEY, String(score));
}
