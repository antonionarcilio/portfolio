## 1. Data and route composition

- [x] 1.1 Pass the localized `PortfolioData` from the minimalist page into the recruiter composition.
- [x] 1.2 Define the ordered recruiter section model and localized section labels.
- [x] 1.3 Replace the temporary showcase route with the recruiter section shell.

## 2. Recruiter sections

- [x] 2.1 Implement the introduction and profile sections from CMS profile and biography fields.
- [x] 2.2 Implement experience, projects, and skills sections from localized CMS collections.
- [x] 2.3 Implement education, achievements, and contact sections with optional-field filtering.

## 3. Full-screen navigation

- [x] 3.1 Add viewport-sized section layout and scroll snapping in minimalist feature CSS.
- [x] 3.2 Add active-section observation, previous/next controls, and direct section selection.
- [x] 3.3 Add keyboard focus management, ARIA current state, and reduced-motion-safe behavior.

## 4. Localization and isolation

- [x] 4.1 Add matching recruiter interface messages to `src/messages/en.json` and `src/messages/pt-BR.json`.
- [x] 4.2 Confirm the recruiter route imports only minimalist/shared contracts and leaves gamified files unchanged.
- [x] 4.3 Add localized metadata and empty states without hardcoded UI strings.

## 5. Visual validation

- [x] 5.1 Validate the styled components against the captured Figma reference in light and dark appearance.
- [x] 5.2 Use Chrome DevTools MCP to inspect desktop and narrow viewport screenshots, computed styles, scroll behavior, and focus states.
- [x] 5.3 Verify no horizontal overflow, broken links, fabricated content, console errors, or unexpected network calls.

## 6. Quality checks

- [x] 6.1 Run `npx pnpm format:check`, `npx pnpm lint`, and `npx pnpm typecheck`.
- [x] 6.2 Run `npx pnpm build` and verify both minimalist locales plus the gamified route.
- [x] 6.3 Run `openspec validate --changes "minimalist-recruiter-screens" --strict` and `git diff --check`.
