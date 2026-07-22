# tradrsAvenue Workspace Rules

## 🎨 UI Development Standards

All UI component work in this project MUST adhere to the following rules:

### Mandatory: Astryx + StyleX

1. **Component First** — Always check the Astryx MCP server for an existing component before building a new one.
2. **No Raw HTML for UI** — Do NOT use `<div>`, `<button>`, `<input>`, `<a>` etc. when an Astryx equivalent (`<Box>`, `<Button>`, `<TextInput>`, `<Link>`) exists.
3. **No Generic CSS** — Do NOT write raw CSS classes or inline `style={{...}}` objects. All styling MUST use `stylex.create(...)` with Astryx token variables.
4. **No Tailwind for New Components** — Existing Tailwind utilities may remain during migration, but all **new** UI code must use StyleX + Astryx tokens exclusively.
5. **Token Usage** — All colors, spacing, radii, and typography values MUST reference the CSS custom properties defined in `app/astryx-tokens.css` (e.g., `var(--color-primary)`, `var(--space-4)`).

### Astryx MCP Workflow

Before implementing any new UI feature or component:
1. Query the Astryx MCP server: `astryx component list`
2. If a suitable component exists, use it.
3. If not, compose from Astryx primitives and document the new component.

### Naming Conventions

- Component files: `PascalCase.jsx` or `PascalCase.tsx`
- StyleX style objects: `const styles = stylex.create({ ... })`
- Token imports: `import * as tokens from '@/app/astryx-tokens.css'`

---

## 🏪 Brand

- Project name: **tradrsAvenue** (capital A, no spaces)
- npm package name: `tradrsavenue`
- Domain: `tradrsavenue.co.za`
- Locale: `en_ZA`

---

## 📁 Directory Conventions

| Path | Purpose |
|---|---|
| `app/` | Next.js App Router pages and layouts |
| `components/` | Reusable UI components (must use Astryx) |
| `components/ui/` | Low-level UI primitives |
| `lib/` | Utilities, hooks, Prisma client |
| `app/astryx-tokens.css` | Single source of truth for all design tokens |
| `astryx.config.js` | Astryx design system configuration |
| `stylex.config.js` | StyleX compiler configuration |
| `babel.config.js` | StyleX Babel plugin registration |
