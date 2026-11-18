# Hero lettering exploration

Status: rejected by the user as visually disconnected from the rest of the page (2026-11-05). Preserve as exploration; do not apply to the homepage.

`/hero-options?v=paper|handwritten|overprint` compares the three static wordmarks in the same Landing component. `/` retains its existing lettering. Query selection affects only the comparison route and is not persisted in user storage.

- Paper: Lilita One outlines with slight rotations and restrained paper-edge treatment.
- Handwritten: Pacifico, shaped with HarfBuzz, three broad color regions.
- Overprint: existing Gabarito ExtraBold with intersecting spot-color shapes.

Font sources and SIL OFL license files are in this directory. Derived SVGs and provenance are in `public/assets/hero-type/`. Reproduce with `scripts/make-hero-wordmarks.py` (Python fonttools and uharfbuzz required; runtime app has no new dependency).

Build passed; all three comparison controls and query updates worked. Desktop 1440×1100 and mobile 390×1000 screenshots were inspected in `.impeccable/review/type-option-{1,2,3}-{desktop,mobile}.png`. Mobile had no document overflow. These are exploration checks, not a design acceptance. No backend changes or deployment.
