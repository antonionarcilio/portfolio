---
name: lint-fix
description: Run npx pnpm lint and npx pnpm typecheck, analyze the output, and fix all reported ESLint and TypeScript errors in the source files. Re-runs until both pass clean. Use when you want to check and fix lint/type errors in this project.
---

# Lint & Typecheck Fix

Run lint and typecheck, then fix all reported errors.

## Steps

1. Run lint first, then typecheck — capture full output of each:
   ```
   npx pnpm lint 2>&1
   npx pnpm typecheck 2>&1
   ```
   Collect all errors before starting any fixes so you have the complete picture.

2. Analyze the output:
   - If both pass with no errors (or only warnings that aren't treated as errors): report success and stop.
   - If there are errors: proceed to fix them.
   - **Warnings**: fix them only if the lint script uses `--max-warnings 0` (check `package.json`). Otherwise, leave warnings as-is unless they are clearly wrong.

3. Fix errors:
   - **ESLint errors**: Fix each reported file/line. Prefer code fixes over `// eslint-disable` comments. Only use disable comments as a last resort for rules that genuinely cannot be fixed (e.g., an external API type mismatch outside your control).
   - **TypeScript errors**: Fix type errors directly in the source. Do not use `// @ts-ignore` or `// @ts-expect-error` unless the error is a confirmed upstream bug with no workaround.

4. After fixing, re-run both checks to confirm zero errors:
   ```
   npx pnpm lint 2>&1
   npx pnpm typecheck 2>&1
   ```

5. If new errors appear, repeat the fix-and-verify loop — **up to 3 iterations total**. If errors persist after 3 attempts, stop, report the remaining errors clearly, and ask the user how to proceed.

## Rules

- Fix the root cause, not the symptom. Don't suppress errors.
- If a fix requires a larger refactor than expected, describe what needs to change and ask before proceeding.
- Do not modify test files or generated files (e.g. `dist/`, `build/`) to make checks pass.
- Never introduce `any` types just to silence TypeScript — use proper types or `unknown` with a type guard.
