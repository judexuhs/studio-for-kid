# Pebli 工作目录

整理日期：2026-11-18（Asia/Shanghai）。

## 日常入口

`/Users/judexu/Desktop/我做的项目/Pebli`

本目录只维护 Pebli。原目录 `children learn AI/experiments/crew-workbench` 已整体移动，不再保留第二份开发副本或链接。Rifflo 继续使用同级 `children learn AI`，其应用代码和未提交修改保持原样。

## 内容位置

- `src/`：首页、创作画布、伙伴和前端测试。
- `server/`、`cloudflare/`：本地 API、Worker、生成服务和测试。
- `public/`：Pebli 运行素材及字体；来源记录见 `ASSETS.md`。
- `scripts/`、`package.json`、`package-lock.json`、`vite.config.js`、`wrangler.jsonc`：独立运行与部署配置。
- `PRODUCT.md`、`DESIGN.md`、`CANVAS_IMPROVEMENTS.md`：产品、设计与实施记录。
- `DEPLOYMENT.md`、`REHEARSAL.md`：历史发布与验证记录。
- `naming-shortlist.md`：Pebli 命名研究；未选择或更换品牌。原文中的 July 2026 Rifflo 命名历史留在 Rifflo 项目。
- `archive/`、`design/`、`reference/`、`evidence/`：Pebli 的历史设计、参考和验收材料。
- 隐藏本地目录及现有依赖整体保留；`.pebli-data/` 的请求恢复记录不删除、不读取、不提交。

## 运行与数据

双击 `Open Pebli.command`，或在本目录执行 `npm run dev`。本地地址仍为 `http://127.0.0.1:4175`，因此同一浏览器、同一地址下的画布存储不会因文件夹搬迁改变。浏览器中的原有私人画布没有被读取或验证。

生成服务支持本目录自己的 `.env.local`，或显式 `PEBLI_ENV_FILE`。本次没有读取、复制或新建密钥，也没有让新目录自动依赖 Rifflo 配置。已有线上 Worker、R2 和 Durable Object 配置原样保留，本次不发布、不迁移线上数据。

此目录从原工作区的未跟踪子项目移出。2026-11-18 应用户要求接回已有独立仓库 https://github.com/judexuhs/studio-for-kid 的 `main` 历史；本地工作文件未被远端覆盖。核对基线为 `c0e241c`，运行代码、测试、依赖和公共素材均与远端一致。本次同步补充独立目录说明、开发规则、命名研究和已有设计探索说明。

远端为公开源码仓库。继续沿用原有排除规则：密钥、私人画布和任务记录、依赖、构建产物、截图与历史归档留在本机；未被运行代码引用的 `.vendor/` 设计工具和旧单文件原型导出脚本 `scripts/standalone.mjs` 同样只保留本地。后续在本目录使用 Git 同步，勿回到 Rifflo 仓库提交 Pebli。

## 迁移核对

整体文件夹采用同一磁盘上的目录重命名移动。移动前后 7,510 个文件／目录条目的 inode、大小、权限和修改时间完全一致；核对只读取文件元信息，不读取密钥或私人记录内容。之后只修改目录说明、命名文档和开发规则，运行代码保持不变。

- `npm test`：92 项通过，0 失败。
- `npm run build`：Vite 生产构建通过。
- 从新目录启动生产预览：首页、studio 和五个说明页均 HTTP 200，构建后的 JS/CSS 可访问，`/api/pebli/status` 正常响应。
- 本地图片、文字、音乐配置状态均为 false；没有调用付费生成，也没有验证线上服务。需要本地真实生成时，在 Pebli 自己的服务端配置中提供密钥。
- 本次没有更改界面或交互，采用构建与启动 smoke 检查，未进行新的视觉验收。
- 已关闭原目录的本地预览，以及此次验证启动的进程；验证进程组无残留，4175 端口已释放。
- Rifflo 工作区原有修改状态保持不变；仅额外更新本次目录说明，拆分原命名文档，并移出原未跟踪的 Pebli 子目录。
