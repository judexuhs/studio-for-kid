# Canvas usability and creation surfaces — 2026-11-06

Confirmed scope: keep direct manipulation (no planning/chat Agent), implement the
five reviewed usability recommendations, and redesign the existing start panel
and cards within Pebli's current warm, colorful identity. Homepage unchanged.

- [x] Add ideas/characters inside the current canvas; new canvas stays in library.
- [x] Completed tasks collapse to a process record, with editing/history retained.
- [x] Separate Edit, Grow and Combine intents, including click/drag equivalents.
- [x] Nearby branch placement and explicit arrangement of a connected group.
- [x] Thumbnail-based selection with an explicit four-picture limit.
- [x] Illustrated starting choices and clear, editable child-authored input.
- [x] Compact, readable tasks with concrete headings and visible field boundaries.
- [x] Focused failing tests, implementation, production build, desktop/mobile checks.

No deployment in this iteration. Real provider availability is a separate runtime
configuration issue; previews and verification must not imply real generation.

Validation: 43 focused tests passed; production build passed. Real desktop and
390×844 mobile UI checked; same-canvas creation, preserved custom text, explicit
new canvas, Pip completion/collapse/reopen, Grow/Combine separation and connected
group arrangement verified. No paid generation used. Evidence is in evidence/
creation-*-20261106.png. Existing local server reused.

## Unified workbench — approved 2026-11-06

- [x] One labeled toolbox; desktop supports dragging tools onto canvas.
- [x] New creation units show output in place with immutable selectable versions.
- [x] Edit stays in the unit; Grow creates a branch. Legacy boards remain readable.
- [x] Branch choices open near the source/drop location; mobile uses bottom sheet.
- [x] Automatic reveal pans only when necessary and preserves zoom.
- [x] Model regression tests and real desktop/mobile interaction verification.

Keep homepage and deployed version unchanged until a separate deployment request.

Validation: 46 tests and production build passed. Real desktop and 390×844 mobile
checked: Pip generated two immutable versions in one visible unit, selection
survived save/reload, Edit retained the unit, Grow referenced the selected version,
and toolbox click/native drag added collision-aware cards without changing zoom.
Mobile toolbox, version controls and branch bottom sheet visually checked.
No paid provider calls or deployment. Existing dev server reused.

## Creative worlds and explanatory pages — approved 2026-11-06

User requested all seven discussed improvements, every partner available without
progress locks, real abilities for homepage-only partners, and explanatory inner
pages. Keep the homepage composition, direct canvas manipulation, private/local
defaults and explicit generation. No deployment, public community, accounts,
cloud sync, learning scores, planning Agent or model-generated video.

Implementation / acceptance:
- [x] World name, fictional setting and explicitly selected main character;
      opt-in reuse with visible references and frozen generation context.
- [x] Editable interest-based starters and twists; preserve child-authored input.
- [x] Separate change / preserve instructions; visual versions and comparison.
- [x] Select and order up to five works, cover and optional music; local world
      presentation and self-contained HTML export, no autoplay.
- [x] All four partners immediately available. Tavi stories/next scenes/comic
      outlines through OpenRouter; Nix on local and Worker API; Pip existing
      Float/Hop/Dance with a picture dependency, never a progress gate.
- [x] Focused work view on desktop/mobile; shared version/edit/handoff actions.
- [x] Optional factual creative journey derived from immutable results, no scores.
- [x] /how-it-works, /crew, /ideas, /for-parents, /help and explicit not-found page.
      Homepage navigation/footer connect them; public pages never open storage
      or submit generation. Current art, Gabarito and homepage visual language.
- [x] Focused failing tests, implementation, existing suite/build, one batched
      desktop/mobile check and bounded fixes; document runtime limitations.

Surface direction: operate in the warm colorful studio, experience in a quiet
full-screen world presentation, read/explore on public inner pages. Show actual
works before explanatory UI; inner pages use the existing homepage typography,
crew images, fine dividers and open spacing. One persistent plan is this file.


Validation completed locally: 59 tests and Vite production build passed.
Wrangler dry-run bundled successfully with exit 0; its log-path write was
blocked by the sandbox, without affecting the bundle. No deployment occurred.
Real Tavi text, Moss reference editing and Nix music succeeded on the local
service; the 130-second MP3 played after an explicit click. Pip versions,
selected main character/world, three-work ordering, cover/music/journey choices
and reload restoration passed. The downloaded world HTML opened locally with
all three images decoded, embedded media only, no scripts and audio paused.

Desktop 1440px and mobile 390px evidence is in evidence/worlds-20261106/.
Final public-page captures confirm the two mobile spacing fixes and all lazy
images loaded after scrolling; no horizontal overflow or public API calls.
Help search, mobile navigation and the not-found route passed. Read-only review
verdict: ship within the confirmed scope. Full details are in REHEARSAL.md.

The dedicated QA canvas and browser workspace were removed; command sessions
completed. The existing local server was reused and left running. Paid-request
deduplication/recovery records and verification exports remain intact.
Provider availability, model-dependent character consistency and browser-local
storage remain limitations. This local development version is not deployed;
there is no new account system, cloud sync or public sharing.

### Subsequent authorized release — 2026-11-06

The user subsequently requested Cloudflare deployment and GitHub synchronization.
The accepted source is on `judexuhs/studio-for-kid` main, and the existing
`pebli-studio` Worker now serves version `d06b77c7-036c-475b-9c58-85915aa76cd2`.
Production routes, API access boundaries, desktop/mobile UI and an actual Pip
Float creation passed. Server-side provider secrets are still absent, so live
image/story/music generation remains unavailable; local provider success does
not establish production availability. See DEPLOYMENT.md for the release and
verified rollback target. Earlier no-deployment statements describe the original
implementation phase before this later authorization.

## First creation, marked edits and drawing board — approved 2026-11-06

The user selected recommendations 1 and 2, and clarified that drawing is a tool
for the existing four partners, not a fifth partner. Preserve the current brand,
free canvas, explicit generation, private local storage and immutable results.

- [x] Three approachable starts: character, drawing, own idea; preserve typed
      words when switching, keep existing inspiration, focus newly prepared tasks.
- [x] A small set of specific continuations from the selected picture version;
      returning canvases keep their view and no entry/continuation auto-generates.
- [x] Mark an image area with pointer or keyboard-accessible area choices;
      separate requested changes and preserved details, retain original versions.
      The mark guides the provider; it is not a guarantee of pixel-exact inpainting.
- [x] A real drawing tool with colors, brush size, eraser, undo/redo, safe clear,
      empty prevention, drawing descriptions, reopening and partner handoffs.
      Tavi/Nix use the child's written description, not image understanding.
- [x] Freeze/validate marked edits and drawing provenance through save/reload and
      provider requests. Keep local/Worker behavior aligned and requests explicit.
- [x] Focused failing tests, implementation, tests/build, one batched desktop and
      mobile browser pass, bounded fixes, documentation and process cleanup.

This feature iteration is local development. The previous release remains online
until this new version is explicitly requested for deployment.

Implementation and local verification complete: 70 tests, Vite build, Worker dry-run,
desktop/mobile UI, touch drawing, local Pip and restored editable strokes. Focused
keyboard deletion and asynchronous drawing-export races were reproduced and fixed.
A browser-local stub verified the marked request without external transmission.
The user subsequently approved one real Moss request. It returned a colored turtle
shell, preserved the white background/blue outline and omitted the red guide.
The original and kept result survived reload. Position, size and aspect ratio
changed: this is guidance, not pixel-exact inpainting. See REHEARSAL.md for evidence.

Cleanup complete: both QA canvases removed, browser workspace finished, verification
processes exited; existing dev server and prior paid-request records retained.

## Product simplification — approved 2026-11-06

Preserve all four partners, drawing, free canvas, immutable versions, offline
exports and editable backups. Keep the landing composition and five public pages.
No deployment, provider configuration, account, unlock, or automatic generation
on entry, selection or restore. One editing agent; two read-only explorations.

- [x] One result action hierarchy: edit, continue, download; favorite is not save.
- [x] One explicit generation click for authored first ideas and marked edits;
      use the latest board snapshot and retain independent original versions.
- [x] One main-character identity, legacy compatibility and separate card formats.
- [x] Current versions first in every material picker; exact older IDs accessible.
- [x] Direct Pip movement controls, secondary lyrics and relevant continuations.
- [x] Preview selected work first; optional presentation configuration and journey
      restricted to selected work and its related edits, never all board results.
- [x] Secondary canvas management; focused editing remains the normal path.
- [x] Ideas focuses on starters; help and public instructions match the UI.
- [x] Focused regression tests, build, batched desktop/mobile check, documentation
      and cleanup. No paid provider test in this iteration.


Validation completed: 82 tests and final Vite build passed. Desktop/mobile,
exactly-one mocked request per explicit create/edit, current/older selections,
local Pip Dance, character identity, drawing-to-Tavi description handoff, Nix
advanced controls, public help, private preview and actual offline HTML checked.
Final model-only check also preserves explicit main-character selection when
making a card. QA canvas removed; Ego space 11 finished; no new server processes,
provider calls, production changes or GitHub synchronization. See REHEARSAL.md.


### Subsequent authorized drawing/simplification release — 2026-11-07

The user explicitly requested GitHub and Cloudflare publication. Runtime source
`c3d5a7d` is on `judexuhs/studio-for-kid` main; the existing Worker is now version
`f3cb113c-f9eb-460c-8dd8-b22a131dea51`. All 82 tests, build, Worker dry-run and
production route/API checks passed. Live desktop/mobile drawing → Pip Hop →
private presentation → reload completed with no paid provider request. Test canvas
removed; browser space finished. Provider status remains unconfigured. Earlier
no-deployment notes refer to the implementation phase before this authorization.
See DEPLOYMENT.md for exact assets and the verified rollback target.


### Canvas-first editing — 2026-11-10 (local, not deployed)

User confirmed replacing standalone creation/input surfaces with direct canvas
editing. Single-agent implementation; no main Rifflo application changes.

- [x] Blank persisted draft card, optional starting ideas, draw/upload shortcuts.
- [x] Remove start-page component and automatic full-screen task detail view.
- [x] Task preparation, progress, results and revisions remain in canvas units.
- [x] Inline drawing with pointer handling, undo/redo, explicit exit and local Pip.
- [x] Keep compare and final presentation/export surfaces.
- [x] Two new reducer tests first failed, then passed; 84 application tests pass.
- [x] Final Vite build; desktop and 390px mobile UI checks. Browser-only mocks
      confirmed one request per image create/revise and one visible unit with
      both versions. Desktop strokes/mobile dot input and real local Pip passed;
      saved drawing and animation restored after reload.

Ego space 5 finished. Reused pre-existing server on port 4175; no server started
or terminated. No provider requests, deployment or GitHub synchronization.
The independent experiment directory was already untracked in this checkout;
existing unrelated main-app modifications were preserved. Impeccable's nine
advisories match incumbent tokens and its stale sidecar; no tooling migration.

### Authorized publication — 2026-11-10

Current canvas-first implementation published as runtime commit `d5c8e55` and
Worker version `ccad9763-a00f-4289-aafd-4f34a90f660d`. The release copy passed 84
tests, build and Worker preflight. Live route/assets/API boundary checks and
real desktop/mobile drawing → Pip Hop → reload passed. Providers remain
unconfigured; no paid call or new product change was included. QA canvas removed,
browser space finished. See DEPLOYMENT.md for exact rollback and release evidence.
