---
name: setup-pre-commit
description: Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests. Use when user wants to add pre-commit hooks, set up automated code quality checks, or configure Husky.
---

# Setup Pre-Commit Hooks

Configure automated code quality checks before commits using Husky, lint-staged, and Prettier.

## Components

- **Husky** — manages git hooks
- **lint-staged** — runs Prettier on staged files only
- **TypeCheck + tests** — run during pre-commit phase

## Installation

### 1. Detect package manager

Check for lockfiles:
- `package-lock.json` → npm
- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- `bun.lockb` → bun
- Default → npm

### 2. Install dependencies

```bash
# pnpm
pnpm add -D husky lint-staged prettier

# npm
npm install -D husky lint-staged prettier

# yarn
yarn add -D husky lint-staged prettier

# bun
bun add -D husky lint-staged prettier
```

### 3. Initialize Husky

```bash
npx husky init
```

This scaffolds `.husky/` and adds a `prepare` script to `package.json`.

### 4. Configure `.husky/pre-commit`

```sh
#!/bin/sh
<pm> lint-staged
<pm> run typecheck
<pm> run test
```

(Replace `<pm>` with your detected package manager command.)

### 5. Configure `.lintstagedrc`

```json
{
  "*": ["prettier --write --ignore-unknown"]
}
```

### 6. Configure `.prettierrc` (if no existing config)

Only create if no existing Prettier config is detected:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80
}
```

## Verification

Test the setup manually before committing:

```bash
npx lint-staged
```
