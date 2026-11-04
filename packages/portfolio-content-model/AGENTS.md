## Pacote `portfolio-content-model`

Contrato de dados do portfólio — fonte TS consumida via `transpilePackages` pelos 3 apps. Sem `react`, sem `server-only`, sem dependência de nenhum app.

## Exports

`PortfolioData`, `ProjectEntry`, `ExperienceEntry`, `Seniority`, `portfolioDataSchema` (Zod), `parsePortfolioData`, `SUPPORTED_LOCALES`, `SupportedLocale`, `DEFAULT_LOCALE`, `isSupportedLocale`, `parseLocation`, `parseEducationLocation`.

## Regras

- Qualquer campo novo em `PortfolioData` (`src/types/portfolio.ts`) deve ser espelhado em `src/schema.ts` (`portfolioDataSchema`) no mesmo commit.
- `parsePortfolioData` deve sempre reportar o campo ofensivo e a forma esperada no erro — nunca "validation failed" genérico.
- Nenhum import de `react`, `next`, ou qualquer app específico.

## Comandos

- `npx pnpm --filter portfolio-content-model exec tsc --noEmit`
