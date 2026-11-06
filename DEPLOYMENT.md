# Pebli Cloudflare deployment

## Confirmed scope — 2026-11-05

Deploy the approved Pebli homepage and studio as an independent Cloudflare Worker. Keep guest access, with no login. Reuse Rifflo's OpenRouter Qwen image and fal MiniMax music providers, with an independent API, secrets, private media and durable job records. Do not deploy or modify `rifflo-app`, its D1 database, media bucket or domain.

## Implementation plan

- [x] Verify Rifflo endpoints: both require login; music also requires owned commission state. Direct forwarding is not compatible with Pebli guest access.
- [x] Add isolated Worker static assets, durable job coordinator and private R2 bucket.
- [x] Add Nix song creation, playback/download and local save to the existing canvas.
- [x] Verify guest ownership, request deduplication, paid request uncertainty, quotas and provider failures.
- [ ] Configure independent server-side provider secrets without exposing them in source/build/browser.
- [ ] Deploy and smoke-test homepage, deep links, API boundaries, desktop/mobile and real generation.

## Runtime boundaries

The browser saves canvases and finished media in IndexedDB. A random HttpOnly, SameSite guest cookie owns server jobs. Clearing cookies loses access to unfinished server requests; exported/downloaded work remains local. The API requires same-origin JSON POSTs. A single Durable Object enforces persistent guest, network and global spending limits. Each new request is claimed before contacting providers; uncertain submissions are never retried automatically. Alarms process jobs independently of the browser connection. R2 is private and access is checked against the guest cookie. Server jobs and media expire after seven days; a small deduplication tombstone prevents replaying an expired paid request; this is not cloud backup. Homepage showcase content stays static and generates nothing.

Initial limits: 4 new requests per guest per hour, 6 per network per hour, 20 globally per hour, 60 globally per day; at most 12 songs per day globally. Limits are request caps, not a currency budget. No parent accounts, cloud canvas sync or video generation is added.

## Secrets

Configure `OPENROUTER_API_KEY` and `FAL_KEY` for **pebli-studio** in Cloudflare Workers → Settings → Variables and Secrets. Existing Rifflo secrets cannot be read back or automatically shared with another Worker. Never paste keys into chat, commit them, or put them in client variables. The API reports which services are configured and fails explicitly until they are present.

Deployment URL, version, validation and rollback will be recorded below after deployment.

## Deployment record

- URL: https://pebli-studio.judexuhs.workers.dev
- Account: a90d577d4d909f9dad58ace217bf44dc
- Worker: `pebli-studio`; R2: `pebli-private-media`; Durable Object: `PebliJobs`, migration `v1`.
- Current version: `ee23b295-1cc6-4266-b74c-b8f06121887c` (2026-11-05); direct canvas creation, collision-aware placement and removal of homepage signup promotional copy. Live HTML verified against `index-DGDeDTvj.js`. Previous version / rollback target: `e2412c15-d598-415b-9ed9-e71faaafad15`.
- First deployment version: `3535e8be-0c0d-4bb4-ac42-707fe0160640` (2026-11-05).
- No Rifflo resource was changed. New bucket is private; no custom domain was configured.
- 32 focused tests passed; Vite production build and Wrangler dry-run passed.
- Live `/`, `/studio`, `/studio/`, `/canvas-showcase`, crew asset: HTTP 200. Status JSON and secure HttpOnly guest cookie: correct. Missing guest: 401. Unknown owned job: 404. Missing provider secret: 503, no generation submission.
- Desktop 1440×1000 and mobile 390×844 checked. Hero text/colors match approved version; no hero audio controls or autoplay. New song instructions and instrumental choice survive reload.
- **Pending:** configure both provider Secrets and verify one real image, one reference edit, and one real song. Current status endpoint reports both providers unconfigured. Do not describe live generation as verified.

## Commands and recovery

Run from `experiments/crew-workbench`:

```sh
npm test
npm run cf:deploy
```

The deploy command builds only Pebli and uses its own Wrangler config. Credentials are configured through Cloudflare, never checked into this project. Do not run the parent Rifflo deploy command for this app.

For later releases, record the current version with `../../node_modules/.bin/wrangler deployments list` before deployment. Revert code/assets with `../../node_modules/.bin/wrangler rollback <known-good-version-id>` from this directory. Rollback does not undo Durable Object storage or R2 data. For the final patch, the immediately preceding version is `3535e8be-0c0d-4bb4-ac42-707fe0160640`. This is the first product release; no pre-Pebli version exists. To pause paid generation without deleting saved work, remove provider Secrets in Pebli settings; static pages and browser-saved canvases still work. Do not delete the bucket or Durable Object namespace as a rollback.

## Direct canvas release — 2026-11-05

Explicitly requested deployment completed to the existing Pebli Worker only.
38 tests, production build and Wrangler dry-run passed. Homepage hero signup
note removed, and the lower creation section now says only “No perfect idea
needed.” Guest access and the factual account FAQ are unchanged.

Live homepage, /studio, /studio/, /canvas-showcase and release JS returned 200;
unauthenticated job access returned 401. Live browser confirmed the promotional
copy is absent and a sample picture can branch into a scene task. Desktop/mobile
homepage layout and live 390×844 studio checked; no document overflow. Temporary
verification canvas removed; no paid generation requested. Status still reports
configured=false and musicConfigured=false; provider setup remains pending.
