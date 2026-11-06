# Assets and provenance

## Moon fox

`public/assets/moon-fox.png` generated with the built-in image_gen tool on 2026-11-04; transparent original copied into this standalone project. No external generation API or project credentials used.

Prompt:
> Use case: illustration-story. Create a polished original full-body orange fox astronaut character cutout for a premium creative app for children ages 10–12. Warm terracotta orange fox, large elegant pointed ears, cream muzzle and enormous fluffy cream-tipped tail, small confident black eyes, wearing a cream padded spacesuit with forest green details and a glass bubble helmet, holding a tiny yellow pennant. Standing three-quarter view, feet fully visible, charming editorial 3D clay and paper-crafted storybook style, tactile matte surfaces, beautiful soft studio lighting, sophisticated not babyish. Centered single character, all edges fully inside frame with 12 percent padding. Truly transparent background. No text, no lettering, no interface, no logo, no shadow ground.

The browser composes this cutout over simple procedural scene geometry; colour variations use CSS filters and affect the whole cutout, not only fur. Motion is a CSS transform, not generated video.

## Existing Rifflo art

- `moss.webp`: copied from `../../public/assets/maker-premium/pet-curious.webp`; original project provenance remains in the sibling `.webp.json` there.
- `pip.webp`: copied from `../../public/assets/home/otti-rabbit-guide.webp`; original project provenance remains in the sibling `.webp.json` there.
- Experimental names do not rename characters in the parent product.

## Fonts and components

Gabarito and Nunito Sans weights 400/500/600/700/800 downloaded from Google Fonts and stored as `font-0.ttf` through `font-9.ttf`. Mapping in src/fonts.css. SIL Open Font License copies: Gabarito-OFL.txt, NunitoSans-OFL.txt. No runtime external font requests.

Lucide icons: existing project icon family, ISC license supplied by package. Stageshow kit: MIT, copied license in `.vendor/STAGESHOW-LICENSE`. Original skill from https://github.com/benjitaylor/skills, installed using `npx skills add benjitaylor/skills --skill stageshow --agent codex -y` inside this folder.

## Pebli redesign

2026-11-04: existing artwork is reused unchanged. Pebli uses the platform system font, not the archived Gabarito/Nunito font files. The three-lobe brand mark is CSS geometry. Interface icons remain Lucide. No new raster illustrations were produced in this redesign. Runtime static art is referenced by symbolic ID in saved data and embedded only once in standalone code.

## Colorful creative toys update

The current Pebli toy theme reuses local Gabarito weights 400/600/700 (`font-0.ttf`, `font-2.ttf`, `font-3.ttf`) under the existing font license. Existing artwork remains unchanged. No LEGO or Nintendo logos, characters or other proprietary art are used; they are user-specified visual references only.

## Live image capability

OpenRouter official Images API verified on 2026-11-04:
- https://openrouter.ai/docs/client-sdks/typescript/sdks/images/README.md
- https://openrouter.ai/api/v1/images/models/qwen/qwen-image-3/endpoints

The live acceptance run used qwen/qwen-image-3. Initial creative brief: “A tiny fox astronaut with a mint spacesuit and a flag, exploring a lavender moon.” Task: “Make this character. Give it a personality of its own.” Revision: “Keep the same fox face, orange fur and spacesuit. Change only the little flag to bright blue with a yellow star.” These are generated test creations, not pre-existing product illustrations. The actual images appear in comparison screenshots and the exported Nova character card. No additional marketing art was generated.

## Creation playground — 2026-11-05

首页沿用 Moss、Pip 和 moon-fox，另将主项目已有 character-atlas 图片原样复制到 `public/assets/starters/`：

| 本地文件 | 原始项目路径 |
|---|---|
| cloud-baker.png | public/assets/home/character-atlas/tavi-turtle.png |
| reef-inventor.png | public/assets/home/character-atlas/ami-axolotl.png |
| night-guide.png | public/assets/home/character-atlas/luma-moth.png |

每张图片的 `.png.json` 记录复用来源；原始生成提示不可得。未修改原图或新生成素材。灵感架明确标为 Pebli 提供，不宣称儿童或社区作品；预览动作由 CSS 实现。

## 2026-11-05 · 四人创作小队
- `public/assets/crew-lineup.png`：本轮 imagegen 生成的透明四角色横向素材，Moss／Tavi／Nix／Pip；CSS 按四等分展示，不用于 studio 的既有角色头像。
- 原始输出：`/Users/judexu/.codex/generated_images/01a1a542-101d-7a41-9647-c9b377d299a1/exec-5db6d718-6b30-4d69-8a34-dcc19ed7b0e0.png`。
- 完整 prompt 嵌入 PNG，另存 `.impeccable/mocks/decision/crew-asset-prompt.txt`。透明背景，原创角色，不代表外部品牌或真实用户作品。

## Editorial story artwork · 2026-11-05
`public/assets/nova-world.png`: imagegen-authored scene of Nova meeting a celestial whale, generated for the product showcase and local revision preview. Exact prompt embedded in PNG and `.impeccable/mocks/decision/nova-world-prompt.txt`; original `/Users/judexu/.codex/generated_images/01a1a542-101d-7a41-9647-c9b377d299a1/exec-f9397dd6-5032-4813-9e91-710517e3c756.png`. No real child authorship implied.

## Expanded portfolio · 2026-11-05
Three original imagegen artworks in public/assets/gallery/: treehouse.png (gouache floating library), comic.png (three-panel cat/strawberry comic), pixel.png (robot and snail pixel scene). Full exact prompts and source paths are stored in adjacent .png.json files and embedded in PNG. These are portfolio examples, not attributed to real children. Existing Nova motion remains CSS, not generated video.

## Outcome-led portfolio refresh · 2026-11-05
New imagegen artworks: gallery/jelly.png (orange jelly character), ocean.png (paper-cut underwater city), poster.png (STAY CURIOUS graphic poster), stickers.png (six frog skateboard stickers). Exact prompts embedded and adjacent JSON sidecars retain original source paths. These replace the old moon-fox/cloud-baker/night-guide/reef-inventor gallery slots; original assets are preserved for studio and archived designs. Jelly playback remains CSS motion, not AI video. Hero crew assets unchanged.


## Nova 的统一太空故事 · 2026-11-05
- `public/assets/nova-song-world.png`：内置 image_gen 生成，沿用 `moon-fox.png` 的角色与 `nova-world.png` 的世界参考；保留原素材。完整提示词与参考记录见同名 `.png.json`，提示词已嵌入 PNG。
- `public/assets/nova-star-song.wav`：原创 8 秒五声音阶铃音与柔和底音，以 Python 标准库合成；不是供应商模型输出。可从实验根目录运行 `python3 scripts/make-star-song.py` 复现，出处见同名 `.wav.json`。`src/nova-waveform.json` 从真实采样的 40 个 RMS 窗口导出。
- Tavi 的文字是为这一主题策划的故事片段。所有新增内容只用于公开首页示例，不读取儿童作品。
