// lint-staged.config.js
// Apenas arquivos staged em commit serão checados/lintados/formatados
// Para projetos pnpm + TS/JS/MD
/** @type {import('lint-staged').Config} */
export default {
  '**/*.{ts,tsx,js,jsx}': (files) => {
    // Exclude .agents and .claude directories (skill templates and config)
    const filtered = files.filter((file) => !file.includes('.agents/') && !file.includes('.claude/'));
    if (filtered.length === 0) return [];
    return ['pnpm lint', 'pnpm format'];
  },
  // '**/*.md': 'pnpm format',
};
