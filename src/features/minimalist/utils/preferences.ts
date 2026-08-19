export const APPEARANCE_STORAGE_KEY = 'minimalist:appearance';
export const LOCALE_STORAGE_KEY = 'minimalist:locale';
export const ACTIVE_SECTION_STORAGE_KEY = 'minimalist:active-section';
export const MINIMALIST_SECTION_IDS = ['about', 'projects', 'experience', 'education'] as const;

export function readStoredPreference(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStoredPreference(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function readStoredSessionPreference(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStoredSessionPreference(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function readStoredSection(sections: string[]): string | null {
  const stored = readStoredSessionPreference(ACTIVE_SECTION_STORAGE_KEY);
  return stored && sections.includes(stored) ? stored : null;
}
