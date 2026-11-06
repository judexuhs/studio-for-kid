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
