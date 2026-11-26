## App `pro`

Main portfolio published on the root domain (apex `antoniomascarenhas.com.br`): home, about, works (list +
per-project detail) and contact as a guided chat (`features/contact`: declarative flows in `flows/`, engine in
`engine/`, per-flow messages in `messages/contact-flows/`; the review step POSTs the raw answers + a Turnstile
token to `/api/contact`, which re-validates them against the flows — see "Contact submission" below — and sends
the e-mails via Resend), all fed by the CMS, with JSON-LD and OG. It also owns the 301
redirects for the old URLs of the previous single app (hub + `/portfolios/<layout>`).

## Commands

- `npx pnpm --filter pro dev` / `build` / `start` / `lint` / `typecheck`.
- `npx pnpm --filter pro update:disposable-domains [-- --force]` — refreshes the disposable e-mail snapshot (see below).

## Structure

```
src/
  env.ts, middleware.ts, i18n/{routing,navigation,request}.ts, lib/cms-client.ts
  lib/contact/              — form submission (Turnstile, rate limit, e-mail)
  lib/contact/email-reputation/ — disposable-domain snapshot + overrides, MX check (server-only)
  app/
    globals.css, robots.ts, sitemap.ts
    api/{revalidate,cms-debug,contact,contact/email-check}/route.ts
    [locale]/{layout.tsx,page.tsx,not-found.tsx}
    [locale]/{about,contact,works,works/[slug],[...slug]}/
  features/{header,footer,home,about,works,project-detail,contact}/  — UI per page/area
  shared/
    components/   — primitives (ScrambleText, Chip, fields, Accordion…; catalogue in DESIGN.md)
    variants/     — shared CVA (button-white, field-box)
    styles/       — tokens.css (@theme), base.css, interaction.css, a11y.css
    animations.ts — shared motion values (scramble, accordion, avatars, illustration, INTERFACE_EASING)
    a11y/, contexts/, hooks/, types/, utils/
messages/{pt-BR,en}.json  — root key "pro"
DESIGN.md                 — design system for agents (see "Design system" below)
next.config.ts            — holds the 301 redirects (see below)
```

## 301 redirects (`next.config.ts` → `redirects()`)

| Source                                  | Destination                                           |
| --------------------------------------- | ----------------------------------------------------- |
| `/portfolios/minimalist/:path*`         | `https://minimalist.antoniomascarenhas.com.br/:path*` |
| `/:locale/portfolios/minimalist/:path*` | same, preserving `:locale`                            |
| `/portfolios/gamified/:path*`           | `https://gamified.antoniomascarenhas.com.br/:path*`   |
| `/:locale/portfolios/gamified/:path*`   | same, preserving `:locale`                            |
| `/portfolios`                           | `/`                                                   |
| `/:locale/portfolios`                   | `/:locale`                                            |

Do not move this logic into middleware or a route handler — `redirects()` is declarative, runs before routing
and does not compete with the i18n middleware matcher.

## Contact submission (`/api/contact`)

- Body (`engine/contact-submission.ts`, strict): `locale`, `privacyAccepted: true`, `turnstileToken`, `answers`.
  Name, e-mail and flow are **never** sent ready-made: `engine/validate-contact-submission.ts` rebuilds the path
  with the same engine, rejects steps outside it, unknown options/fields, skipped required steps, and runs every
  field's own `validator`; only then derives name/e-mail/flow. New flows and fields are covered automatically.
- Order: same-origin check (`Origin` host = request host, 403) → 32 KB cap → schema + flow validation (400,
  reason logged without values) → rate limit (429) → Turnstile (403) → e-mail reputation (422) → Resend.
- The notification e-mail reuses the review summary (`build-summary.ts` + `createFlowTexts`), in the default locale.

## Contact e-mail reputation (BFF)

Disposable e-mails and domains that cannot receive mail are rejected **on the server**, never in the client
bundle (the list has ~10k domains):

- `POST /api/contact/email-check` — BFF the chat calls when a `fields` step has an `email` field (after the
  Zod format check). Same-origin only, strict body (`features/contact/email-check-contract.ts`), 1 KB cap, its own rate limit
  (`EMAIL_CHECK_POLICY`). Client is fail-open: network error/429/5xx lets the visitor continue.
- `/api/contact` runs the same check before sending (`email_disposable` / `email_undeliverable`, 422 — the review
  shows a specific message asking to edit the e-mail) — that is the real barrier.
- Source of truth is the **committed snapshot** `lib/contact/email-reputation/disposable-email-domains.json`,
  never the remote URL at runtime. `.github/workflows/update-disposable-email-domains.yml` runs the script
  (manual-only for now — the weekly `schedule` is commented out) and opens a PR with the diff for review
  (never pushes to `master`). `scripts/update-disposable-email-domains.mts` refreshes it from the public
  list (GitHub raw, then jsDelivr mirror) and refuses malformed lines, fewer than 1000 domains or a shrink
  above 20% (`--force` to accept). If every source dies, the current snapshot keeps working.
- Local fixes go in `email-domain-overrides.ts` (`EXTRA_BLOCKED_EMAIL_DOMAINS`, `ALLOWED_EMAIL_DOMAINS`;
  the allowlist wins) — never hand-edit the snapshot. Matching covers parent domains (`x.mailinator.com`).
- MX check (`node:dns`, 2s timeout): no MX and no A record → `undeliverable`; DNS failure → accepted.

## CMS data pipeline

Same as the other apps — `cmsClient.getPortfolio(locale)` via `src/lib/cms-client.ts`.

## Design system (`DESIGN.md`)

Before any visual or layout change, read **[`DESIGN.md`](./DESIGN.md)**: personality, the role of each colour,
type scale, spacing, breakpoints, radii, shadows, motion and the component catalogue (when to use each one).
Its values mirror `src/shared/styles/tokens.css` (Tailwind v4 `@theme`, available as classes **and** CSS custom
properties); **on conflict, the code wins** and `DESIGN.md` gets fixed. When you create or change a token or
shared component, update `DESIGN.md` in the same PR.

This section holds only the **code rules**; the why and the when live in `DESIGN.md`.

### Mandatory rules

Pick every value from the tokens listed in `DESIGN.md` (colour, type, spacing, breakpoint, width, radius,
shadow). The rules below are what review enforces:

- **Colours** — only token classes (`bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*`, `stroke-*`). Never hex,
  `rgb()`, `hsl()` or CSS colour names in `className` or inline styles. Neutrals use
  `alpha-black-*`/`alpha-white-*`; any `grey-*` needs an `html.a11y-high-contrast` override. Theme-following
  backgrounds use `bg-surface`. Every emphasis border (hover/focus, selected, outlines, unchecked rings) uses
  `border-stroke-strong` — never a darker `border-alpha-black-*`. Only exception: the selected (focused) text
  field box uses `border-stroke-focus` (`fieldBoxVariants`).
- **Typography** — `font-portfolio` / `font-portfolio-title` only, never literal font names. Sizes only from
  `text-xs`…`text-xl` and `text-display-*`, never Tailwind defaults (`text-base`, `text-2xl`) or `text-[Npx]`.
  Don't add `leading-*` except as a deliberate layout override. Weights `font-light`…`font-bold`, never
  `font-[N]` or `font-normal`.
- **Spacing** — named scale only (`gap-lg`), never Tailwind's numeric scale (`gap-4`). Off-grid values only
  inside a component's own anatomy. Section rhythm tokens: see `DESIGN.md` → Layout.
- **Breakpoints** — `small`/`tablet`/`desktop`/`wide` only, never `sm:`/`md:`/`lg:` or `min-[Npx]:`. Feature
  cuts become a named `@custom-variant` in the feature's `styles.css`; shared ones in `tokens.css`.
- **Widths** — `--container-*` tokens; a single-feature width stays local (`max-w-[932px]`) and becomes a
  token once it repeats.
- **Radii and shadows** — `rounded-*` and `shadow-sm|md|lg` tokens only; no `rounded-[Npx]` outside component
  internals, never `shadow-[...]`.
- **Plain CSS** — reference `var(--color-*)`, `var(--text-*)`, `var(--font-*)`; never duplicate numeric or hex
  values. Only exception: SVG data URIs (today the a11y cursor in `a11y.css`: `#ffcc00`, `#171615`).

### Forbidden anti-patterns

```tsx
// ❌ hardcoded colour
<div className="bg-[#000000]" />
<div style={{ color: '#171615' }} />

// ❌ literal font family
<p className="font-['Poppins']" />

// ❌ size outside the token scale
<h1 className="text-5xl" />
<p className="text-[18px]" />

// ❌ arbitrary numeric weight
<span className="font-[600]" />
```

```tsx
// ✅ correct
<div className="bg-alpha-black-5" />
<p className="text-alpha-black-70" />
<h1 className="text-display-lg font-portfolio-title" />
<p className="text-md font-regular font-portfolio" />
```

## Locale-switch effect (`ScrambleText`)

When the locale switches, every visible text on the page "decodes" (random characters resolving left to right,
~1s). This is the job of `src/shared/components/scramble-text.tsx` and applies to **any new text** you create in
this app.

### Mandatory rule

Every visible text rendered in a page, section or component **must** be inside `<ScrambleText>`, whether it
comes from `next-intl` (`t(...)`) or from the CMS (name, role, bio, experience etc.):

```tsx
// ✅ correct
<h1 className="text-display-lg"><ScrambleText>{t('heroHeading')}</ScrambleText></h1>
<p><ScrambleText>{bio}</ScrambleText></p>

// ❌ raw text — does not animate on locale switch
<h1 className="text-display-lg">{t('heroHeading')}</h1>
```

- `children` is **always a `string`**. For composed text, build the string first
  (``<ScrambleText>{`@ ${company}`}</ScrambleText>``); for separate paragraphs, one `ScrambleText` per paragraph.
- Put `ScrambleText` **inside** the element that carries the typography (`<p>`, `<h1>`, `<span>`…). It inherits
  font, colour and size; do not pass text styles to it.
- It renders `block` by default. In inline/flex layouts, let the parent dictate the layout; use `className` only
  for one-off adjustments.
- Components that receive text through a prop (`label`, `heading`, `body`…) must apply `ScrambleText` **inside
  themselves**, so the caller does not have to remember. `Chip`, `TriggerWithHelp`, `Anchor`,
  `ContactSection` and `StatItem` already do — do not wrap their `label` again.
- UI strings still come from `messages/*.json` (root i18n rule). Fixed Portuguese text inside the component
  neither translates **nor** animates: never hardcode.

### When NOT to use it

- Attributes (`aria-label`, `alt`, `title`, `placeholder`): they are not rendered text.
- Numbers and values that do not change with the locale (animated counter, year).
- Text with inner markup (links, `<strong>` mid-paragraph, `t.rich`): `ScrambleText` only accepts a string.
  Apply it per plain-text chunk or leave the block without the effect.

### How it works (do not reimplement)

- `src/shared/utils/locale-switch-state.ts` keeps the "switch in progress" flag as **module state**, on purpose:
  changing the `[locale]` segment remounts the whole tree, so any React context/state would be destroyed
  mid-switch. Only `features/header/use-locale-switch.ts` calls `beginLocaleSwitch()`.
- `ScrambleText` animates on **mount and** when `children` changes, only while the flag is active — loading or
  navigating normally does not trigger the effect.
- No layout shift: the real text stays in the flow (transparent during the effect) and reserves the box; the
  scrambled text is an `absolute`, `aria-hidden` overlay. Screen readers read the real text.
- The overlay **never** decides line breaks: random letters are wider than the real ones and, breaking on their
  own, created an extra line that leaked into the element below (e.g. the contact title overlapping the
  subtitle). That is why `measureLineBreakIndexes` (`shared/utils/measure-line-breaks.ts`) measures where the
  real text breaks, `insertLineBreaks` enforces those breaks and the overlay uses `whitespace-pre`. Do not remove
  any of the three. Accepted side effect: a scrambled line wider than the box overflows a few px horizontally
  instead of wrapping.
- The scramble's duration, FPS and easing live in `src/shared/animations.ts` — adjust them there.
  `prefers-reduced-motion` turns the effect off. For other motion, values start local and are promoted when they
  repeat (feature `animations.ts` → `shared/animations.ts`, or an `@utility` in `shared/styles/interaction.css`
  for CSS transitions); see `DESIGN.md` → Motion. `INTERFACE_EASING` and `transition-interface` share the same
  `cubic-bezier(0.2, 0.7, 0.2, 1)` curve: when you change one, change the other.
- The locale selector's `router.push` uses `scroll: false` to keep the reading position. Keep it when touching
  the selector.

## Rules for this app

- There is no hub anymore (`/portfolios`) — this app replaces that route. Never reintroduce layout-selection
  logic.
- `not-found.tsx` must always exist and respond with a real 404 (not a server error) for any old URL without a
  known redirect pattern.
