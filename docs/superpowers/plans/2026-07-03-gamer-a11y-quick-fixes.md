# Correções rápidas de acessibilidade (Gamer) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 5 accessibility gaps documented in `docs/accessibility.md` that make
up sub-project (A): unreachable/non-activatable clickable cards, no skip link, no
navigation landmark, `reduceMotion` ignoring OS preference, and a no-op
`aria-describedby` placeholder.

**Architecture:** Small, independent edits across existing components — one new
shared hook (`useActivationProps`) that both `AnimatedCard` and `FlipBadge` consume,
plus five surgical edits to existing files. No new dependencies, no new routes, no
state management changes beyond one `useState` initializer.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4
(`sr-only` / `focus:not-sr-only` utilities ship with Tailwind v4 by default — no
custom CSS needed).

## Global Constraints

- Filenames: kebab-case only (per `AGENTS.md`).
- No `any` types; explicit types everywhere.
- Functions 4–20 lines; files under 500 lines.
- Prettier + `prettier-plugin-organize-imports` auto-sorts imports on save/format —
  don't hand-order imports, just run `npx pnpm format` before committing if unsure.
- Use `npx pnpm <command>`, never bare `pnpm` (not on PATH in this environment).
- **No automated test framework exists in this repository** (no Jest/Vitest, no
  `*.test.ts` files). Verification steps in this plan use `npx pnpm typecheck`,
  `npx pnpm lint`, `npx pnpm build`, and manual browser QA instead of automated
  tests.
- Known environment issue: `npx pnpm dev` returns HTTP 500 on `/portfolios/gamer/*`
  routes under Node 25 (a `localStorage`-related dev-mode bug, unrelated to this
  work). For manual QA, use `npx pnpm build && npx pnpm start` instead of `dev`.
- Animations must use Framer Motion exclusively — none of these tasks add new
  animation code, so this constraint is only relevant if a reviewer questions why
  no `@media (prefers-reduced-motion)` CSS was added (Task 6 explains why).

---

## File Structure

- **Create** `src/features/gamer/hooks/use-activation-props.ts` — shared hook that
  turns any `onClick` handler into keyboard-activatable button semantics
  (`role="button"`, `tabIndex={0}`, `onKeyDown` for Enter/Space).
- **Modify** `src/features/gamer/components/animated-card.tsx` — consumes the hook,
  merges its output with any explicit `role`/`tabIndex`/`onKeyDown` props already
  passed in.
- **Modify** `src/features/gamer/components/achievements.tsx` — `FlipBadge`
  consumes the hook directly on its clickable `<div>`; dead `tabIndex={0}` removed
  from the wrapping `AnimatedCard` (which has no `onClick`).
- **Modify** `src/app/portfolios/gamer/layout.tsx` — adds the skip link.
- **Modify** `src/features/gamer/components/portfolio-client.tsx` — adds
  `<main id="main-content">` as the skip link's target.
- **Modify** `src/features/gamer/components/cv-header.tsx` — language switcher
  `<div role="group">` becomes `<nav aria-label="Idioma">`.
- **Modify** `src/features/gamer/contexts/a11y-context.tsx` — `reduceMotion`
  default falls back to `matchMedia('(prefers-reduced-motion: reduce)')` when
  nothing is saved in `localStorage`.
- **Modify** `src/shared/components/dropdown-base.tsx` and
  `src/shared/components/modal-base.tsx` — remove the no-op
  `aria-describedby={undefined}`.

No file in this plan exceeds ~70 lines after changes; no splits needed.

---

## Task 1: `useActivationProps` hook + wire into `AnimatedCard`

**Files:**
- Create: `src/features/gamer/hooks/use-activation-props.ts`
- Modify: `src/features/gamer/components/animated-card.tsx`

**Interfaces:**
- Produces: `useActivationProps(onClick?: () => void): { role?: 'button'; tabIndex?: number; onKeyDown?: React.KeyboardEventHandler }` — an empty object when `onClick` is `undefined`, otherwise the three a11y props. Consumed by `AnimatedCard` (this task) and `FlipBadge` (Task 2).

- [ ] **Step 1: Create the hook**

```ts
// src/features/gamer/hooks/use-activation-props.ts
'use client';

import type { KeyboardEventHandler } from 'react';

type ActivationProps = {
  role?: 'button';
  tabIndex?: number;
  onKeyDown?: KeyboardEventHandler;
};

/** Turns a click handler into a keyboard-activatable (Enter/Space) button. */
export function useActivationProps(onClick?: () => void): ActivationProps {
  if (!onClick) return {};

  return {
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
  };
}
```

- [ ] **Step 2: Verify the hook compiles in isolation**

Run: `npx pnpm typecheck`
Expected: no errors mentioning `use-activation-props.ts`.

- [ ] **Step 3: Wire the hook into `AnimatedCard`, merging with explicit props**

Current `src/features/gamer/components/animated-card.tsx` (full file, 69 lines) takes
`onClick`, `role`, `tabIndex`, `onKeyDown` as plain pass-through props and never
derives them from each other. Replace the body so the hook's output is merged
underneath any explicit values (explicit props still win, so existing callers that
already pass a custom `role`/`onKeyDown` keep working unchanged):

```tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { listItemVariants, listStaggerDelay } from '@/features/gamer/animations';
import { useA11y } from '@/features/gamer/contexts/a11y-context';
import { useActivationProps } from '@/features/gamer/hooks/use-activation-props';
import { useScrollRoot } from './scroll-list';

export function AnimatedCard({
  index = 0,
  className,
  whileHover,
  children,
  onClick,
  role,
  tabIndex,
  title,
  onKeyDown,
}: {
  index?: number;
  className?: string;
  whileHover?: React.ComponentProps<typeof motion.div>['whileHover'];
  children: React.ReactNode;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  title?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const root = useScrollRoot();

  const isInScrollView = useInView(cardRef, {
    root: root ?? undefined,
    once: true,
    margin: '0px 0px -8px 0px',
  });
  const isInPageView = useInView(cardRef, {
    once: true,
    margin: '0px 0px -8px 0px',
  });

  const isInView = root ? isInScrollView && isInPageView : isInPageView;
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  const delay = listStaggerDelay(index);
  const activationProps = useActivationProps(onClick);

  return (
    <motion.div
      ref={cardRef}
      className={className}
      custom={delay}
      variants={listItemVariants}
      initial={noMotion ? false : 'hidden'}
      animate={noMotion ? { opacity: 1, y: 0 } : isInView ? 'visible' : 'hidden'}
      whileHover={noMotion ? undefined : whileHover}
      transition={noMotion ? { duration: 0 } : { duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      onClick={onClick}
      role={role ?? activationProps.role}
      tabIndex={tabIndex ?? activationProps.tabIndex}
      title={title}
      onKeyDown={onKeyDown ?? activationProps.onKeyDown}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Verify types and lint**

Run: `npx pnpm typecheck && npx pnpm lint`
Expected: both exit 0, no new errors.

- [ ] **Step 5: Build to catch any SSR/client issues**

Run: `npx pnpm build`
Expected: build succeeds (no type errors, no failed prerender of `/portfolios/gamer/*`).

- [ ] **Step 6: Manual keyboard QA**

Run: `npx pnpm start` (after the build above), open
`http://localhost:3000/portfolios/gamer/pt-BR`. Press Tab until an experience card
(e.g. the first card under "Experiência(s)") is focused — confirm a visible orange
focus ring appears (from `html.cv-gamer-root *:focus-visible` in
`src/features/gamer/styles.css:126-129`). Press Enter, then (on a separate focus)
press Space — both must open the same detail modal that a mouse click opens.
Repeat for a card under "Principais Projetos". Both `experience-section.tsx` and
`projects-section.tsx` already pass `onClick` to `AnimatedCard` — no edits needed
in either file, this step only confirms the fix reaches them.

- [ ] **Step 7: Commit**

```bash
git add src/features/gamer/hooks/use-activation-props.ts src/features/gamer/components/animated-card.tsx
git commit -m "$(cat <<'EOF'
♿ fix(gamer): adiciona ativação por teclado aos cards clicáveis

AnimatedCard agora deriva role="button"/tabIndex/onKeyDown de onClick
via useActivationProps, tornando cards de experiência e projetos
acessíveis por Enter/Space sem precisar editar cada chamador.
EOF
)"
```

---

## Task 2: Apply `useActivationProps` to `FlipBadge`, remove dead `tabIndex`

**Files:**
- Modify: `src/features/gamer/components/achievements.tsx`

**Interfaces:**
- Consumes: `useActivationProps(onClick?: () => void)` from Task 1
  (`src/features/gamer/hooks/use-activation-props.ts`).

- [ ] **Step 1: Apply the hook to `FlipBadge`'s clickable `<div>`**

Current `FlipBadge` (lines 20-68 of `achievements.tsx`) has a `<div>` at lines 57-60
that gets `onClick={canPopup ? onOpen : undefined}` but no keyboard/role support.
Add the import and spread the hook's output onto that div:

```tsx
import { useActivationProps } from '@/features/gamer/hooks/use-activation-props';
```

Inside `FlipBadge`, after the existing `canPopup` line:

```tsx
  const canPopup = !useIsMobile(521);
  const activationProps = useActivationProps(canPopup ? onOpen : undefined);
```

Replace the clickable div (previously):

```tsx
        <div
          className={canPopup ? 'cursor-gamer-pointer' : 'cursor-gamer-help'}
          onClick={canPopup ? onOpen : undefined}
        >
```

with:

```tsx
        <div
          className={canPopup ? 'cursor-gamer-pointer' : 'cursor-gamer-help'}
          onClick={canPopup ? onOpen : undefined}
          {...activationProps}
        >
```

- [ ] **Step 2: Remove the dead `tabIndex={0}` on the wrapping `AnimatedCard`**

In `Achievements` (same file), the `AnimatedCard` wrapping each `FlipBadge` (around
line 85-90) has `tabIndex={0}` but no `onClick` — it's not interactive itself
(`FlipBadge` inside it is), so the tabIndex just adds a dead stop to the tab order.
Remove that one prop:

```tsx
              <AnimatedCard
                index={i}
                className="relative group grid grid-cols-[56px_1fr] gap-[14px] items-center border border-cv-border bg-cv-panel px-[18px] py-[14px] cursor-gamer-default outline-none focus-visible:outline-none"
                whileHover={HOVER_LIFT_SCALE_VARIANT}
              >
```

(only the `tabIndex={0}` line is deleted; everything else in the file is untouched)

- [ ] **Step 3: Verify types and lint**

Run: `npx pnpm typecheck && npx pnpm lint`
Expected: both exit 0.

- [ ] **Step 4: Manual QA**

With `npx pnpm build && npx pnpm start` running, open
`http://localhost:3000/portfolios/gamer/pt-BR` at a viewport wider than 521px (so
`canPopup` is `true`). Tab to a badge under "Conquistas" — confirm the focus ring
lands directly on the badge image (not on an empty wrapping card first), and that
Enter/Space opens the achievement image modal. Resize below 521px and confirm the
badge is no longer keyboard-focusable (matches existing mobile behavior — no popup,
tooltip only).

- [ ] **Step 5: Commit**

```bash
git add src/features/gamer/components/achievements.tsx
git commit -m "$(cat <<'EOF'
♿ fix(gamer): torna badges de conquista ativáveis por teclado

FlipBadge usa useActivationProps para o clique que abre o modal de
imagem; remove tabIndex morto do AnimatedCard que só envolve o badge
(não tem onClick próprio).
EOF
)"
```

---

## Task 3: Skip link + `<main id="main-content">` landmark

**Files:**
- Modify: `src/app/portfolios/gamer/layout.tsx`
- Modify: `src/features/gamer/components/portfolio-client.tsx`

**Interfaces:** none (no shared types; the two files are linked only by the
`href="#main-content"` / `id="main-content"` string contract).

- [ ] **Step 1: Add the skip link as the first child of `GamerLayout`**

Current `src/app/portfolios/gamer/layout.tsx` (full file, 34 lines) renders
`<A11yProvider>{children}</A11yProvider>` as the first thing inside the font-variable
wrapper `<div>`. Add the skip link immediately before it:

```tsx
import { A11yProvider } from '@/features/gamer/contexts/a11y-context';
import { Chakra_Petch, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const chakraPetch = Chakra_Petch({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-chakra-petch',
  display: 'swap',
});

export default function GamerLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${shareTechMono.variable} ${jetbrainsMono.variable} ${chakraPetch.variable}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[999] focus:bg-cv-panel focus:text-cv-cyan focus:border focus:border-cv-cyan focus:px-4 focus:py-2 focus:font-cv-mono focus:text-[13px] focus:no-underline"
      >
        Pular para o conteúdo
      </a>
      <A11yProvider>{children}</A11yProvider>
      {/* Portal root for modals — inside the font-variable scope so CSS vars cascade */}
      <div id="gamer-portal-root" className="font-cv-mono" />
    </div>
  );
}
```

`sr-only` and `focus:not-sr-only` are Tailwind v4 built-ins (no custom CSS needed).
`bg-cv-panel`, `text-cv-cyan`, `border-cv-cyan`, `font-cv-mono` are existing design
tokens already used elsewhere in this codebase (e.g. `cv-header.tsx`).

- [ ] **Step 2: Add `<main id="main-content">` in `portfolio-client.tsx`**

Current `src/features/gamer/components/portfolio-client.tsx` (full file, 112 lines)
has a single `<div className="... cv-page-content">` wrapping everything from
`CvHeader` to `CvFooter` (lines 58-109). Split it: `CvHeader` and `CvFooter` stay
directly inside `cv-page-content`; everything between them (from `<Stats>` through
the closing of `<div className={'sm-layout' ...}>`) moves inside a new
`<main id="main-content">`. No class names change — only the tag structure:

```tsx
  return (
    <div className="cv-gamer-wrapper bg-cv-wrapper text-cv-text font-cv-mono text-[14px] leading-[1.5] tracking-[0.02em] min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 pt-10 pb-10 cv-page-content">
        <CvHeader data={data} />
        <main id="main-content">
          <Stats
            items={statsWithDynamic}
            onFirstClick={handleScrollToExperience}
            onSecondClick={handleScrollToSkills}
            onThirdClick={handleScrollToProjects}
          />
          <div className={'sm-layout' + (smCollapsed ? ' sm-collapsed' : '')}>
            <div className="sm-skillmap">
              <SkillMap
                onPanelChange={(open) => {
                  if (!open) {
                    col2Opacity.set(0);
                    setSmCollapsed(true);
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => animate(col2Opacity, 1, { duration: 0.35, ease: 'easeOut' })),
                    );
                  } else {
                    col2Opacity.set(0);
                    setSmCollapsed(false);
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => animate(col2Opacity, 1, { duration: 0.35, ease: 'easeOut' })),
                    );
                  }
                }}
                flash={flashSkills}
                onFlashEnd={() => setFlashSkills(false)}
                skills={data.skillCategories}
              />
            </div>
            <div className="sm-col1 gap-9">
              <ExperienceSection items={data.experience} flash={flashExp} onFlashEnd={() => setFlashExp(false)} />
              <ProjectsSection
                items={data.projects}
                flash={flashProjects}
                onFlashEnd={() => setFlashProjects(false)}
                expanded={!smCollapsed}
              />
            </div>
            <div className="sm-col2">
              <motion.div className="flex flex-col gap-9" style={{ opacity: col2Opacity }}>
                <ContactSection data={data} />
                <EducationSection items={data.education} />
                <Achievements items={data.achievements} />
              </motion.div>
            </div>
          </div>
        </main>
        <CvFooter openToWork={data.openToWork} />
      </div>
    </div>
  );
```

Only the top of the function (imports, hooks, callbacks, `statsWithDynamic`) stays
unchanged above this `return`.

- [ ] **Step 3: Verify types, lint, and build**

Run: `npx pnpm typecheck && npx pnpm lint && npx pnpm build`
Expected: all succeed. `<main>` has no special TypeScript typing concerns (it's a
plain intrinsic element), so this step mainly guards against a stray unclosed tag.

- [ ] **Step 4: Manual QA**

With `npx pnpm start` running, open `http://localhost:3000/portfolios/gamer/pt-BR`
and press Tab exactly once from the top of the page (click the address bar first,
then Tab). Confirm the "Pular para o conteúdo" link becomes visible with a bordered
cyan box. Press Enter on it — confirm focus and scroll position land at the `Stats`
row (the top of `<main>`), skipping over the header. Open browser DevTools console
and run `document.querySelectorAll('main').length` — expect `1`.

- [ ] **Step 5: Commit**

```bash
git add src/app/portfolios/gamer/layout.tsx src/features/gamer/components/portfolio-client.tsx
git commit -m "$(cat <<'EOF'
♿ fix(gamer): adiciona skip link e landmark <main>

Link "Pular para o conteúdo" (visível só ao focar via teclado) aponta
para um <main id="main-content"> real que envolve o conteúdo entre o
header e o footer do portfólio.
EOF
)"
```

---

## Task 4: Language switcher becomes a `<nav>` landmark

**Files:**
- Modify: `src/features/gamer/components/cv-header.tsx`

**Interfaces:** none.

- [ ] **Step 1: Change the wrapping element**

In `HeaderTriggers` (around line 279-284 of `cv-header.tsx`), the language switcher
is currently:

```tsx
      <div
        className="inline-flex items-center gap-2 border border-cv-border px-[10px] py-1 bg-[rgba(43,214,255,0.04)]"
        role="group"
        aria-label="Language"
      >
```

Change the tag to `<nav>` and translate the label to match the rest of the PT-BR
UI (the app has no translated-`aria-label` system yet — this matches every other
hardcoded PT-BR label in this file, e.g. `aria-label="próximo"` at line 265):

```tsx
      <nav
        className="inline-flex items-center gap-2 border border-cv-border px-[10px] py-1 bg-[rgba(43,214,255,0.04)]"
        aria-label="Idioma"
      >
```

Update the matching closing tag a few lines down from `</div>` to `</nav>` (it wraps
the `SUPPORTED_LOCALES.map(...)` block — the only `</div>` at that nesting level
inside `HeaderTriggers`'s returned JSX before `<A11yDropdown .../>`). Nothing else
in this block changes — the inner `{i > 0 && <span>...}` separator and `<Link
aria-current={...}>` stay exactly as they are.

- [ ] **Step 2: Verify types and lint**

Run: `npx pnpm typecheck && npx pnpm lint`
Expected: both exit 0. (`<nav>` is a valid intrinsic element; `role="group"` is
simply removed, no type implications.)

- [ ] **Step 3: Manual QA**

With `npx pnpm build && npx pnpm start` running, open
`http://localhost:3000/portfolios/gamer/pt-BR`, open DevTools console, and run:

```js
document.querySelectorAll('nav').length
```

Expect `1`. Then run:

```js
document.querySelector('nav').getAttribute('aria-label')
```

Expect `"Idioma"`. Visually confirm the pt-BR/en switcher still looks and behaves
identically (same border, same active/inactive link styling).

- [ ] **Step 4: Commit**

```bash
git add src/features/gamer/components/cv-header.tsx
git commit -m "$(cat <<'EOF'
♿ fix(gamer): troca seletor de idioma para landmark <nav>

O único <div role=\"group\"> que efetivamente navega entre rotas
(pt-BR/en) agora é um <nav aria-label=\"Idioma\">, dando ao app seu
primeiro landmark de navegação real.
EOF
)"
```

---

## Task 5: `reduceMotion` falls back to `prefers-reduced-motion`

**Files:**
- Modify: `src/features/gamer/contexts/a11y-context.tsx`

**Interfaces:** none (internal to this file; `A11yOpts`/`useA11y()`'s public shape
is unchanged).

- [ ] **Step 1: Add a helper that reads the OS preference**

Add this function above the module-load guard (after `STORAGE_KEY`, before the
`if (typeof window !== 'undefined')` block):

```ts
function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

- [ ] **Step 2: Use it as fallback in the module-load guard**

Current (lines 25-32):

```ts
if (typeof window !== 'undefined') {
  try {
    const _stored = localStorage.getItem(STORAGE_KEY);
    if (_stored && JSON.parse(_stored)?.reduceMotion) {
      MotionGlobalConfig.skipAnimations = true;
    }
  } catch {}
}
```

Replace with:

```ts
if (typeof window !== 'undefined') {
  try {
    const _stored = localStorage.getItem(STORAGE_KEY);
    const _parsed = _stored ? JSON.parse(_stored) : null;
    if (_parsed?.reduceMotion === true || (_parsed?.reduceMotion === undefined && prefersReducedMotion())) {
      MotionGlobalConfig.skipAnimations = true;
    }
  } catch {}
}
```

(`_parsed?.reduceMotion === undefined` covers both "nothing stored at all" and "an
object was stored but never included `reduceMotion`" — either way, defer to the OS
preference. If the user has explicitly stored `reduceMotion: false`, that value
wins and the OS preference is not consulted.)

- [ ] **Step 3: Use it as the initial `useState` value in `A11yProvider`**

Current (line 60):

```ts
const [opts, setOpts] = useState<A11yOpts>(DEFAULT_OPTS);
```

Replace with a lazy initializer that applies the same fallback (only for
`reduceMotion` — the other 4 keys keep their `DEFAULT_OPTS` values, since none of
them have an OS-level media-query equivalent):

```ts
const [opts, setOpts] = useState<A11yOpts>(() => ({
  ...DEFAULT_OPTS,
  reduceMotion: prefersReducedMotion(),
}));
```

This only matters for the brief window before the existing hydration `useEffect`
(lines 63-70, unchanged) re-reads `localStorage` and overwrites `opts` if a stored
value exists — it prevents a flash of motion on first paint for OS-level
reduce-motion users who haven't set anything locally yet.

- [ ] **Step 4: Verify types and lint**

Run: `npx pnpm typecheck && npx pnpm lint`
Expected: both exit 0.

- [ ] **Step 5: Manual QA — OS preference with no stored value**

With `npx pnpm build && npx pnpm start` running: open DevTools → Command Menu
(Cmd/Ctrl+Shift+P) → "Show Rendering" → set "Emulate CSS media feature
prefers-reduced-motion" to "reduce". Open a fresh Incognito/Private window (so
`localStorage` is empty) to `http://localhost:3000/portfolios/gamer/pt-BR`.
Confirm entrance animations (card stagger-in, skill map) do not play, and that the
accessibility dropdown's "Redução de movimento" toggle shows as active.

- [ ] **Step 6: Manual QA — manual toggle still wins**

In the same window, click the "Redução de movimento" toggle to turn it off. Reload
the page. Confirm animations now play (the stored `reduceMotion: false` overrides
the OS preference, per Step 2's logic). Turn the OS-level emulation back to "No
preference" when done testing.

- [ ] **Step 7: Commit**

```bash
git add src/features/gamer/contexts/a11y-context.tsx
git commit -m "$(cat <<'EOF'
♿ fix(gamer): reduceMotion respeita prefers-reduced-motion do SO

Quando nada está salvo em localStorage, o valor inicial de
reduceMotion passa a vir de matchMedia('(prefers-reduced-motion:
reduce)') em vez de sempre false. Uma escolha manual do usuário
sempre tem prioridade sobre a preferência do SO.
EOF
)"
```

---

## Task 6: Remove no-op `aria-describedby={undefined}`

**Files:**
- Modify: `src/shared/components/dropdown-base.tsx`
- Modify: `src/shared/components/modal-base.tsx`

**Interfaces:** none.

- [ ] **Step 1: Remove the prop from `dropdown-base.tsx`**

Line 176 currently reads:

```tsx
            <Drawer.Content
              aria-describedby={undefined}
              style={noMotion ? { animationDuration: '0s', animationDelay: '0s', transitionDuration: '0s' } : undefined}
              className={`fixed bottom-0 left-0 right-0 flex flex-col max-h-[92dvh] outline-none ${drawerContentClassName ?? ''}`}
            >
```

Remove the `aria-describedby={undefined}` line entirely:

```tsx
            <Drawer.Content
              style={noMotion ? { animationDuration: '0s', animationDelay: '0s', transitionDuration: '0s' } : undefined}
              className={`fixed bottom-0 left-0 right-0 flex flex-col max-h-[92dvh] outline-none ${drawerContentClassName ?? ''}`}
            >
```

- [ ] **Step 2: Remove the prop from `modal-base.tsx`**

Line 117 currently reads:

```tsx
          <Drawer.Content
            aria-describedby={undefined}
            style={vaulNoMotionStyle}
            className={`fixed bottom-0 left-0 right-0 flex flex-col max-h-[92dvh] outline-none ${drawerContentClassName ?? ''}`}
          >
```

Remove the `aria-describedby={undefined}` line entirely:

```tsx
          <Drawer.Content
            style={vaulNoMotionStyle}
            className={`fixed bottom-0 left-0 right-0 flex flex-col max-h-[92dvh] outline-none ${drawerContentClassName ?? ''}`}
          >
```

- [ ] **Step 3: Verify types and lint**

Run: `npx pnpm typecheck && npx pnpm lint`
Expected: both exit 0. This is a pure deletion of a prop whose value was always
`undefined`, so React's rendered output is byte-identical before and after —
verification here is purely "nothing else broke."

- [ ] **Step 4: Manual QA**

With `npx pnpm build && npx pnpm start` running, open a narrow viewport (< the
project's mobile breakpoint) at `http://localhost:3000/portfolios/gamer/pt-BR`,
open the accessibility dropdown (mobile drawer variant) and any modal that uses
`modal-base.tsx` (e.g. click an experience card to open `ExperienceModal`). In
DevTools, inspect the drawer/modal content element and confirm no
`aria-describedby` attribute is present at all (not even an empty one).

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/dropdown-base.tsx src/shared/components/modal-base.tsx
git commit -m "$(cat <<'EOF'
🧹 fix(shared): remove aria-describedby={undefined} sem efeito

Placeholder que nunca teve um id real associado e que React já
omitia do DOM por ser undefined — removido para não sugerir uma
implementação incompleta.
EOF
)"
```

---

## Final Verification (after all 6 tasks)

- [ ] Run the full check suite once more end-to-end:

```bash
npx pnpm typecheck && npx pnpm lint && npx pnpm format:check && npx pnpm build
```

Expected: all four succeed with no errors.

- [ ] Re-read `docs/accessibility.md`'s "Lacunas / inconsistências observadas"
  section and confirm gaps #1, #5, #6, #7, #8 are now stale (i.e. no longer
  accurately describe the code) — this plan does not update that doc's prose;
  updating it is a follow-up, not part of this plan's scope.
