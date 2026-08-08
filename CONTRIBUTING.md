# Contributing

## Local setup

Requires Node.js 20 (see `.nvmrc`).

```bash
git clone https://github.com/Overby-Industries/free-preflight-app.git
cd free-preflight-app
npm install
npm run dev
```

## Code style

The project uses ESLint (`.eslintrc.json`, extends `next/core-web-vitals`) and Prettier (`.prettierrc`). Before opening a PR:

```bash
npm run lint
npm run build
```

Both should pass cleanly.

## Branching

- `main` tracks the stable, deployed state of the app.
- `dev` is where active development happens.
- Branch off `dev` for new work, and open pull requests back into `dev`. `main` is updated by fast-forwarding from `dev` once it's in a known-good state.

## Pull requests

Keep PRs focused on a single change. Describe what changed and why, and call out anything that needs manual testing (this project doesn't have an automated test suite yet).
