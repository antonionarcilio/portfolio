---
name: amdev:i18n-new-feature
description: Walk through the full next-intl internationalization flow in this Next.js project whenever you create a new route, page, or component that renders any interface text (buttons, labels, tooltips, aria-label, title, alt, status messages). Use this skill before writing a Server or Client Component with user-facing text, before adding a new translation namespace, and whenever a string is about to be hardcoded instead of coming from src/messages/*.json. Catches the most common failure mode: mirroring a key in only one of the two locale files.
---

# i18n for New Features

Every interface string in this project must come from `src/messages/pt-BR.json`
/ `src/messages/en.json` via `next-intl` — never hardcoded in a component.
This is independent from CMS **content** i18n (`getPortfolio(locale)`
translates data like names and descriptions; `next-intl` translates the
interface around it).

The failure mode this skill exists to catch is quiet: a missing key only
breaks at runtime, and this project has no generated `messages.d.ts`, so
`npx pnpm typecheck` will not catch it. The only real check is a manual diff
between the two JSON files.

## Structural context — don't rebuild what already exists

- `src/i18n/routing.ts` — supported locales and `localePrefix`.
- `src/i18n/navigation.ts` — locale-aware `Link`/`useRouter`/`usePathname`/
  `getPathname`. Use these instead of `next/link`/`next/navigation` whenever a
  link needs to respect the current locale.
- `src/middleware.ts` — locale detection/redirect via `createMiddleware(routing)`.
- `src/messages/pt-BR.json` / `en.json` are split into one root key per
  layout/feature (`"gamified"`, `"minigame"`, …) — never a bare top-level
  namespace. A new layout gets its own root key; a new feature inside an
  existing layout gets a namespace nested under that layout's root key.

Never reimplement locale switching manually (`useParams` + a raw `<Link>`
building `/route/${locale}`) — the navigation helpers above already respect
`localePrefix` and the current locale.

## The flow, in order

1. **Route placement.** Create the route inside `src/app/[locale]/<route>/...`
   — every renderable route lives under that top-level segment (route
   handlers in `src/app/api/*` are the only exception, since they don't
   render HTML).

2. **Pick the translation hook by component type.**
   - Server Component → `getTranslations({ locale, namespace })` from
     `next-intl/server` (async).
   - Client Component (`'use client'`) → `useTranslations(namespace)` from
     `next-intl`.

3. **Add the namespace to both files, with identical keys.** Nest a new
   namespace (named after the feature/component) under the correct layout's
   root key in **both** `src/messages/pt-BR.json` and `src/messages/en.json`.
   Adding a key to only one file is the single most common mistake this
   skill exists to prevent — see the checklist at the end.

4. **Variable interpolation** uses ICU `{name}` in the string plus the second
   argument of `t('key', { name: value })`. Don't concatenate strings in
   code (`'Hello ' + name`) — that breaks word order for other locales and
   bypasses pluralization/formatting rules ICU gives you for free.

5. **Rich text** (bold, an inline link inside a translated sentence) uses
   `t.rich('key', { tag: (chunks) => <b>{chunks}</b> })`. Don't split the
   sentence into fixed text chunks with JSX stitched in the middle — word
   order differs across languages, so a chunk-based approach silently breaks
   translation in at least one locale. See `skillMap.partOfCore` in
   `map-portfolio.ts` / `skill-map.tsx` as a working reference.

6. **Option arrays** (dropdown values, an options swiper) are stored as a
   JSON array via `t.raw('key')`, never as a loose array of strings in the
   component. See `cvHeader.rankOptions` / `classeOptions`.

7. **State-dependent labels.** When a string depends on state (e.g. a label
   computed from a value), store a stable key (`labelKey`) in the
   data/state — translate only at render time in the component. Don't store
   the already-translated text; it can't follow a locale switch and
   duplicates translation logic away from the messages files. See
   `PortfolioData['stats']` (`labelKey: 'yearsExperience' | …`) +
   `stats.tsx`.

8. **Dates and numbers** use native `Intl.DateTimeFormat` / `Intl.NumberFormat`
   via `useLocale()` / `getLocale()` for the active locale, not a manual
   translation table (e.g. a month-name array) — the manual table is both
   more code and a second place i18n bugs can hide. See
   `format-experience-date-range.ts`.

## Rules that apply regardless of where you are in the flow

- **No hardcoded UI string, ever — not even as a fallback.** `label ?? 'Menu'`
  or a default parameter `title = 'Details'` are both hardcoded strings with
  extra steps. A shared component with no access to `useTranslations` should
  receive the string as a required prop, not fall back to a fixed
  Portuguese/English default.
- **Embedded sub-features don't get their own i18n system.** Something like
  the `src/features/minigame/snake/` easter egg uses
  `useTranslations('minigame.<name>')` like everything else — it renders
  inside the same `NextIntlClientProvider` tree, so there's no reason to
  thread a `locale` prop down manually or build a separate messages file. If
  a component receives every visible string as a `messages`-shaped prop
  object (e.g. `game-hud.tsx`), build that object by calling `t('key')` for
  each field inside the hook that owns it.
- **Never reintroduce a manual locale switcher.** Always use
  `Link`/`useRouter` from `src/i18n/navigation.ts`.

## Before considering the task done

`npx pnpm typecheck` passing is **not sufficient** — a missing or
mistranslated key is invisible to it. Run through this checklist:

- [ ] `npx pnpm typecheck` passes.
- [ ] Every key added to `pt-BR.json` has an exact counterpart (same path,
      same key name) in `en.json`, and vice versa. Diff the two files side by
      side — don't eyeball it from memory.
- [ ] No string in the new component is hardcoded, including fallbacks and
      default parameters.
- [ ] If the new namespace lives inside an existing layout, it's nested under
      that layout's root key — not added as a bare top-level key.
- [ ] Any new link uses `Link`/`useRouter` from `src/i18n/navigation.ts`, not
      `next/link` or a manually built `/route/${locale}` path.
