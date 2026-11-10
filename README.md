## Canvas-first editing — 2026-11-10 (released)

The start form and automatic full-screen work editor are removed. A new canvas
starts with an editable, persisted creation card; generation, progress, results
and picture revisions stay at that card. Drawing opens in canvas coordinates.
Partner tasks, uploads and continuations remain on the canvas. Compare and final
presentation/export views remain separate. Published to GitHub main and the existing Pebli Worker. Runtime commit: `d5c8e55`;
Worker version: `ccad9763-a00f-4289-aafd-4f34a90f660d`. Validation: 84 tests, Vite build, desktop and 390px mobile UI; browser
mock image creation/revision, real local drawing → Pip, and reload recovery.
No paid model requests. Production providers remain unconfigured; see DEPLOYMENT.md.

# Pebli — real character creation

独立儿童 AI 创作产品：彩色自由画布、真实图片生成与参考图修改、版本比较、可下载的动态角色卡。

## 上一线上版本 — 2026-11-07

**画板、圈选修改和操作精简已发布。** [打开 Pebli](https://pebli-studio.judexuhs.workers.dev/) · [进入创作画布](https://pebli-studio.judexuhs.workers.dev/studio)。源代码已同步至本仓库 `main`，功能提交为 `c3d5a7d`，Cloudflare 版本为 `f3cb113c-f9eb-460c-8dd8-b22a131dea51`。

发布副本通过 82 项测试、构建和 Worker 预检；线上桌面／手机、手绘交给 Pip、动作展示、刷新恢复及五个说明页已检查。**线上图片、故事、音乐服务仍未配置**，需要在 Pebli Worker 单独配置供应商密钥；画板、Pip、本机保存和展示可用。本次未调用付费模型。部署与回退信息见 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 本次发布内容：操作精简 — 2026-11-06

这轮已完成产品梳理后的精简：作品统一为 **Edit / Continue / Download**；首创与圈选修改各一次明确提交；画板直接打开；Pip 选动作即预览、点击应用，Nix 歌词收进可选设置。自动保存与 Favorite 分开，角色设置与角色卡共享主角资料，素材默认当前版，旧版仍可选。

展示先预览明确选择的作品，再按需调整顺序、封面、配乐；可选创作回顾只带出所选作品及其相关历史。画布管理操作收起，全部伙伴、画板、自由画布、版本比较和各种导出／备份保留。Ideas 去掉与首页重复的格式列表，五个内页继续保留。

**82 项测试与 Vite build 通过**，桌面、390px 手机、手绘补说明、刷新恢复及离线 HTML 已验收。生成验收使用浏览器内模拟响应，Pip 在本地真实运行；没有新增付费模型调用。详见 [验证记录](REHEARSAL.md) 和 [单一实施计划](CANVAS_IMPROVEMENTS.md)。

用户已随后授权并完成 GitHub 同步及 Cloudflare 发布，线上状态见本文顶部。

## 上一轮本地迭代：首次创作、圈选修改与画板 — 2026-11-06

本轮按用户确认的第 1、2 项建议实现，并把画板接入现有四位伙伴：

- 首次开始提供 Make a character / Start with a drawing / I have my own idea；切换保留输入，准备后直接聚焦任务。图片完成后可继续做住处、冒险或动作，沿用准确的选中版本。
- Edit 可拖动圈选，也可用九宫格位置选项标记区域；分别填写改变和保留要求。原图与标记引导图分开传递，原版本保留。圈选是模型参考，不是像素级局部重绘保证。
- Drawing board 支持鼠标／触控、八色、笔刷粗细、橡皮、撤销／重做、可撤销清空、重新打开笔画及在图片副本上画。画稿和伙伴任务同时准备，仍须明确点击生成；Moss 使用图片，Tavi／Nix 使用孩子写的画作说明，Pip 添加本地预设动作。

70 项测试、Vite 构建与 Worker dry-run 编译通过，桌面／390px 手机实测完成。用户随后授权一次真实 Moss 测试：蓝色圆圈变成彩色龟壳，保留白底与蓝色轮廓，成品不含红色标记；原图及新结果在刷新后均恢复。模型同时调整了位置、大小与画幅并添加少量形状，因此圈选仍是参考指导，不是严格局部重绘。详细记录见 [REHEARSAL.md](REHEARSAL.md)。

该阶段完成时尚未部署；现已包含在 2026-11-07 发布中。

## 上一线上版本 — 2026-11-06

本轮创作世界、全部伙伴入口和五个解释内页已部署到 https://pebli-studio.judexuhs.workers.dev/ ，Cloudflare 版本为 `d06b77c7-036c-475b-9c58-85915aa76cd2`。代码已同步到本仓库 `main`。

**线上 AI 生成尚未启用**：目标 Worker 尚未配置 `OPENROUTER_API_KEY` 和 `FAL_KEY`，图片、故事及音乐接口会明确返回服务未连接。Pip 的预设动作、本机画布和作品展示不依赖供应商密钥。下面的真实生成成功记录属于本地验收，不代表线上生成已经验证。部署状态和回退点见 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 独立安装与运行

需要 Node.js 22 或更新版本。仓库：https://github.com/judexuhs/studio-for-kid。

```sh
npm ci
npm run dev
```

本地预览地址为 http://127.0.0.1:4175。生成服务从项目根目录的 `.env.local` 读取 `OPENROUTER_API_KEY` 和 `FAL_KEY`；这些文件不会提交到仓库。图片和文字使用 OpenRouter，音乐使用 fal。也可以通过 `PEBLI_ENV_FILE` 显式指定已有服务端配置文件；不再自动读取任意父目录的配置。在原开发工作区沿用共享配置时，使用 `PEBLI_ENV_FILE=../../.env.local npm run dev`。配置仅由服务端运行时加载，不进入浏览器。

```sh
npm test
npm run build
npm run preview
```

Cloudflare 使用本项目的 Wrangler 依赖和 `wrangler.jsonc`。现有配置指向 Pebli 的生产 Worker；其他人部署自己的副本前，应更换账号、Worker 名称和 R2 绑定。完成 `npx wrangler login` 后，使用 `npm run cf:deploy` 发布；供应商密钥需在目标 Worker 单独配置，详见 [部署记录](DEPLOYMENT.md)。

独立仓库包含运行代码、公共素材、字体许可和项目文档，不包含本机画布、请求记录、凭证、构建产物及历史设计归档。下方历史记录提到的 `evidence/` 截图与导出仅保留在原开发工作区。

## 本轮功能与发布前本地验收 — 2026-11-06

本轮已完成用户确认的七项创作改进与五个解释内页。Moss、Tavi、Nix、Pip 从一开始即可使用，不再需要保留作品来解锁伙伴。Moss 生成和修改图片；Tavi 经 OpenRouter 写短故事、下一幕和三格漫画情节；Nix 在本地 Node API 与 Cloudflare Worker 都有歌曲／纯音乐接口；Pip 为图片添加 Float / Hop / Dance，仍是本地预设动作，不是模型生成视频。

- **继续自己的世界**：在 My world 填写世界设定、选择主角与虚构名字；在任务中主动勾选 Bring my world，查看将带入的参考。生成时固定上下文与材料快照，不改动已有成果。
- **开始与修改**：可改写的兴趣起点和转折；分别说明要改什么、保留什么；缩略图版本切换与比较。桌面、手机作品详情复用同一套编辑、版本和伙伴交接操作。
- **展示与带走**：Show my world 可选最多五件作品、排序、选封面和已有音乐，自愿附上基于实际指令与选择的创作回顾。可预览或下载包含媒体的离线 HTML；音频需要手动播放，原角色卡与 JSON 画布备份继续保留。
- **解释内页**：`/how-it-works` 解释创作流程，`/crew` 解释伙伴分工并直达对应任务，`/ideas` 提供可改造起点，`/for-parents` 说明孩子的决定与保存／服务边界，`/help` 提供搜索和操作、故障帮助。首页主体保持，导航、页脚及 FAQ 同步当前能力。

本地验收：59 项测试、Vite build 和 Wrangler dry-run 编译通过；实际完成 Tavi 文字、Moss 参考图编辑、Nix 130 秒 MP3、Pip 两个版本及刷新恢复。桌面 1440px、手机 390px 和离线 HTML 已检查，截图在 [evidence/worlds-20261106](evidence/worlds-20261106/)。详见 [验证记录](REHEARSAL.md)；单一实施计划仍为 [CANVAS_IMPROVEMENTS.md](CANVAS_IMPROVEMENTS.md)。

以上是发布前的本地验收结果；当前线上状态以本文顶部和 DEPLOYMENT.md 为准。没有新增账号、云同步或公开分享；画布仍保存在本机浏览器，生成服务仍依赖配置与额度，角色一致性不作像素级保证。保留 `.pebli-data/jobs/` 的付费请求去重和恢复记录。

## 线上版本记录 — 2026-11-05

以下为上一部署阶段记录，不表示上述开发版已上线，也不是对当前线上供应商状态的重新验收。

https://pebli-studio.judexuhs.workers.dev/

独立 Cloudflare Worker，免登录；图片和歌曲使用独立私有任务存储及游客额度。Nix 已加入画布，可填写歌曲方向、可选歌词或选择纯音乐，完成后播放、保留及下载 MP3。真实生成需要在 Pebli Worker 配置 `OPENROUTER_API_KEY` 和 `FAL_KEY`；当前部署正在等待配置，不能视为已验证真实生成。任务与媒体服务器副本保留七天；完成作品随画布保存在本机，可导出备份。部署和验证记录见 [DEPLOYMENT.md](DEPLOYMENT.md)。

以下为本地运行方式。上一部署阶段的本地 Node API 仅提供图片；2026-11-06 开发版已补齐文字与歌曲接口，使用本机服务即可走完整创作流程。

## 打开

双击 **Open Pebli.command**。或在本目录运行：

```sh
npm run dev
```

然后访问 http://127.0.0.1:4175 ：首页是可探索的创作软件入口：从角色、漫画、场景、动作、贴纸、海报六个目标进入独立画布，或打开空白画布，无需登录。`/studio/` 同样可用，刷新仍留在画布。保持终端打开，结束时按 Control-C。当前版本需要 Node.js 与本地服务；原单文件设计快照已保留在 `archive/v3-toys/Pebli Canvas.html`。

服务端运行时读取本项目 `.env.local`，也支持通过 `PEBLI_ENV_FILE` 显式指定已有配置，使用 `OPENROUTER_API_KEY` 与可选 `OPENROUTER_IMAGE_MODEL`（默认 `qwen/qwen-image-3`）；不向浏览器传递密钥。未配置时明确提示，生成失败不回退预置图片。不要将本地开发服务暴露公网。

## 先前实现记录 — 2026-11-05

以下保留历史演进；Tavi／Nix 的服务能力及伙伴开放规则以本文顶部开发版说明为准。

1. 独立产品介绍首页：四人小队、复用真实 studio 的只读画布展示、作品与原始想法、六个创作入口、家长 FAQ。示例围绕 Nova 与唱歌的太空鲸鱼，包含 Moss 的角色和场景、Tavi 的故事、Nix 的音乐与 Pip 的动作，九个节点；无需操作即可看到分支关系，手机支持横向浏览。首页不访问作品存储或调用生成 API。Tavi／Nix 为首页策划的故事和合成音频样本，可试听 8 秒原创星空音乐；Tavi 尚未接入故事服务；Nix 的 Cloudflare 音乐服务见上文。六个入口进入独立画布无需登录，也不会自动生成。
2. 画布内创作入口：自定义想法、灵感种子、手绘／上传；首次进入显示轻量面板，回访恢复最近画布。作品在侧边抽屉中切换。
3. 自由画布：独立材料、任务、结果，平移、缩放、分支、复制、删除、撤销。
4. 实际图片生成；选中旧版提出修改，以参考图保持角色特征；并排比较和保留版本。
5. Pip 动作与角色卡：名字、介绍、播放暂停、下载可离线播放的 HTML 成品。动作是可控 CSS 效果，不是视频模型输出。
6. IndexedDB 保存大图片与作品；旧 localStorage 一次性迁移；JSON 导入／导出备份。
7. 服务端任务记录与 requestId 去重；刷新重连后恢复；超时或失败由用户明确重试，不自动增加付费请求。

## 验证

```sh
npm test
npm run build
```

`npm run preview` 使用生产前端构建和同一本地 API，需要先 build。生成的图片与修改确实经供应商返回；真实验收作品见 `evidence/Nova-character.html`。请求记录在 `.pebli-data/jobs/`，已忽略于 Git。不要删除它来“清缓存”：里面保存了已计费请求的去重与恢复信息。

本地保存不是云备份；下载 JSON 可以跨浏览器导入。文件导入不会自动重新发送未完成生成任务。角色一致性是参考图约束，不是像素级保证。

产品说明：PRODUCT.md；视觉规范：DESIGN.md；验证记录：REHEARSAL.md；素材与 API 来源：ASSETS.md。无 Rifflo 主站改动；独立 Pebli 部署见 DEPLOYMENT.md。
