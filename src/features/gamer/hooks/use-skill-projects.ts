'use client';

import { useEffect, useRef, useState } from 'react';

import { getSkillProjects, type SkillProject } from '@/features/gamer/actions/get-skill-projects';

export function useSkillProjects(documentIds: string[], locale: string) {
  const [projects, setProjects] = useState<SkillProject[]>([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Map<string, SkillProject[]>>(new Map());

  // Stable key derived from the sorted, non-empty documentIds — avoids array
  // reference churn as the effect dependency.
  const idsKey = documentIds.filter(Boolean).sort().join(',');

  useEffect(() => {
    if (!idsKey) {
      setProjects([]);
      return;
    }

    const cacheKey = `${idsKey}:${locale}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setProjects(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getSkillProjects(idsKey.split(','), locale)
      .then((result) => {
        if (cancelled) return;
        cacheRef.current.set(cacheKey, result);
        setProjects(result);
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [idsKey, locale]);

  return { projects, loading };
}
