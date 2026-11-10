# Pebli Cloudflare deployment

## Canvas-first release — 2026-11-10 (Asia/Shanghai)

- User explicitly authorized GitHub sync and Cloudflare publication of the current
  implementation. Subsequent UX suggestions are not included.
- Runtime commit: `d5c8e55233721eac6b218e950fa81aab31e8583a` on
  `judexuhs/studio-for-kid` main. Normal fast-forward Git push; no force update.
- Worker: `pebli-studio`; URL: https://pebli-studio.judexuhs.workers.dev/studio .
  Version: `ccad9763-a00f-4289-aafd-4f34a90f660d`.
- Verified prior version / rollback target:
  `f3cb113c-f9eb-460c-8dd8-b22a131dea51`. From the Pebli package run
  `npx wrangler rollback f3cb113c-f9eb-460c-8dd8-b22a131dea51` if required.
  Rollback restores code/assets, not stored data. No bindings, secrets or storage
  migrations changed; Rifflo was not deployed.
- Independent release checkout: pinned npm install, **84 tests**, Vite build and
  Wrangler dry-run passed. Assets: `index-HBIgDqSp.js`, `index-DUfmRIiK.css`.
- HTTP checks: nine public page paths and both release assets returned 200;
  all pages referenced the expected bundle. API status was no-store with secure
  HttpOnly guest cookie. Missing owner 401, missing owned job 404, foreign origin 403.
- Browser checks: desktop 1440×1000 inline start, actual drawing → Pip Hop,
  saved-result restoration after reload, and 390×844 canvas overview with no
  horizontal document overflow. Creation stayed on the canvas with no work dialog.
- Providers remain unconfigured (`configured`, `textConfigured`,
  `musicConfigured` all false). No paid model call was made. Local drawing,
  motion and device save work; this release does not enable live AI generation.
- Only `Release QA inline 20261110` was deleted and its removal checked.
  Ego task space 6 finished. No server was started or stopped; build/deploy
  processes exited. Canonical development files and release records are synced.

## Drawing and simplification release — 2026-11-07 (Asia/Shanghai)

- Authorized by the user's explicit request to publish to GitHub and Cloudflare.
- Runtime source: `c3d5a7dcfe83bf47767ef0ea1fb226a6237321d6` on `judexuhs/studio-for-kid` main. Includes the drawing/marked-edit iteration and the subsequent simplification together. The GitHub connector's write endpoint returned integration permission error 403; the existing authenticated Git transport completed a normal fast-forward push, without force.
- Deployed URL: https://pebli-studio.judexuhs.workers.dev/ ; Worker version **`f3cb113c-f9eb-460c-8dd8-b22a131dea51`**. Existing `pebli-studio` bindings and storage were preserved. No Rifflo resource or provider secret was changed.
- Known-good rollback: `d06b77c7-036c-475b-9c58-85915aa76cd2`, verified from the deployment list before publishing. From this package, run `npx wrangler rollback d06b77c7-036c-475b-9c58-85915aa76cd2` if needed; rollback restores code/assets, not stored data.
- Independent release copy passed **82 tests**, Vite build and Wrangler deploy dry-run. Deployed assets: `index-Do9gS-P_.js` and `index-CKZztQye.css`.
- HTTP smoke: homepage, both studio slash forms, all five inner pages and canvas showcase returned 200 and the new bundle paths; JS/CSS returned 200. Status is no-store with Secure/HttpOnly/SameSite guest cookie; missing guest returned 401, missing owned job 404 and cross-origin request 403.
- Real Ego browser: desktop 1440×1000 and mobile 390×844 homepage/studio checked. Drew a blue shape, handed it to Pip, applied Hop, opened a one-work private presentation, and restored the drawing/movement after reload. All five public page headings, no horizontal overflow and updated saving help passed. No paid generation was submitted.
- **AI generation is still unconfigured:** production status reports `configured=false`, `textConfigured=false`, `musicConfigured=false`. Deployment does not supply provider keys. Drawing, Pip, local save and presentation work; live Moss/Tavi/Nix generation still requires independent Worker secrets and a subsequent explicit live test.
- Only the new `Release QA drawing 20261107` canvas was removed and its absence checked. Prior browser work and paid-request records were untouched. Ego task space 13 finished with no retained tabs. No new dev server was started; test/build/deploy commands exited normally.
- Local evidence: `evidence/release-20261106-simplification/` (named when this release began before midnight); includes HTTP results and desktop/mobile captures. No screenshots, local work, credentials, runtime job data or builds were pushed to GitHub.

## Creative worlds release and source sync — 2026-11-06

- The approved creative-worlds release was synchronized to `main` at https://github.com/judexuhs/studio-for-kid. Initial source commit: `50937bb7b8cac6ccd038a441f11ef206389e98e1`.
- The repository is independently installable with Node.js 22+, `npm ci`, and its own pinned Wrangler dependency. Source, public assets and font licenses are included; local canvases, job records, credentials, builds and historical design archives are excluded. The canonical development files remain in the original Pebli directory.
- A clean independent installation passed all 59 tests, the Vite production build and Wrangler dry-run. Release assets: `index-D7BCS9QH.js` and `index-WX-eIhUL.css`.
- **Deployed:** https://pebli-studio.judexuhs.workers.dev/ ; version `d06b77c7-036c-475b-9c58-85915aa76cd2`. The expired CLI session was renewed through Cloudflare's official OAuth flow. Only the existing `pebli-studio` Worker was updated; no Rifflo resources, bindings or storage migrations changed.
- **Verified rollback target:** `ee23b295-1cc6-4266-b74c-b8f06121887c`, read from the deployment list immediately before this release. Use `npx wrangler rollback ee23b295-1cc6-4266-b74c-b8f06121887c` if needed; this restores code/assets, not stored data.
- Live homepage, studio (both slash forms), all five explanatory pages, canvas showcase, release JS/CSS and crew asset returned HTTP 200 with the expected release bundle. API checks passed: secure HttpOnly/SameSite guest cookie, no-store status, 401 without a guest, 404 for a nonexistent owned job and 403 for a cross-origin request.
- Real Chrome checks passed on the deployed site: desktop 1440px and mobile 390px homepage, the five distinct inner-page headings, mobile menu, studio entry and all four enabled partner tools. The Pip sample task completed a playable Float result without unlocking or provider credentials. No paid generation was submitted. The alternate Ego browser could not navigate to the Workers domain, so online UI acceptance used Chrome.
- **AI generation remains unconfigured:** the Worker secret-name list is empty and status reports `configured=false`, `textConfigured=false`, `musicConfigured=false`. All three generation routes explicitly return 503; no paid request was submitted. Configure `OPENROUTER_API_KEY` (images and stories) and `FAL_KEY` (music) directly in Pebli Worker secrets before validating live generation; do not send credentials through chat or source control.
- The original local development server was left running. Installation, test, build, dry-run and Git commands completed without leaving background processes.

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

Run from the Pebli package directory (the standalone repository root, or `experiments/crew-workbench` in the original development workspace):

```sh
npm test
npm run cf:deploy
```

The deploy command builds only Pebli and uses its own Wrangler config. Credentials are configured through Cloudflare, never checked into this project. Do not run the parent Rifflo deploy command for this app.

For later releases, record the current version with `npx wrangler deployments list` before deployment. Revert code/assets with `npx wrangler rollback <known-good-version-id>` from this directory. Rollback does not undo Durable Object storage or R2 data. For the final patch, the immediately preceding version is `3535e8be-0c0d-4bb4-ac42-707fe0160640`. This is the first product release; no pre-Pebli version exists. To pause paid generation without deleting saved work, remove provider Secrets in Pebli settings; static pages and browser-saved canvases still work. Do not delete the bucket or Durable Object namespace as a rollback.

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
