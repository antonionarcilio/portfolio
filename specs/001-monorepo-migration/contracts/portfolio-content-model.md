# Contract: `portfolio-content-model`

Pacote de biblioteca TypeScript (sem `react`, sem `server-only`), consumido como fonte via `transpilePackages` pelos 3 apps.

## Exports (barrel único, `./src/index.ts`)

| Export | Tipo | Descrição |
|---|---|---|
| `PortfolioData` | type | Contrato de dados do portfólio — forma completa consumida pelos 3 apps. |
| `ProjectEntry` | type | Um projeto do portfólio. |
| `ExperienceEntry` | type | Uma experiência profissional. |
| `Seniority` | type | Enum/union de senioridade. |
| `portfolioDataSchema` | `z.ZodType<PortfolioData>` | Schema Zod espelhando `PortfolioData` campo a campo. |
| `parsePortfolioData(data: unknown)` | function → `PortfolioData` | Valida e retorna o dado tipado; lança erro com o valor recebido e a forma esperada em caso de falha. |
| `SUPPORTED_LOCALES` | `readonly SupportedLocale[]` | `['pt-BR', 'en']`. |
| `SupportedLocale` | type | União dos locales suportados. |
| `DEFAULT_LOCALE` | `SupportedLocale` | Locale padrão. |
| `isSupportedLocale(value: string)` | type guard → `value is SupportedLocale` | Usado por middleware e rota de debug de cada app. |
| `parseLocation(raw: string)` | function → `ParsedLocation` | Função pura, sem efeitos colaterais. |
| `parseEducationLocation(raw: string)` | function → `ParsedEducationLocation` | Função pura. |

## Garantias do contrato

- **Nenhuma dependência de `react` ou `next`** — `package.json` não declara essas dependências (verificável: `cat packages/portfolio-content-model/package.json` não deve listar `react`/`next`).
- **Sem `server-only`** — este pacote pode ser importado por Client Components se necessário (diferente de `portfolio-cms-client`).
- **Funções puras** — `parseLocation`/`parseEducationLocation`/`parsePortfolioData` não têm efeitos colaterais; mesma entrada sempre produz mesma saída.
- **Erro de validação testável**: dado um objeto que não satisfaz `portfolioDataSchema`, `parsePortfolioData` lança um erro cuja mensagem cita o campo ofensivo e a forma esperada (não apenas "validation failed").

## Verificação do contrato

```bash
npx pnpm --filter portfolio-content-model exec tsc --noEmit
```

Teste manual mínimo: importar `parsePortfolioData` com um objeto inválido (ex.: faltando `name`) e confirmar que o erro lançado menciona o campo `name` e o tipo esperado.
