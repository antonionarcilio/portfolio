## Context

See proposal.md - Why. Current implementation state relevant to this change:

- `.minimalist-recruiter__more` (`src/features/minimalist/styles.css`) currently reuses ad-hoc values (14px, underline, uppercase) never checked against the Figma `button/collapse` component.
- `.minimalist-link` / `linkVariants` (`variants.ts`) currently hardcodes `font-size: 14px` and a fixed underline offset, never checked against the Figma `anchor` component; the trailing `↗` icon is a literal `<span>` with a leading space, not measured spacing.
- `.minimalist-recruiter__portrait` corner brackets are `16px` pseudo-elements offset `-8px` — a value chosen by eye in the prior round, not measured.
- `.minimalist-recruiter__about-copy h1` is `28px`/700 weight, `.minimalist-recruiter__about-location`/`.about-copy .flex` (bio) are `14px` — also chosen by eye.

The prior change (`minimalist-header-content-parity`) fixed the About section's *structure* (kicker, name+role line, location line, link separators) but did not measure exact typography/geometry against Figma — this change closes that gap for the 4 specific component/node references the user provided.

## Goals / Non-Goals

**Goals:**
- Replace eyeballed font-size/weight/color/spacing values in the 4 affected areas with values measured directly from the cited Figma nodes.
- Keep the existing component boundaries (`MinimalistLink`, `.minimalist-recruiter__more`, `.minimalist-recruiter__portrait`) — this is a styling correction, not a restructuring.

**Non-Goals:**
- No new component abstractions or shared variant files beyond what already exists in `variants.ts`.
- No change to the About section's structural layout (already fixed in the prior change) beyond what the measured values require.
- No implementation of the button/collapse's actual expand interaction (still out of scope, same as the prior change).

## Decisions

**1. Inspect each of the 4 Figma nodes directly (Dev Mode panel where available) rather than re-deriving values from the already-implemented CSS.**
The user's complaint is specifically that prior values were approximated, not measured — re-reading the same CSS wouldn't fix that. Each node will be opened and its typography panel (font size, weight, line-height, letter-spacing) and fill/color read directly, the same method that found concrete bugs (wrong divider color/shape) in the prior change.

**2. Keep `.minimalist-link`/`.minimalist-recruiter__more` as plain CSS rules (no new CVA variant axis) unless the Figma inspection reveals a state (hover/focus/disabled) not already representable by the existing `state` variant on `linkVariants`/`paginationVariants`-style props.**
Avoids speculative abstraction (ponytail: YAGNI) — only add a new variant dimension if inspection proves the existing one insufficient.

## Risks / Trade-offs

- [Figma inspection is manual/visual (Dev Mode panel or measured swatches), not a machine-readable design-token export] → Mitigation: cross-check every value with the Dev Mode inspect panel when available (as used successfully for the divider component in the prior change) and confirm with a rendered comparison screenshot afterward.
- [Changing shared classes (`.minimalist-link`, `.minimalist-kicker`) could affect other call sites beyond the About section] → Mitigation: grep every usage of the touched class before editing and visually check each affected screen (About, Experience, Projects, Education) after the change, not just the About section.

## Migration Plan

No data migration; pure CSS/markup correction. Deploy is a normal merge; rollback is a normal revert.
