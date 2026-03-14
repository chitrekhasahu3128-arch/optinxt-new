# Optinext Monorepo

This repository contains multiple related projects under one workspace.

## Projects

- `ai-workforce` – Employee + manager dashboard (frontend + backend).
- `ai-workforce-employee-portal` – Another React/Express app.
- `optinxt-1` – A React + Vite project.
- `PeopleStat-1 (1)/PeopleStat-1` – A project with separate frontend/backend folders.

## Getting started

### 1) Install dependencies

From the repository root:

```sh
npm run install:all
```

### 2) Run projects

Run a single project:

```sh
npm run dev:ai-workforce
npm run dev:employee-portal
npm run dev:optinxt
npm run dev:peoplestat
```

Run all dev servers at once (requires `concurrently`):

```sh
npm run dev:all
```

### 3) Build

```sh
npm run build:all
```

## Notes

- Each project still has its own `package.json` and can be run independently.
- The workspace setup makes installing dependencies across all projects easier.
