## Canvas-first creation — 2026-11-10 (local)

Supersedes the earlier three-choice start panel and automatic focused editor:
children write directly in a canvas creation card. The same card holds progress,
results and versions. Image revisions expand at the selected work; drawing is an
inline canvas surface. Partner selection, continuation and uploads do not open a
separate input page. New drafts persist without triggering generation; all model
requests still require an explicit creation action. Compare and presentation are
viewing/export surfaces and remain separate. Unsaved drawing exit stays explicit.

# Pebli：儿童 AI 创作画布

## 当前版本：精简创作流程 — 2026-11-06

本轮已获用户确认并实现，随后于 2026-11-07 完成 GitHub 同步和 Cloudflare 发布。以下约定优先于后文历史界面名称；发布与供应商状态见 DEPLOYMENT.md。

- 作品只保留 Edit / Continue / Download 三组主操作。Edit 区分修改当前图片、在副本上画、从起始材料重做；Continue 合并延展、伙伴交接与组合。画布拖拽仍是快捷方式。独立旧版图片、故事、歌曲也使用同一套操作。
- 孩子写好首次想法后，Make my picture 直接明确提交一次；圈选修改的 Make this change 同样直接提交。入口选项、素材选择、延展准备、画板保存与刷新均不自行生成。服务不可用时保留已写内容和可继续的任务。
- 自动保存与 Favorite 分开：Favorite 只是可取消的喜爱标记，缩略图选择决定当前使用版本。图片、文字、MP3、角色卡、离线展示与 JSON 可编辑备份均保留。
- 主角由孩子明确选择。主角姓名与简介使用 world 中的一份资料；角色卡只是展示／导出形式，不会自动设为主角。其他图片的卡片资料按作品 ID 保存。旧版顶层姓名／简介兼容读取、迁入对应卡片；与现有主角同图时优先 world 字段。切换或取消主角前保存其资料，清空字段后不复活旧值，历史快照不回写。
- 素材选择默认每个创作单元的当前版本，旧版放在 Earlier versions。已经选中的旧版本始终可见且可取消；组合、主角、展示和配乐都保留精确 ID。
- Pip 只需选图、选择 Float / Hop / Dance、预览并 Apply movement；每次应用保留独立版本。Nix 的歌词与纯音乐设置默认收起。手绘交给 Tavi／Nix 时补充孩子自己的描述。已知角色与场景提供不同建议，未知图片使用中性建议。
- 从作品的 Download → Preview presentation 立即预览该作品。顶栏 Present 优先重开已保存的展示，否则使用当前明确选择；没有选择时进入选择界面，不自动把整个画布加入。Adjust presentation 才显示最多五件作品的选择、排序、封面与配乐。可选 journey 只包含所选作品／配乐及其冻结材料中的相关创作记录，未选的其他分支和兄弟版本不进入导出。
- 画布管理操作收入卡片更多菜单，多选在多张卡片时出现。自由摆放、缩放、组合、融合、历史比较和全部伙伴均保留，没有进度门槛。Ideas 专注可改造起点，五个内页和首页构图保留，帮助文案同步当前名称。

82 项测试、Vite 构建、桌面／手机与离线导出通过。浏览器验收使用本地模拟图片和真实本地 Pip，不再调用付费模型；现有生产供应商配置状态不变。

## 上一轮本地开发：三个起点、圈选修改和画板 — 2026-11-06

用户选择产品建议 1、2，并明确“加入画板工具，接入现有伙伴”。本节是新功能的当前约定；尚未部署，下面已发布版本的记录不变。

首次空画布只展开三个创作选择：做角色、从画开始、自己的想法。切换不覆盖孩子的文字；自己的想法使用中性图片 brief。完成任务准备后聚焦它，回访保留原画布视角。图片的具体延展使用当前选中的版本，不自动生成。

修改可以用拖动圈选或键盘可操作的位置菜单表达区域，再分别说明改变与保留的细节。标记只提供参考：原图和独立定位图进入现有图片服务，未承诺像素精确的 inpainting。原版、修改指令、选区和生成时的材料快照都保留。

画板是工具，不新增伙伴。鼠标／触控手绘、八色与粗细、橡皮、撤销重做、可撤销清空、空白检查和离开提醒构成完整编辑流程。保存保留 PNG 和可编辑笔画；重新打开后保存为独立副本，保留来源。可仅保存，或准备 Moss／Tavi／Nix／Pip 任务。Tavi 与 Nix 必须先有孩子写的画作说明，不声称能理解图片；所有外部生成仍由孩子显式开始。没有新账号、公开分享或云同步。

## 当前版本 — 创作世界与解释内页，2026-11-06

用户已确认并完成此前讨论的七项改进：世界与主角连续创作、兴趣起点、具体修改、完整作品展示、真实伙伴交接、作品聚焦和手机详情、事实性创作回顾。全部四位伙伴从开始即可使用。此节定义当前版本，优先于下方历史段落中的“等待解锁”“Tavi 仅首页角色”“本地仅图片”等描述。2026-11-06 已将代码部署至现有 Pebli Worker；线上供应商密钥仍未配置，因此图片、故事和音乐生成尚未启用，本地真实生成验收不能视为线上验收。

1. **我的世界与主角**：孩子在 My world 编辑画布／世界名称、虚构设定，明确选择一张图片版本作为主角并命名。在任务中勾选 Bring my world 才带入设定与主角材料；参考预览可见。请求发出时固定文字、材料、保留要求与世界上下文，之后改世界或切换版本不追改已完成作品。角色一致性取决于模型和参考图，不保证完全一致。
2. **容易改造的起点**：保留角色、世界、漫画类型，增加兴趣型种子及可选转折；孩子可继续改写。切换选项不悄悄覆盖自写文本；添加想法留在当前画布，明确选择新画布才分开保存。入口和伙伴交接均只准备任务，实际生成由孩子点击开始。
3. **具体修改与版本**：修改时分别填写想改什么、想保留什么；旧版与新结果都是独立保存的版本。缩略图选择决定接下来查看、编辑、下载和交接的准确版本，并可比较前后作品与指令。Edit 留在原创作单元，Grow 创建分支，Combine 保留二至四张图片的明确选择。
4. **完整展示**：Show my world 选择并排列最多五件图片／文字作品，选择封面和一首已有音乐，预览或下载独立 HTML。图片与音频嵌入导出文件，无外部媒体请求和脚本；音乐仅手动播放。原有单张图片、故事文本、MP3、动态角色卡和 JSON 画布备份仍可使用。
5. **四位伙伴即开即用**：Moss 实际生成／参考编辑图片；Tavi 通过服务端 OpenRouter 写短故事、下一幕或三格漫画情节，可交给 Moss 继续制作；Nix 的本地与 Worker 实现支持歌曲、原歌词和纯音乐；Pip 使用图片做 Float / Hop / Dance。本次没有生成视频模型。Pip 需要先选择图片是素材依赖，不是进度解锁；旧画布的 `unlocked` 值不再限制伙伴。
6. **作品聚焦**：在画布打开独立作品详情，桌面和手机均以正常页面尺度查看作品；详情与画布复用版本、编辑、下载、主角选择及 Keep creating 交接操作。关闭后继续原画布，完成的作品仍是视觉中心。
7. **可选择的创作回顾**：孩子自愿把 My creative journey 加入世界展示。内容由已保存结果的原指令、保留要求、材料与保留决定派生，不推断能力等级，不评分，不声称已验证学习效果。

新增内页保持现有首页的 Gabarito、伙伴形象、白色页面、细线与操作配色；首页主体不改，只同步导航、页脚与能力 FAQ。

| 页面 | 职责 |
|---|---|
| `/how-it-works` | 用作品例子解释开始、指挥、判断、延展和展示，说明 Edit / Grow / Combine |
| `/crew` | 解释每位伙伴能做什么、使用什么材料，并进入对应的待开始任务 |
| `/ideas` | 浏览并选择可改造的兴趣起点与转折，再进入画布编辑 |
| `/for-parents` | 说明孩子的决定、AI 的协助、本机保存、供应商处理与使用边界 |
| `/help` | 可搜索的创作、版本、备份、导入、伙伴与故障说明 |

公共页面、首页和只读展示不访问个人画布、不提交生成。未知路径有独立未找到页面。账号、跨设备云同步、公开社区／分享、规划聊天 Agent、学习评分和模型视频均不在本轮范围。

本地实际图片编辑、文字与音乐生成以及桌面／手机和离线导出已验收，见 [REHEARSAL.md](REHEARSAL.md)。本轮后续已按用户要求部署，版本及线上检查见 [DEPLOYMENT.md](DEPLOYMENT.md)；供应商密钥配置和真实线上生成验收仍待完成。本机保存不是云备份，仍应下载 JSON；付费请求去重记录保留。

## 当前部署补充 — 2026-11-05

用户已确认独立部署 Cloudflare，保持免登录，复用 Rifflo 的模型供应商与生成实现。当前 `pebli-studio` 独立 Worker 使用 Durable Object 任务协调和私有 R2 素材；不复用 Rifflo 用户会话、作品数据库或媒体桶。Nix 已加入实际 studio，可生成歌曲／纯音乐、提供自定歌词、播放、保留和下载 MP3；当前等待配置独立 OpenRouter／fal Secret，因此尚未完成真实线上生成验收。Moss 的参考图编辑保留，Pip 仍为 CSS 动作，Tavi 仍仅为首页设计角色。首页保持用户批准的现有设计。服务器副本保留七天，本地画布不变；游客、网络和全局额度及验证记录详见 DEPLOYMENT.md。以下旧版描述中“无部署／仅本机／Nix 未接服务”已由本补充替代，不代表当前部署边界。

当前版本：2026-11-05，创作软件首页、完整创作闭环与真实图片生成。本文只定义独立实验，不改变 Rifflo 主站。旧固定工作台、Freeform 版与玩具风格设计快照见 archive/。

## 定位与已确认边界

面向 10–12 岁儿童，让孩子安排 AI 伙伴工作：决定输入、表达意图、检查结果、提出修改、选择作品并完成可玩的角色卡。画布保留自由摆放和分支，不要求理解专业节点编辑。

用户已确认独立品牌 Pebli、彩色创作玩具（LEGO × Nintendo 的明亮配色与触感，不使用其角色或标识），授权实现第一轮完整体验及第二轮真实图片生成／修改。画布内延续此方向；2026-11-05 用户否定首页三版卡通重的 A/B/C 方案，确认首页采用清爽创作软件风格。随后确认突出有温度的拟人化助手团队：首页保留白色／冷白、紫色操作和细线，以中等尺寸伙伴形象、不同性格及工作对话呈现分工，取代此前首页玩具风格约定；不改变 studio。此前“仅预设图片”边界已被真实生成取代。

当前交付为独立本地应用：真实付费图片 API、浏览器本地作品、服务端本地请求记录。没有云账号、跨设备同步、公开分享、生产部署或模型生成视频。Pip 的动画是可控 CSS 动作，成品为可离线播放的 HTML 角色卡。

## 核心体验

0. **独立产品介绍页**：`/` 保留四人小队 Hero，以下展示真实产品画布、八件作品展带、六个创作入口和家长 FAQ。首页通过 `/canvas-showcase` 的只读 iframe 直接复用 `App` 与 studio 的实际节点、连线、工具栏和伙伴栏，不再使用单独设计的三张宣传卡片。`showcase-board.js` 提供公开示例 “My space club”：想法分别交给 Moss 创造 Nova 和海报；Nova 又交给 Moss 延展太空鲸鱼场景，以及 Pip 添加角色动作，共九个节点、四种成果形式。首页专用重点视图将场景放大为主作品，Nova 为主线角色，海报／动作为较小延展；任务压缩成伙伴与动作条，仅首个角色任务保留短指令，隐藏重复编辑按钮。工具栏保留，伙伴栏移至左下空区，缩放栏移至顶栏。画布打开即有内容，内部控件 inert，不做逐步操作引导；手机保持可读尺寸、默认定位完整主场景与两种延展，可以横向滑动或点外部左右箭头浏览。外部 CTA 打开真实 studio 空白入口。首页及只读路由不读取／写入作品、不迁移旧数据、不调用状态／生成接口。存储模块改为首次实际读写时才打开 IndexedDB。角色动作展示限定一次四秒 CSS 动画，并尊重 reduced-motion；不是视频模型输出。Tavi／Nix 保持设计角色，没有新增音频或视频服务。家长区保留纯文字说明与 FAQ。
   六个目标统一由 `src/creation-content.js` 定义，进入 `/studio?create=character|comic|world|motion|stickers|poster`（每次单个值）。角色、三格漫画、幻想场景、贴纸页和海报通过现有 Moss 图片能力创建各自的想法及任务；三格漫画和贴纸页为单张图片，不增加多页编辑器或矢量导出。动作入口提供 Nova 样例材料和 Pip 任务，仅该样例画布直接开放 Pip。入口不自动生成、不改变已有画布的解锁状态。入口改为桌面两列、手机单列的创作选项，双色图标与文字横向配合，以细横线分隔；动作使用紫色文字与圆形箭头，整项可点击。通用入口仍为 `/studio?new=1`，旧 starter/project 路由保留。入口区直接呈现六个创作项目，每项使用统一双色 SVG 图标（与标题并排，不使用图标底块）与清楚的具体动作入口（如 Create a character / Make my comic），不使用作品裁图作为入口图。桌面标题不再强制换行，手机自然折行；右侧有 I have my own idea 空白入口。删除此前独立大幅淡紫 CTA 横幅。画廊以单行横向展带显示八件作品，桌面图片等高 280px、手机 210px，宽度跟随原图比例；箭头、触控滑动与聚焦后的左右方向键浏览，到边界禁用对应箭头，减少动态效果偏好下直接滚动，不自动播放或轮播。画廊点击后在图片下方展开创作想法；新果冻角色支持 CSS 播放／暂停，其余作品为静态原创示例，不声称儿童作者。
1. **画布内开始**：进入 `/studio` 或 `/studio/` 即打开画布，刷新保持该入口。第一次进入时，中央非模态灵感面板提供输入想法、三个灵感起点、画画或上传图片；画布内没有额外引导页或遮罩。开始后面板收起，在当前画布出现想法与 Moss 任务。回访直接恢复最近保存的画布；顶部 New idea 随时打开入口。作品缩略图、继续创作、看成品、导入／备份和删除统一放在画布内 My canvases 抽屉。已有画布开始新想法前先保存，新项目不覆盖旧作品。
2. **安排工作**：黄色想法交给绿色 Moss。任务直接显示输入材料，修改材料折叠；自由指令是主要输入，不再用颜色滤镜伪装语义生成。
3. **真实制作**：点击后保存 requestId，再发服务端请求。明确显示制作中、失败、重试；刷新后重新打开作品恢复任务查询。不悄悄用预置图代替失败结果。
4. **检查与修改**：可以保留、修改或继续制作角色卡。修改时保留旧版，将孩子选中的图作为参考；新旧并排展示。孩子明确选择，而非自动覆盖。
5. **解锁与交接**：保留第一份成果后开放蓝色 Pip。选择图片创建动画任务，Float / Hop / Dance 三种可控动作，成果独立存在。解锁不强制进入动画流程。
6. **完成作品**：角色卡全屏观看、姓名与介绍、播放暂停、下载独立离线 HTML，也可以继续回画布修改。保留后在 My canvases 抽屉再次打开。

## 画布对象与不变量

| 对象 | 内容 | 操作 |
|---|---|---|
| 想法 | 自由文字 | 编辑、拖动、复制、派给 Moss |
| 图片材料 | 上传、手绘、预置参考 | 作为任务参考、移动、复用 |
| 任务 | 伙伴、一个输入、指令、生成状态 | 改材料、明确开始、重复制作 |
| 成果 | 图像、输入快照、原指令、可选动作 | 保留、比较、修改、交接、制作角色卡 |

同一材料可分给多个任务，同一伙伴可接多份任务。连接自动产生，无端口连线操作。完成成果不随上游变化；生成依据点击时的输入快照。删除对象解除活连接，保留已完成的快照。撤销不产生新的付费请求；同一 requestId 在服务端去重。

## 视觉与手机

首页采用清爽软件界面与统一立体质感的四位伙伴；桌面横向阵列，手机两列，每位伙伴与一件具体成果并列展示，动作标题大于姓名。Moss 展示角色图，Tavi 展示故事片段，Nix 展示静态声音波形，Pip 展示静态动作成果；Hero 没有播放控件、音频元素或动画，也不调用生成服务。用实际 studio 的只读多分支画布、作品展带和目标入口解释产品；本地作品仅在 studio 内管理。

studio 内保持黄色想法、绿色 Moss、蓝色 Pip、珊瑚色材料框、紫色成果框；暖白点阵背景、本地 Gabarito、饱满圆角、短厚底边和按压反馈。图片与动物负责视觉吸引力。

手机保留可读卡片和自由画布，顶部卡片导航帮助定位。引导和作品抽屉可在小屏内滚动，比较与角色卡正常纵向滚动，主操作不需要缩小整个页面。尊重减少动态效果，按钮有可见焦点，卡片支持方向键移动，比较与修改界面支持 Escape／Tab。

## 服务端与 API

独立 Vite + React 18 + JavaScript。`server/plugin.js` 为开发／预览服务器提供同源接口；`server/generation.js` 只在服务端调用 OpenRouter `POST /api/v1/images`。

服务端运行时使用既有 `OPENROUTER_API_KEY`，可选 `OPENROUTER_IMAGE_MODEL`，默认 `qwen/qwen-image-3`。首次生成传 prompt；修改附 `input_references`；1K、1:1、每次一张。密钥不进入浏览器构建。当前供应商设置为拒绝数据采集；提示及参考图在孩子明确开始时发送给供应商。

角色一致性依赖参考图和提示，不承诺像素级锁定。真实验收中狐狸的脸、服装、构图保留，旗帜按指令改为蓝色黄星；这是一份验收结果，不代表每次必然成功。

## 保存、任务恢复与失败处理

- IndexedDB 保存作品、大图片、图结构、坐标、输入版本和任务；旧 localStorage 一次性迁移且不删除原数据。迁移失败不写成功标记。
- 发送请求前确认本地任务记录保存成功；切换作品前保存当前作品。自动保存失败显示警告；角色卡页也提供 JSON 备份出口。
- `.pebli-data/jobs/` 保存请求与结果，按 requestId 和内容 hash 去重；不同内容重复使用 ID 返回冲突。
- 供应商超时不自动重发；用户明确点击才创建新请求。进程中断时旧工作显示需重试，不能保证供应商已取消。
- 完成图片写盘失败时，服务进程内保留完整结果供浏览器取回；持续磁盘故障且进程退出时，不能保证跨重启恢复。
- 可导出／导入 JSON 画布备份。导入的未完成任务暂停，不自动触发新费用。下载的角色卡包含图片、文字与动画，离线播放。

## 当前防护与非目标

只监听本机，验证 Host/Origin、输入大小、引用图片类型、明显邮箱／电话号码；限并发与每小时请求。输入不能使用任意远程图片 URL，因此不会替浏览器抓取任意地址。供应商错误不透出密钥。

这是可使用的本地产品版本，不是可直接公开运营的儿童服务。未实现家长账号、云端权限、全面内容审核、生产计费控制、多人协作、跨设备恢复、多输入任务或视频导出。没有部署。

## 验证

目标模型／供应商／去重与故障测试通过；实际 OpenRouter 生成与参考编辑通过；桌面和手机检查过首页、任务、比较和成品；移动端真实完成交接与下载。详细证据见 REHEARSAL.md。下一阶段应做真实儿童可用性观察，而非宣称已提升创造力或 AI 素养。

当前首页文案：Where kids learn to / create with AI.（用户选择方案1），副标题 A safe AI studio that keeps kids thinking.；主按钮 Start creating，旁边说明 No sign-up needed.。 后半页以实际产品的只读画布、多样作品与明确创作目标介绍产品。

首页画布围绕同一个 Nova 太空故事：Moss 画角色与鲸鱼场景，Tavi 写相遇片段，Nix 配星空旋律，Pip 让 Nova 漂浮。四位伙伴沿用 hero 的统一头像，并出现在各自成果的标题栏。桌面画布使用横向布局：想法／角色在左、420px 场景居中、故事／音乐在右，Pip 动作为下方横卡；1440×720 的展示画布让四位伙伴的成果完整留在同一屏，手机保留横向浏览。故事和 8 秒合成音乐是公开策划样本，不代表 studio 已接入 Tavi／Nix 生成服务。音乐在画布外明确点击试听，不自动播放。六个创作入口保留两列分隔布局，并以实心彩色动作按钮邀请开始。


Hero 当前只实施用户选定的两项：更明确的孩子创作成果文案，以及伙伴＋成果＋动作的介绍。未增加共同想法提示或跨伙伴流程；下方紧凑画布继续独立解释协作。最新反馈已将 Hero 成果展示改为完全静态。Hero 不写具体年龄，标题已选择方案1，create 的六个字母按珊瑚红 #dc665b、清亮蓝 #548ac8、杏橙 #ce8038 循环，字距 -.01em 强调，说明段落移除；下方画布的试听与既有行为不变。

Hero 副标题表达安全探索和独立思考的产品设计目标，不改变上文记录的实际防护与未实现能力。

当前标题采用统一 Gabarito 字形与相近冷色：cr 清亮蓝、ea 湖蓝、te 薄荷青。剪纸、手写、叠色方案已被用户否定，只保留于独立对比页和 design/hero-type 归档，不作为现行首页方向。

## Direct canvas creation — 2026-11-05

Confirmed direction: no conversational planning Agent. Children arrange pictures,
choose what to make and explicitly start generation. This supersedes the earlier
single-input-only boundary for Moss tasks; the homepage and other crew abilities
are unchanged.

- Picture cards expose Grow and Combine. Move a card to arrange it; drop its Grow
  handle on empty space to choose a scene, three-panel image comic or sticker sheet.
- Drop Grow or a picture onto another picture's Combine target to choose Together
  in a picture or Fuse into a new character. Clicking the controls provides the
  same choices without dragging. Checkbox selection and a rectangle tool support
  up to four pictures; Shift selection is also available.
- New tasks retain every source link and preview. They are positioned without
  covering source cards and do not start automatically. Results retain all input
  snapshots; deleting a source does not erase completed snapshots. Undo/redo of
  preparation never submits a request; viewport focus does not consume creation undo.
- Moss sends up to four references with an aggregate 9 MB data-URL cap, within
  the existing 10 MB request envelope. Together preserves separate characters;
  fusion explicitly asks for a new combined character. Actual visual fidelity is
  model-dependent. No new Agent, story service, video generation or deployment.

Usability follow-up: all newly added cards (partner tasks, uploads, drawings,
notes and duplicates) now share collision-aware placement. New cards focus their
actual placed position after rendering. The overview uses measured card heights
and reserves room for the crew dock; double-click or Enter focuses an individual
card. Task duplication prepares a fresh task without copying an active job.

Homepage copy update — 2026-11-05: removed “No sign-up needed.” beside the hero CTA and “No sign-up.” from the lower creation note. This supersedes earlier copy records; guest access and the account FAQ are unchanged. Deployed with the direct canvas changes; see DEPLOYMENT.md.

## Canvas continuity — 2026-11-06 (local, not deployed)

Add creates a character/world/comic task inside the current canvas without
replacing its ID or existing work. New canvas is explicitly available in My
canvases and saves current work first. The first idea is one editable task rather
than a duplicated idea note plus generic instruction; standalone notes remain.
The illustrated starter choices are public examples, not generated previews.
Tasks still require an explicit generation click. Character/world/comic briefs
follow the chosen format; the provider no longer forces all fresh pictures into
a single-character composition.

Completed tasks collapse automatically and remain expandable; retries and errors
remain visible. Edit changes a picture, Grow creates a branch, and Combine first
chooses 2–4 references. Existing pictures and snapshots remain intact. Nearby
placement searches multiple surrounding slots. Tidy this group reorganizes only
the selected connected component, as one undoable action; unrelated manual
positions are preserved. The four-reference selection limit is explicit.

## Unified workbench — local, 2026-11-06

New tasks retain results inside one visible creation unit. Each generation remains
an immutable stored version, selectable for editing, downloading or branching.
Edit reuses the unit; Grow creates a separate connected unit using the selected
version. Legacy separate task/result boards remain compatible. The labeled
toolbox groups notes, image/music/motion partners, drawing and uploads.
Generation still requires an explicit click; no conversational Agent is added.
