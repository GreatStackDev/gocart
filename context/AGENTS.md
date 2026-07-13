# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Application Building Context

Read the following files in order before implementing or making any architectural decision for tradrsAvenue:

1. `context/project-overview.md` — product definition, goals, features, and marketplace scope
2. `context/architecture-context.md` — system structure, boundaries, RBAC middlewares, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography, storefront/dashboard layouts, and component conventions
4. `context/code-standards.md` — implementation rules, state management (Redux), and conventions
5. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress-tracker.md` after each meaningful implementation change.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.