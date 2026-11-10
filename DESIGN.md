## Canvas editing update — 2026-11-10 (released)

Creation is an Operate surface. Keep Gabarito, the cream dotted canvas, crew colors
and existing 320px work cards. Replace the start-page layer with one editable
card. Instructions, progress, results and compact marked revisions occupy that
card. Drawing is a 680px canvas surface (320px on mobile), with internal scrolling,
not a modal or full-screen page. Keep visible focus, keyboard region selection,
reduced motion, draft text, old versions and explicit unsaved drawing exit.
The change reuses existing colors, 13–25px type and 16px radii. The detector's nine
advisories concern the existing sidecar/token mismatch, not a new visual system.

---
name: Pebli
description: 清爽软件首页连接彩色创作画布，孩子安排伙伴把想法变成作品。
colors:
  showcase-nix-body: "#eee7fa"
  showcase-nix-head: "#d9c6f4"
  showcase-tavi-body: "#fff7eb"
  showcase-tavi-head: "#f8d7ac"
  entry-poster: "#a44b70"
  entry-stickers: "#8d6a18"
  entry-motion: "#426eaa"
  entry-world: "#53743e"
  entry-comic: "#a15a31"
  symbol-character-light: "#ddd0f6"
  symbol-character-ink: "#7754b0"
  symbol-comic-light: "#ffdab9"
  symbol-comic-ink: "#ba713f"
  symbol-world-light: "#cde4a9"
  symbol-world-ink: "#5c853a"
  symbol-motion-light: "#c8dffa"
  symbol-motion-ink: "#4c7abd"
  symbol-stickers-light: "#ffe69a"
  symbol-stickers-ink: "#a47a1b"
  symbol-poster-light: "#f7cbdc"
  symbol-poster-ink: "#b95c84"
  gallery-control: "#ffffff"
  gallery-control-ink: "#675778"
  gallery-control-hover: "#f5f1fa"
  gallery-scroll-thumb: "#c9bfdc"
  gallery-scroll-track: "#f4f1f8"
  landing-project-action: "#7553b8"
  landing-accent: "#6655d5"
  landing-surface: "#ffffff"
  landing-canvas: "#f8f9fc"
  landing-ink: "#222633"
  landing-muted: "#626977"
  landing-line: "#e8eaf0"
  landing-moss: "#ecf3e7"
  landing-tavi: "#fff1e0"
  landing-nix: "#f0edfb"
  landing-pip: "#eaf3fc"
  landing-moss-ink: "#42623b"
  landing-tavi-ink: "#805222"
  landing-nix-ink: "#64519b"
  landing-pip-ink: "#3f6385"
  primary: "#287c50"
  primary-hover: "#226d46"
  pip-primary: "#436ddd"
  canvas: "#fcfaf4"
  surface: "#fffefb"
  ink: "#25344b"
  muted: "#59657a"
  idea: "#ffdf62"
  idea-ink: "#4c3e20"
  moss-head: "#b5e78c"
  moss-body: "#e5f4d9"
  moss-field: "#f8fff0"
  pip-head: "#96c6fa"
  pip-body: "#e4f0ff"
  material: "#fa8c7b"
  result: "#b7a6ed"
  focus: "#426de0"
  selected: "#7198da"
  line: "#a8baac"
  entry-surface: "#fffdf5"
  entry-placeholder: "#6c7665"
  finish-bg: "#f8f3ff"
  finish-frame: "#b6a1e8"
  finish-action: "#7453b4"
  compare-before: "#e6eefb"
  compare-after: "#e9e0fa"
  error-bg: "#fff0e5"
  error-ink: "#8a402e"
  material-preview: "#f7ffee"
typography:
  landing-display:
    fontFamily: "Gabarito, -apple-system, sans-serif"
    fontSize: "68px"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-.035em"
  landing-purpose:
    fontSize: "25px"
    fontWeight: 400
    letterSpacing: "-.02em"
  landing-heading:
    fontSize: "34px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-.025em"
  entry-title:
    fontFamily: "Gabarito, -apple-system, sans-serif"
    fontSize: "35px"
    fontWeight: 600
    lineHeight: 1.12
  finish-title:
    fontSize: "43px"
    fontWeight: 600
    lineHeight: 1.12
  idea:
    fontFamily: "Gabarito, -apple-system, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-.025em"
  instruction:
    fontFamily: "Gabarito, -apple-system, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.35
  partner:
    fontFamily: "Gabarito, -apple-system, sans-serif"
    fontSize: "23px"
    fontWeight: 650
  button:
    fontSize: "15px"
    fontWeight: 600
  label:
    fontSize: "12px"
rounded:
  field: "12px"
  button: "14px"
  card: "26px"
  image: "17px"
  dock: "25px"
  entry: "25px"
  drawer: "23px"
  compare: "24px"
  finish: "35px"
spacing:
  small: "8px"
  medium: "12px"
  large: "20px"
components:
  button-project:
    backgroundColor: "{colors.landing-project-action}"
    textColor: "#ffffff"
    height: "48px"
    width: "224px"
    rounded: "10px"
    padding: "13px 18px"
  button-landing:
    backgroundColor: "{colors.landing-accent}"
    textColor: "#ffffff"
    rounded: "10px"
    padding: "14px 21px"
  button-download:
    backgroundColor: "{colors.finish-action}"
    height: "52px"
    rounded: "{rounded.button}"
  material-preview:
    backgroundColor: "{colors.material-preview}"
    rounded: "13px"
    padding: "11px"
  surface-entry:
    backgroundColor: "{colors.entry-surface}"
    rounded: "{rounded.entry}"
    width: "500px"
  surface-drawer:
    rounded: "{rounded.drawer}"
    width: "370px"
  alert-save:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error-ink}"
    rounded: "10px"
    padding: "14px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    height: "48px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-pip:
    backgroundColor: "{colors.pip-primary}"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    height: "48px"
  button-tool:
    rounded: "13px"
    size: "44px"
  input-material:
    backgroundColor: "{colors.moss-field}"
    textColor: "#405539"
    rounded: "{rounded.field}"
    height: "42px"
  card-moss:
    backgroundColor: "{colors.moss-body}"
    rounded: "{rounded.card}"
    width: "320px"
  card-pip:
    backgroundColor: "{colors.pip-body}"
    rounded: "{rounded.card}"
    width: "320px"
  chip-kept:
    backgroundColor: "#fff9e5"
    textColor: "#5c4c1c"
    rounded: "15px"
    padding: "7px 10px"
---

# Design System: Pebli

## Overview

### 当前扩展 — 2026-11-06（本地开发版，未部署）

沿用“清爽软件首页，彩色创作画布”的既有方向，没有重做首页视觉。四位伙伴全部进入 studio 工具箱：Moss 绿色、Tavi 杏色、Nix 淡紫、Pip 浅蓝；移除进度解锁呈现。作品在同一创作单元内显示，缩略图版本条与共享详情让结果比操作更突出。My world 是设定／主角侧栏；Show my world 是安静的全屏作品选择与展示页面。新解释内页复用本地 Gabarito、原有图片、伙伴形象、细分隔线和首页操作颜色。以下较早的锁定、侧栏位置和页面描述保留为演进记录；冲突时以本节、当前组件和样式为准。

当前实现依据 `src/TaskCard.jsx`、`src/WorldViews.jsx`、`src/world.css`、`src/PublicPages.jsx`、`src/public-pages.css`，并沿用 `src/workbench.css`。桌面 1440px、手机 390px 的实景证据位于 `evidence/worlds-20261106/`。能力和部署边界记录在 PRODUCT.md；本节仅记录现有设计扩展，不增加新的视觉方向。

**Creative North Star: "清爽软件首页，彩色创作画布"**

首页 `/` 采用用户确认的清爽创作软件方向：白色与冷白、紫色操作、细线分隔、克制圆角与轻阴影。当前首屏以创作结果为先：标题 From “what if…” / to “look what I made.”，副标题 An AI creation studio for kids.，说明 Turn their ideas into characters, stories, sounds, and little worlds—with a creative crew to help.；主 CTA 旁显示 No sign-up needed.。四位伙伴各自搭配具体图片、故事、声音或动作小样，动作标题突出，with Moss / Tavi / Nix / Pip 次要。旧点击肖像展开角色介绍已被替换；本次未加入统一提示词节点。下方直接嵌入真实 App 的只读聚焦画布：同一个 Nova 与歌唱太空鲸鱼的冒险，由 Moss 图片、Tavi 故事、Nix 声音和 Pip 动作共同展开，复用 studio 的对象与连接；八件不同画风的作品、六个带彩色按钮的具体项目承接探索，之后是合并的简短家长说明与 FAQ。借鉴 Nooodle 的产品展示顺序，不借用其视觉风格。旧故事书与直接交接示意已被这一结构取代。此前双伙伴交接 hero 已被否定，不再作为首页方向。用户已否定首页三版卡通重的 A/B/C 方案；此前首页玩具风格约定被此规范取代。

`/studio` 延续彩色创作玩具：饱满的彩色卡片、暖白画布、短厚底边与按压反馈。这个范围内保留原 LEGO × Nintendo 的明亮触感方向，使用 Pebli 自己的形象。除明确标记为首页的 token 和段落外，以下原有规范均适用于 studio，不把首页风格反向套入画布。

首页依据 `src/Landing.jsx`、`src/CrewPreview.jsx`、`src/crew-preview.css`、`src/landing.css`、`src/ProductShowcase.jsx`、`src/ProjectSymbol.jsx`、`src/product-showcase.css`、`src/universe-showcase.css`、`src/main.jsx`、`src/App.jsx`、`src/showcase-board.js`、`src/creation-exhibition.css`、`src/creation-content.js`、最后导入并覆盖首页展示样式的 `src/home-refresh.css`、保留的 `src/product-story.css` 与 `.impeccable/surfaces/src-landing-jsx.md`；最新截图为 `.impeccable/review/refine-universe-desktop.png`、`refine-universe-mobile.png`、`refine-universe-lower-mobile.png`、`refine-family-desktop.png`、`refine-family-mobile.png`、`refine-exhibition-desktop.png`、`refine-exhibition-mobile.png`、`refine-entries-desktop.png`、`refine-entries-mobile.png`；想法与角色最新局部截图为 `.impeccable/review/idea-pop-desktop.png`、`idea-pop-mobile.png`；当前真实画布截图为 `.impeccable/review/compact-crew-desktop.png`、`compact-crew-mobile.png`、`compact-crew-mobile-right.png`、`strong-cta-desktop.png`、`strong-cta-mobile.png`；首屏最新截图为 `.impeccable/review/hero-outcomes-desktop.png`、`hero-outcomes-mobile.png`、`hero-outcomes-mobile-crew.png`（此前首屏构图记录为历史）。studio 依据 `src/toy.css`、`src/studio.css`、`src/entry.css` 与基础 `src/app.css`；其入口、抽屉、比较、完成和错误截图仍为 `.impeccable/review/` 下对应记录。`DIRECTION.md` 的玩具约定仅适用于 studio，旧首页 playground 截图和 archive 外观不再约束当前首页。

**Key Characteristics:**
- 首页白色／冷白外框、紫色操作与四个大幅毛绒动物肖像；只读展示复用真实 studio 画布。
- 首页用四人阵容、真实只读画布、多样作品与六个具体项目表达产品；每个项目直接给出动作入口。
- studio 保留黄色想法、绿色 Moss、蓝色 Pip、珊瑚材料、紫色成果与触感底边。
- 共用本地 Gabarito、现有素材与自由创作入口。

## Colors

首页使用 `landing-*` token：紫色操作、白色底、炭黑标题。伙伴背景依次为鼠尾草绿 Moss `#ecf3e7`、杏色 Tavi `#fff1e0`、薰衣草 Nix `#f0edfb`、天蓝 Pip `#eaf3fc`；对应正文为 `#42623b`、`#805222`、`#64519b`、`#3f6385`。柔和底色用于肖像衬底，深色用于角色和短介绍。六项目图形使用 `symbol-*-light` 与 `symbol-*-ink` 配对，只填充图形本身；作品轨道控件与滚动条使用 `gallery-*`。以下角色色用于 studio。

颜色说明对象和伙伴的角色，而不是随意装饰。黄色便签承载想法；Moss 使用浅绿卡身和亮绿头部，Pip 使用浅蓝卡身和亮蓝头部。图片材料放进珊瑚色相框，成果放进紫色相框。两者的角色不能混用。

深绿色和蓝色按钮分别启动 Moss 与 Pip 的任务。暖白点阵背景让这些彩色块保持清楚，深色正文提供阅读对比。选择轮廓采用蓝色虚线，键盘焦点采用独立蓝色实线；颜色以 frontmatter 为准。

## Typography

首页主标题桌面 68px／1.04、-.035em；≤800px 52px，≤650px 40px／1.08。产品副标题 25px、≤800px 23px、≤650px 21px；说明 17px／1.55，手机 15px／1.6。伙伴动作标题桌面 21px、≤1050px 18px，名字 14px、手机 13px。首页宇宙展示与作品标题 48px／1.08，宇宙展示≤760px 为 36px，作品≤500px 为 34px；六项目标题 40px／1.15，无强制换行，≥1100px 保持单行；≤1100px 为 36px，≤650px 为 32px 并自然换行。合并家长区标题 32px／1.15，≤760px 为 28px，≤500px 为 26px；FAQ 问题为 16px，≤650px 为 15px。首页正文 400，重点多为 500，保留本地 Gabarito。画布正文继续使用下述字级。

当前字体为本地 Gabarito，提供 400、600、700 字重，回退到系统无衬线。不要换回仅系统字体的上一版。伙伴名继承基础样式的 650 声明，浏览器从现有字体字重匹配。

想法为 28px、600 字重，任务正文为 20px、1.35 行高；任务伙伴名为 23px，动作按钮为 15px，标签为 12–13px。品牌桌面 34px、手机 29px；项目名桌面 16px、手机 13px。说明文字要简短，不用新增二级标签解释已清楚的卡片结构。

## Layout

当前扩展中，作品详情使用独立滚动页面，正文容器最大宽 760px；图像保持完整可见，文字作品自然排版，复用画布的版本／编辑／交接操作。世界展示编辑器最大宽 1240px，桌面左侧选作品、右侧设置顺序／封面／配乐，手机顺序纵排；预览让封面、故事和图片先于创作过程。内页正文最大宽 1240px，桌面双列图文与细线分隔，700px 以下转为单列阅读，导航收为明确的菜单按钮。公共页面正常纵向滚动，不沿用画布固定视口约束。

`/` 正常纵向滚动。首屏最大 1240px，文案最大 900px，说明最大 600px。四伙伴结果阵容最大 1120px，桌面四列、间隔 34px，651–1050px 间隔 18px；≤650px 最大 440px、两列两行、间隔 30px 20px。桌面肖像 144×192px 搭配 140×164px 小样；手机肖像 84×112px、小样 116×144px，故事稍高。肖像与结果相邻呈现，不再作为角色选择按钮。手机主 CTA 与免注册文案纵排。下方 showcase 最大 1280px，桌面内距 75px 40px；≤1000px 为 60px 28px，≤650px 为 45px 22px。桌面章节标题和说明左右排列，手机纵排。真实画布展示最大 1440px，内距 40px 40px 32px（≤760px 为 42px 20px）。iframe 内部固定 1440×720，按容器宽／1440 缩放，最小 .56；窄屏保留横向滚动，默认 scrollLeft 为 `580 × scale − 16`，聚焦主世界及延展作品，外部左右按钮每次移动 80% 可见宽度。画廊最大 1280px，八件作品单行横向滚动，图片等高 280px，≤760px 为 220px，≤500px 为 210px；宽度按原图比例计算，不裁切。间距 24px，≤760px 为 18px。前后按钮整合在标题说明旁，桌面 40px、≤760px 为 36px。六项目采用两列，≤580px 单列；白色平面条目以顶部分隔线区分，左侧彩色图形，右侧标题、正文及实色动作按钮；没有独立大 CTA 横幅。家长说明与五条原生 FAQ 合并为最大 1200px 的双列区，左列 340px、间距 100px；≤1100px 左列 280px／间距 48px，≤760px 纵排。家长区取消乌龟装饰，两侧文字顶部对齐。末尾直接进入 footer，没有重复收尾 CTA。首页没有最近项目或作品存储访问。

画布应用占满 `100dvh`，画布页面本身不滚动；入口与作品抽屉在各自区域滚动，比较与完成页允许正常纵向滚动。桌面顶部高 88px，手机高 76px。画布保留 DOM 卡片、世界坐标位移缩放、SVG 自动曲线；点阵基准间距 24px。普通卡宽 320px，想法宽 280px。布局仍是自由摆放，不是固定步骤。

桌面工具栏在左，伙伴栏在底部中央，缩放栏在右下。≤1100px 时隐藏伙伴栏引导字和底部帮助句，缩放栏上移，伙伴栏底距 24px。基础样式的 ≤1000px 规则仍控制部分顶栏、帮助按钮和侧栏位置；不要把旧断点全部删除。

≤600px 时顶部横向卡片导航负责定位，工具栏变为底部横排并隐藏撤销、重做按钮，伙伴栏宽度为屏宽减 28px。缩放栏底距 182px，工具栏底距 119px，伙伴栏底距 23px。手机任务头部最小高 84px、头像 58px，正文最小高由 studio 层覆盖为 90px（桌面 105px），压缩留白而不缩小正文字号。侧栏覆盖画布，两侧各留 14px。

手机聚焦卡片时缩放为 90%，320px 卡实际约 288px。Show everything 用于看全局，缩放范围 35%–150%。卡内控件会一起缩放，CSS 尺寸不能直接当作屏幕触摸尺寸。独立保存按钮在手机隐藏；New idea 与 My canvases 在手机顶栏仍可用，头像隐藏。

进入 `/studio` 即进入画布：恢复最近作品，无作品时为空画布。CanvasStart 是中央非模态面板，无遮罩、不阻断画布，宽 500px、圆角 25px；≤600px 宽为屏宽减 34px，顶部 124px，最大高为视口减 330px，内部滚动。桌面标题 35px，短屏桌面 30px，手机 28px。My canvases 为右侧 370px 抽屉；手机两侧各 13px、顶部 90px、底部 115px，作品列表独立滚动，导入和备份留在底部。

比较是覆盖画布的全屏可滚动界面，内容最大宽 920px，两张版本卡并列；≤600px 改为纵排，图片高度由 330px 变为 240px。完成页固定覆盖全屏，内容最大宽 1100px，桌面相框与文字双列；≤600px 改为纵排，图片高 280px，姓名、简介和下载沿页面向下排列，保持自然滚动。

## Elevation & Depth

首页伙伴与小样通过留白、浅色表面与 `0 8px 24px #36294a0b` 小样阴影建立层次。真实画布嵌入沿用下述 studio 卡片厚度与连接样式，外层以细边框界定展示区域。项目条目 hover 改变底色与分隔线，图形上移 3px、箭头右移 3px，按钮 hover 亮度 .92、按下下移 1px；减少动态效果时禁用过渡与 hover 位移。以下厚度规则用于 studio。

厚度由短而实的彩色底边配合柔影产生。Moss 卡为 `0 7px 0 -1px #a7cf95, 0 16px 28px #3c704014`，Pip 使用蓝色底边，材料使用珊瑚底边，成果使用紫色底边。浮动工具为 `0 5px 0 -1px #e2e4dc, 0 12px 24px #4553680d`。

主按钮默认 `0 4px 0 #1c5c3a`，按下位移 3px 并压缩到 1px 阴影。Pip 按钮有自己的蓝色默认阴影；当前按下阴影继承通用主按钮规则。其他按钮按下位移 2px。不要退回几乎无厚度的灰白办公面板。

入口面板使用 `0 6px 0 #e5e3d6, 0 18px 50px #38473915`，完成相框使用 `0 8px 0 #907ac6`。入口启动按钮与完成下载按钮继续使用 4px 实色底边；比较卡通过浅蓝与浅紫表面区分旧版、新版。

## Shapes

首页结果小样圆角 12px，图片／故事／动作分别轻旋转 4°／−3°／3°，44px 圆形播放控件保持明确命中区。真实画布滚动窗口圆角 16px，内部直接复用 studio 卡片形状；作品图圆角 8px。项目条目无圆角、仅顶部分隔线；按钮最小高 48px、宽 224px（不超过可用宽度）、圆角 10px，白字及普通 18px 箭头。项目图形使用 64×64 viewBox、2.5 描边、圆角连接，桌面显示 66×66px，≤760px 为 48px，≤580px 为 54px；无图标底色块。项目标题桌面 25px，≤760px 为 22px，≤580px 为 23px。以下玩具形状用于 studio。

主卡圆角 26px，图片内框 17px，主按钮 14px。便签四角为 `23px 23px 23px 7px`，旋转 -3deg，顶部有浅黄色短条。珊瑚材料旋转 2deg，紫色成果旋转 -1deg。轻微错落表达可拿取感，不能影响读写和命中区域。

图片框内距 11px，材料画面高 280px；成果由 studio 层覆盖为桌面 245px、手机 220px，作品图占容器 96%；动物伙伴在桌面任务头部为 67px。图片与伙伴使用原有插画素材，保留完整形象。

## Components

### 创作世界扩展 — 2026-11-06

- **版本与详情**：版本按钮以缩略图或文字／音乐图标显示，选中同时有描边和 `aria-pressed`；可横向滚动，详情视图放大作品但保持同一操作组件。Keep creating 折叠承接主角选择、角色卡和其他伙伴交接。
- **My world**：世界名称、设定与主角图分开编辑，主角选择用缩略图；任务内 Bring my world 的复选框与参考图一起显示，避免隐藏带入材料。
- **Show my world**：作品选择用描边与勾选反馈，独立顺序列表提供上移／下移／移除；封面和配乐用原生选择控件，事实性回顾用明确复选框。展示页与离线页突出作品，音频为手动播放，减少动态效果偏好继续生效。
- **解释内页**：流程采用图文分步，伙伴页使用现有形象与具体成果，灵感页用作品和可选转折，家长页用事实段落与分隔线，Help 用搜索与原生 details。正文不依靠重复标签说明已清楚的布局；手机菜单、帮助搜索与键盘焦点保留可见反馈。

- **首页创作入口与阵容**：主 CTA 打开 `/studio?new=1`，旁列 No sign-up needed.。四项标题为 Draw my character、Tell my story、Make my soundtrack、Make it move，伙伴名作为 with … 次要文字。Moss 展示狐狸图片，Tavi 展示 The sneezing moon 短故事，Nix 展示波形与 8 秒预制音频，可主动播放／暂停；结束复位，失败显示重试提示。Pip 手动播放 CSS 漂浮两次，每次 2.4 秒，结束自动复位，可中途暂停。减少动态效果的运行时监听会复位并禁用动作按钮，图片保持静止。旧角色选中／介绍展开交互已废止。键盘保持可见焦点。肖像来自 `/assets/crew-lineup.png`；Tavi/Nix 是首页预制小样，不增加实时服务。无统一提示词节点、无存储访问或生成 API。
- **真实画布只读展示**：`/canvas-showcase` 渲染 `<App showcase/>`，直接复用真实 App UI，不另画展示卡片。公开 `showcaseBoard` 保留九节点，统一 Nova 冒险：想法 → Moss 角色 → Moss 歌唱鲸鱼世界，世界延伸 Tavi 预写故事与 Nix 8 秒合成声音，Nova 延伸 Pip 动作。世界宽 420px／图片高 269px，角色宽 220px，故事与声音位于右侧 280px 轨道；Pip 任务在角色下，420px 横向动作卡位于世界下，图片为 120×120px。使用新生成 `/assets/nova-song-world.png`。四伙伴用共享 sprite 肖像和明确动作标签；所有任务正文与编辑操作仅在 showcase 隐藏。伙伴栏左下，缩放右上，节点采用展示专用垂直连接；正常 studio 保留原样及 90px Bézier 控制距离。iframe 禁止指针和焦点交互，内部 App 为 inert；外层可横向浏览并有文字说明。示例不读取或写入用户存储，不请求 API；存储按需打开。动作只播放一次 4 秒，遵守减少动态效果设置，横向按钮在减少动态效果时立即滚动。Nix 的实际音频 `/assets/nova-star-song.wav` 由 iframe 外部按钮主动播放／暂停，结束复位，失败显示重试提示，不自动播放。Tavi／Nix 示例只用于首页，不增加 studio 服务。Start your own canvas 链接打开 `/studio?new=1`。当前为已实现的紧凑四伙伴九节点视图。
- **作品展览**：八件作品为云上图书馆、果冻角色、三格漫画、Stay curious 海报、像素冒险、星际朋友、纸艺海底城市与青蛙贴纸页。jelly、ocean、poster、stickers 是四件新制作的作品，替换旧角色槽位；来源见 ASSETS.md。横向轨道支持触摸、滚动条、前后箭头及轨道聚焦后的左右方向键；箭头在边界禁用，每次移动约 80% 可见宽度。不自动轮播，减少动态效果时立即滚动。点击图片在图下展开想法及 Make your own 链接，再点关闭，同时仅展开一件；hover／焦点只显示操作提示。果冻角色的独立按钮控制 CSS 漂浮，默认暂停。图库不声称真实儿童作者或模型生成视频。
- **六个直接创作项目**：直接展示角色、三格漫画、世界、动作、贴纸页、海报。以 `ProjectSymbol` 的六个自定义双彩 SVG（角色脸、漫画格、山景、场记板、折角贴纸、星星海报）对应六类项目；共用 64 网格与 2.5 描边，浅色填充搭配深色轮廓，无底色块，与标题同排，不使用作品缩略图。作品图继续只用于原有画廊。每个白色平面条目包含实色按钮；角色紫、漫画棕橙、世界绿、动作蓝、贴纸金棕、海报玫红，使用 frontmatter 对应颜色；旁边 I have my own idea 为 `/studio?new=1`；具体项目由 `src/creation-content.js` 定义，使用 `/studio?create=character|comic|world|motion|stickers|poster` 的单个值。漫画、贴纸与海报只是现有 Moss 图片能力的不同指令；动作使用 Nova 与 Pip 样例。不自动生成，不新增多页编辑器、视频或其他服务；详细语义以 PRODUCT.md 为准。
- **家长与 FAQ**：同一紧凑区域组合 “A little space to grow big ideas.”、一段孩子自主创作说明与五条原生 details。展开问题显示正文与旋转加号，保留可见焦点。独立家长条、独立 CTA 横幅与重复末尾 CTA 均为历史方案；不再恢复。

- **想法块**：黄色自由文本，明确交给 Moss。文字与物体本身形成主视觉。
- **伙伴任务**：绿色 Moss 或蓝色 Pip，默认呈现材料缩略图或想法图标与摘要，Change material 折叠后才显示选择框。Moss 以自由指令表达要求，不再显示颜色和场景选项；Pip 保留 Movement。启动后显示进度、失败提示及可再次启动的按钮，不自动保留成果。
- **图片与成果相框**：珊瑚色材料可继续交给伙伴；紫色成果带明确保留操作。Kept 标签为状态，Give to Pip 为交接动作；新结果仍是独立卡片。
- **伙伴栏**：绿色和蓝色触感按钮，动物和名字突出。锁定 Pip 可打开解锁说明，不做完全失效按钮。
- **工具与定位**：选择工具浅蓝，想法工具浅黄，上传工具浅珊瑚，绘画工具浅紫；手机导航使用白色小块和蓝色选中态。选中卡片显示复制、删除，方向键仍可移动。
- **反馈与面板**：蓝色 toast、暖白侧栏、暖白绘画弹层。弹层保持焦点约束与关闭后焦点恢复。空画布采用蓝标题和黄色添加按钮。

主按钮最小高 48px；工具、成果操作、关闭、缩放等保留至少 44px CSS 目标。材料下拉框为 42px，选项下拉框为 40px。这里记录真实尺寸，不宣称全部控件达到屏幕 44px。

按钮状态过渡为 160ms。Float / Hop / Dance 仍为 3s / 1s / 1.4s 循环，带播放暂停。减少动态效果时禁用 CSS 动画、过渡与按压位移。材料分支与保留解锁继续存在；画布内开始、真实生成、比较与角色卡构成当前创作闭环。

入口文本框 placeholder 使用 `entry-placeholder`，在白色输入背景上约 4.75:1 对比度。默认字体 19px，手机 17px。入口到达动画只在允许动态效果时执行 240ms 淡入和 8px 位移。

新增 surface：

- **CanvasStart**：中央暖白面板包含 Moss、想法输入、绿色启动按钮、三条彩色灵感、画画与上传。自动聚焦输入，但不是 modal；可关闭，New idea 随时重开。空输入和准备中禁用启动。已有作品时先保存旧作品，再创建新画布，保存失败留在原处并显示错误。
- **ProjectDrawer**：作品列表含 66px 缩略图、名称、状态和打开操作，当前作品淡绿突出；已完成作品可 View my card。删除为独立操作，导入 JSON 与备份在底部。它替代独立 Home 和三列作品架。
- **材料预览**：13px 圆角、11px 内距，图片缩略图为 54px，摘要最多 55px 高并可滚动；Moss 浅绿，Pip 浅蓝。它是任务当前输入，不是生成结果。
- **Compare**：浅蓝旧版与浅紫新版，各自包含图像、指令与 This is the one；底部黄色按钮继续修改。全屏 dialog 有焦点循环、Escape 关闭和焦点恢复，不能用自动覆盖替代选择。
- **FinishedCard**：浅紫底、35px 圆角紫色相框、播放暂停；姓名限 40 字符，简介限 180 字符，白色输入框有淡紫边。顶部 Keep my card 与正文 Download moving card 是不同动作；下载是带图片与动画的离线 HTML。
- **错误与恢复**：入口、抽屉与角色卡保存错误使用暖桃色 alert，角色卡标题上方直接提供 Download canvas backup。画布保存失败用顶部横幅；任务失败用卡内暖色提示。下载失败在下载区域给出文本 alert，保持姓名、简介和图像可见，不能把错误装饰成成功 toast。

当前 Moss 已使用真实图片生成与参考编辑，Pip 仍是 CSS 动作；不再沿用“全部本地素材生成”的旧边界。保存和请求实现以 PRODUCT.md 为准，视觉规范只约束状态的清楚呈现。

## Do's and Don'ts

- **Do** 保留已确认的首页 hero；下方只读展示复用真实 App 与公开示例，表达想法的多分支创作，studio 保持自己的视觉 token。
- **Do** 让孩子明确选择材料、开始任务、检查成果和决定交接。
- **Do** 在真实桌面和手机画面检查正文可读与浮层遮挡。
- **Don't** 将被否定的双伙伴交接 hero 或卡通重首页恢复为现行方向，或把首页的清爽软件样式扩展到未授权修改的 studio。
- **Don't** 增加多余二级标签和说明，用布局表达层次。
- **Don't** 把自由画布改成固定步骤或端口接线流程。
- **Don't** 复制参考品牌角色，或把 Pip 的 CSS 动作描述成模型生成视频。


## Current focused headline · 2026-11-05

当前 Hero：Where kids learn to / create with AI.，副标题 A safe AI studio that keeps kids thinking.，不写年龄；原说明段落已移除。副标题表达安全探索与独立思考的设计目标，不代表新增安全能力或审核保证。create 沿用标题的 Gabarito 字体、字重与基线，cr 为清亮蓝 #368ac4、ea 为湖蓝 #2597b4、te 为薄荷青 #2a9f99，字距 -.01em，其余标题深墨色 #222b28；Hero 与导航主按钮绿色 #287c50。四伙伴＋成果保持静态，无播放按钮、audio、动画或相关状态；下方画布行为不变。此记录取代早期彩虹字母、紫色强调和播放预览描述。

源码 src/Landing.jsx、src/CrewPreview.jsx、src/crew-preview.css、src/home-refresh.css；证据 `.impeccable/review/cool-type-hero-desktop.png` 与 `cool-type-hero-mobile.png`。构建通过，1440px／390px 真实界面已检查，无文档溢出，Hero 播放控件和动画数量均为0。

## Direct manipulation update — 2026-11-05

Studio keeps its existing colorful visual system. Picture headers now group a
selection toggle, Combine drop target and draggable Grow action. Dragging shows a
preview line and a highlighted valid target; ordinary placement is not generation.
A nonmodal creation chooser previews the selected pictures and offers concrete
creation actions. On mobile the chooser fits the viewport and can scroll; clicking
and selecting pictures covers the same path as dragging. Multiple sources have
individual connection lines and task thumbnails. New branches avoid occupied card
space. This replaces the old prohibition on direct branch gestures, without
introducing technical ports or a required wiring workflow.

Homepage copy update — 2026-11-05: removed “No sign-up needed.” beside the hero CTA and “No sign-up.” from the lower creation note. This supersedes earlier copy records; guest access and the account FAQ are unchanged. Deployed with the direct canvas changes; see DEPLOYMENT.md.

## Creation surfaces — 2026-11-06 (local, not deployed)

The start panel uses existing public artwork for three editable starting choices:
character, world and comic. A warm-white surface, clear type hierarchy and visible
input boundary replace the former abstract question and text-only spark chips.
Choosing a type may fill an example but must preserve child-authored text.

Tasks now lead with the concrete creation title and a small crew signature. White
editors, tinted headers and labeled input fields replace large all-green forms.
Text-only source material is expandable rather than repeated as a second headline.
Successful tasks collapse to a short record; in-progress and failed tasks stay open.
Picture frames are upright and image-led, with distinct Edit, Grow and Combine
controls. Multiple selection uses thumbnails; adding a fifth cannot replace an
existing selection. Mobile card actions sit below the card on the left, away from
zoom controls. Overview reserves space for the left toolbar and bottom crew dock.

Existing color family and Gabarito remain. Supporting UI sizes are 13, 14, 15,
16, 18, 20, 25 and 30px; white task surfaces use #fffefb, fields #f8faf4 with
#c5d5be edges, and primary text #25344b. Homepage/showcase styling is unchanged.

## Unified workbench — local, 2026-11-06

The runtime toolbox now sits on the left; mobile opens it from Tools. The runtime
bottom crew dock is removed. Result-led cards contain versions and Edit/Combine/
Grow actions. Editing reduces the preview height; instructions can be collapsed.
Branch choices appear near the source/drop point, or in a mobile bottom sheet.
Automatic reveal pans only as needed and preserves zoom; explicit overview/focus
controls can still change zoom. The homepage showcase remains unchanged.


## First creation and drawing tools — local 2026-11-06

Operate refinement of the existing Gabarito canvas, not a new visual world.
The first empty canvas has three large choices; fields appear after selection.
Prepared tasks open at normal reading size, and the canvas remains behind them.
Returning work keeps its view. Focused work blocks background history/delete
shortcuts, traps focus and restores it on close.

The drawing surface is white paper on warm cream with an adjacent tool row,
normal labeled description and partner controls, and a single preparation action.
Mobile stacks the same controls and keeps touch strokes inside the paper.
The eight ink colors are drawing content. Pen/eraser and color selection have
visible shape/border states in addition to color. Unsaved exit is explicit;
clear can be undone. Existing pictures are only edited on a new copy.

Marked edits use a two-column picture/form sheet on desktop and a scrollable
single column on mobile. The red #cb334e ellipse has a white halo so it remains
visible on varied pictures. A nine-position select provides a keyboard alternative.
Change and preserve fields remain separate. Focus #426de0 and reduced-motion
rules carry through both tools.

The tool surfaces intentionally extend the existing control scale with 8/10/16/20px
radii and 13–30px type as recorded in creative-tools.css. Green/brown/blue control
tints stay within the incumbent partner palette; the tools do not change the
landing page. Impeccable's detector reported palette/type/radius advisories only.
Its older schema/sidecar drift was recorded, not repaired as part of this feature.


## 2026-11-06：减少默认操作的本地迭代

延续现有 Gabarito、暖色画布、绿色 Moss 操作与伙伴色彩，不替换首页构图。

- 结果保留作品、必要版本条、Favorite／Compare，随后只有 Edit／Continue／Download 三组。一次展开一组，手机展开后将菜单带进可视区域；材料和旧版成果复用同一组件。
- 画板从起点直接进入。文字首创和圈选修改只保留一个明确生成按钮；不将素材选择或伙伴切换当成提交。
- Pip 用三枚动作选项和可暂停预览；歌词等附加配置按需展开。当前版本素材优先，Earlier versions 始终可访问，已选旧版仍可识别。
- 作品展示采用 Experience 模式：优先呈现已选作品，调整选项次级。封面不再重复出现在正文；动画封面保留动作和 reduced-motion。
- 角色卡是导出呈现；主角设置次级，空画布不显示。自动保存状态持续可见，Favorite 不承担保存含义。卡片管理收入更多菜单。
- Ideas 保留具体可编辑起点，移除重复格式总览。帮助与流程说明使用实际操作名称。

验证有界完成：一次桌面／手机批量检查、集中修复、一次确认；颜色和字号检测仅提示既有设计文档尺度差异，无新增阻断项。没有把文档旧侧车格式整理纳入本轮。
