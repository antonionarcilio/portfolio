'use client';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import type { ToolsTab } from './use-island-panel';

const STORAGE_KEY = 'pro-island-tools-tab';
const DEFAULT_TOOLS_TAB: ToolsTab = 'visuals';

const toolsTabSchema: z.ZodType<ToolsTab> = z.enum(['visuals', 'accessibility', 'languages']);

function readStoredTab(): ToolsTab | null {
  try {
    const parsed = toolsTabSchema.safeParse(sessionStorage.getItem(STORAGE_KEY));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeStoredTab(tab: ToolsTab): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, tab);
  } catch {}
}

/**
 * Última aba de ferramentas que ficou ativa, guardada em `sessionStorage` (vale até fechar a
 * aba do navegador). A leitura acontece depois da montagem para não divergir do HTML do servidor;
 * até lá vale `visuals`. Um valor inválido no storage é ignorado.
 * @example const lastTab = useRememberedToolsTab(activeTab); onClick={() => openTab(lastTab)}
 */
export function useRememberedToolsTab(activeTab: ToolsTab | null): ToolsTab {
  const [rememberedTab, setRememberedTab] = useState<ToolsTab>(DEFAULT_TOOLS_TAB);

  useEffect(() => {
    const storedTab = readStoredTab();
    if (storedTab) setRememberedTab(storedTab);
  }, []);

  useEffect(() => {
    if (!activeTab) return;
    setRememberedTab(activeTab);
    writeStoredTab(activeTab);
  }, [activeTab]);

  return rememberedTab;
}
