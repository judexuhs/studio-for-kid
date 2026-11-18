# Pebli

## Project boundary

- Canonical directory: `/Users/judexu/Desktop/我做的项目/Pebli`.
- This is the independent Pebli creativity canvas for children ages 10–12.
- Rifflo is a separate project in `../children learn AI`. Do not develop Pebli there or copy its product rules into this project.
- Read README.md, PRODUCT.md, DESIGN.md, WORKSPACE.md and relevant deployment/verification records before changes. Dated release records are historical evidence, not proof of current online behavior.
- Stack: React, Vite, JavaScript, local Node API, Cloudflare Worker, Durable Objects and private R2. This is not the Rifflo Next.js application.

## Work safely

- Preserve existing local changes, historical design archives, artwork provenance and licenses.
- Do not read, print, copy or commit credentials, `.env*`, `.dev.vars*` or private user/job data.
- Preserve `.pebli-data/`: it contains request deduplication and recovery records. Do not delete it to clear caches.
- Keep provider calls on the server. Preserve private defaults, child agency, explicit generation actions, original versions, local saves, accessibility and reduced motion.
- Audit/review is read-only unless fixes are requested. Do not broaden product scope.
- Use focused failing tests first for behavior changes when practical. Visual changes require real desktop/mobile checks.
- Default to one agent. Use at most two subagents only for independent parallel tasks; one code-editing agent per phase.
- Inspect existing processes before starting servers; use non-watch tests and stop every process you start.
- Do not deploy unless explicitly asked. `wrangler.jsonc` targets the existing production Pebli Worker.

## Commands

- `npm ci` — install locked dependencies (Node.js 22+).
- `npm run dev` — local app at http://127.0.0.1:4175.
- `npm test` — source, server and Cloudflare tests, non-watch.
- `npm run build` — Vite production build.
- `npm run preview` — serve the build with the local API.
- `npm run cf:preview` — local Worker preview on port 4176.
- `npm run cf:deploy` — production deployment; requires explicit authorization.

There is no separate typecheck or lint command. Do not run Rifflo commands here.
