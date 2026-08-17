# Kanban MVP

Single-board Kanban app built with Next.js in [frontend](frontend).

## Plan

1. Scaffold the app and baseline tooling.
Success criteria: Next.js app exists in frontend, git ignores generated files, lint/build scripts work.

2. Implement the Kanban board.
Success criteria: one board with 5 renameable columns, dummy data, card add/delete, drag and drop between columns, client-rendered UI.

3. Add automated tests.
Success criteria: unit tests cover state transitions, Playwright covers core user flow, both run from npm scripts.

4. Verify and run.
Success criteria: lint, unit tests, e2e tests, and production build pass; dev server starts successfully.

## Run

```bash
cd frontend
npm install
npm run dev
```

## Test

```bash
cd frontend
npm run lint
npm run test
npm run test:e2e
```