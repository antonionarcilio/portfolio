# Portfolio

A modern, professional web portfolio application.  
Built with Next.js 15 (App Router) and React 19, this project showcases your skills, experience, and background interactively for recruiters, clients, or collaborators.

---

## 🚀 Features

- Home page teaser (customizable)
- Interactive portfolio/vitae display
- Detailed professional/academic sections (skills, stack, timeline, contact info)
- Fully responsive, animated UI
- Custom API endpoint for portfolio data (`/api/portfolio`)
- Strong standards: TypeScript, lint, hooks, project code style enforcement

---

## 🛠️ Technologies

- **Next.js** 15 (App Router, API routes, layouts)
- **React** 19 (with both server/client components)
- **TypeScript** (strict, strong typing everywhere)
- **CSS Modules** & optional **Tailwind CSS**
- **pnpm** (workspaces-ready)
- **Prettier**, **ESLint**, **Husky** (pre-commit, lint-staged)

---

## 📁 Project Structure

```
src/app/
  (homepage)/page.tsx      # Main homepage
  portfolios/gamified/
    page.tsx
  api/portfolio/
    route.ts
  globals.css
  layout.tsx
  not-found.tsx
next.config.ts
tsconfig.json
package.json
...
```

_All user/project files use kebab-case. Classic exceptions (`index.ts`, CSS modules) allowed._

---

## 🌐 Application Routes

| Path                | Purpose                                |
|---------------------|----------------------------------------|
| `/`                 | Homepage (teaser/landing)              |
| `/portfolios/gamified` | Interactive portfolio/CV               |
| `/api/portfolio`    | API endpoint exposing portfolio data   |
| (404 fallback)      | Custom not-found page                  |

---

## ⚡ Getting Started

### Prerequisites

- Node.js **v24.x** (match `.nvmrc`)
- **pnpm** v10 or newer ([pnpm docs](https://pnpm.io/installation))

### 1. Clone and Install

```bash
git clone <repo-url>
cd portfolio
pnpm install
```

### 2. (Optional) Setup Environment Variables

If integrating with DatoCMS or other APIs, copy `.env.example` to `.env` and fill your tokens/secrets.

### 3. Start in Development

```bash
pnpm dev
# Open http://localhost:3000
```

### 4. Prepare Husky hooks (recommended)

```bash
pnpm prepare
```

*(This enables lint, typecheck, and format on pre-commit.)*

---

## 💻 Main Commands

| Script              | What it does                      |
|---------------------|-----------------------------------|
| `dev`               | Launch dev server (hot reload)    |
| `build`             | Build prod version                |
| `start`             | Run production server (after build)|
| `lint`              | Run all ESLint checks             |
| `format`            | Format all code with Prettier     |
| `format:check`      | Check formatting (no write)       |
| `typecheck`         | TypeScript type-check             |
| `prepare`           | Set up husky hooks                |

---

## 📐 Conventions & Contribution

- **File/dir naming:** kebab-case only
- **No `any`/untyped code:** Explicit types everywhere
- **Prettier/ESLint/Husky:** Formatting and linting enforced on commit
- **SRP/Small files:** One responsibility per file, keep functions 4–20 lines
- **Use `@/`** for root imports (where available)
- **All PRs and commits must pass `lint`, `format`, and `typecheck`**

---

## 📄 License

Private

---

**Start by exploring `/src/app/portfolios` for main modules. Strictly follow the code style and contribution guidelines above!**
