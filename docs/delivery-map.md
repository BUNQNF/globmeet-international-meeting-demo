# 交付对照表

## 项目信息

| 项目 | 内容 |
| --- | --- |
| 项目名称 | GlobMeet 国际智能会议协同平台 |
| 工作模式 | `competition` |
| 决策负责人 | 用户 |
| 当前阶段 | `T7` |
| 当前阶段状态 | `T7-A Markdown 交付文档、GitHub Pages 在线演示与提交清单已就绪` |
| 最后同步时间 | 2026-08-01 |
| 项目框定 | [project-brief.md](project-brief.md) |
| 需求文档 | [requirements.md](requirements.md)（T1 已确认） |
| 产品功能架构 | [product-architecture.md](product-architecture.md)（T1 已确认） |
| 流程原型 | [prototype.md](prototype.md)（T2 已确认） |
| 视觉说明 | [visual-spec.md](visual-spec.md)（T3 已确认，风格基线） |
| 场景分析 | [product-scenario-analysis.md](product-scenario-analysis.md)（T1/T2 补充） |
| 市场 IA 调研 | [market-ia-benchmark.md](market-ia-benchmark.md)（T1/T2 补充） |
| 页面需求、功能与流程 | [page-requirements.md](page-requirements.md)、[page-function-inventory.md](page-function-inventory.md)、[page-flow-prototype.md](page-flow-prototype.md)（T1/T2 补充） |
| 技术就绪 | [technical-readiness.md](technical-readiness.md)（T4 重新同步待确认） |
| 运行页面 | 在线演示：[bunqnf.github.io/globmeet-international-meeting-demo](https://bunqnf.github.io/globmeet-international-meeting-demo/)；本地可使用 `npm run dev -- --host 127.0.0.1 --port 5173`；公开源码仓库：[BUNQNF/globmeet-international-meeting-demo](https://github.com/BUNQNF/globmeet-international-meeting-demo) |
| 验收记录 | [acceptance.md](acceptance.md)（既有 T5 静态验收记录；因 DEC-006 不作为新导航基线） |

## T0 项目框定

| 项目 | 内容 |
| --- | --- |
| 阶段目标 | 确定竞赛项目的用户、边界、交付重点与模拟真实性。 |
| 已确认决定 | 聚焦会议预约与参会协同；不建设真实音视频；中英双语、跨时区、移动端、AI 建议、三类角色与可追溯变更为必需能力。 |
| 数据边界 | 使用预置本地演示数据；关键业务动作以浏览器内可见的模拟状态变化呈现。 |
| 交付重点 | 方案完整性、可交互高保真 Demo、移动端稳定性、AI 应用价值和可检查的交付证据。 |
| 完成条件 | 用户于 2026-08-01 确认上述范围；允许进入 T1。 |
| 用户确认 | 已确认：2026-08-01 |

## 关键状态对照

状态值只使用：`待定义`、`流程已确认`、`视觉已确认`、`实现中`、`已验证`、`不适用`。

| ID | 用户目标/状态 | 需求依据 | 流程依据 | 视觉依据 | 运行验证 | 同步状态 |
| --- | --- | --- | --- | --- | --- | --- |
| MEET-01 | 查询并筛选适合自己的国际会议 | REQ-001 至 REQ-003 | DISC-01、DETAIL-01 | [KF-01R / 16:13](https://www.figma.com/design/yBy5951syO4QwcTCdyDNo9?node-id=16-13) | `discover → detail` 在 390 x 844 点击验证；静态展示已验证 | 流程已确认 |
| BOOK-01 | 提交会议预约并看到申请结果 | REQ-004 至 REQ-005、REQ-016 | APPLY-01、CONFLICT-01、BOOK-01、MYBOOK-01、CANCEL-01 至 CANCEL-02 | [KF-02R / 16:14](https://www.figma.com/design/yBy5951syO4QwcTCdyDNo9?node-id=16-14) | `detail → conflict` 在 390 x 844 点击验证；冲突页高亮“会议”；提交状态变化待 T6 | 流程已确认 |
| REVIEW-01 | 审核预约并同步处理结果 | REQ-006 至 REQ-007、REQ-015 | REVIEW-01 至 REVIEW-04、ADJUST-01 至 ADJUST-02 | [KF-03R / 16:15](https://www.figma.com/design/yBy5951syO4QwcTCdyDNo9?node-id=16-15) | `?screen=review&role=organizer&scenario=pending`；桌面点击验证通过 | 实现中 |
| SCHEDULE-01 | 查看跨时区日程与 AI 行程建议 | REQ-008 至 REQ-010 | SCHEDULE-01、AI-01 | [KF-02R / 16:14](https://www.figma.com/design/yBy5951syO4QwcTCdyDNo9?node-id=16-14)，[KF-04R / 16:16](https://www.figma.com/design/yBy5951syO4QwcTCdyDNo9?node-id=16-16) | `schedule` 在 390 x 844、375 x 812 路由验证；动态建议待 T6 | 流程已确认 |
| CHANGE-01 | 接收会议变更并确认日程更新 | REQ-011、REQ-015 | CHANGE-01、NOTICE-01 | [KF-04R / 16:16](https://www.figma.com/design/yBy5951syO4QwcTCdyDNo9?node-id=16-16) | `?screen=organizer-meetings&role=organizer&scenario=changed`；桌面点击验证通过 | 实现中 |
| CHECKIN-01 | 在现场完成预约核验 | REQ-012 至 REQ-015 | PASS-01、CHECKIN-01、CHECKIN-02 | [KF-04R / 16:16](https://www.figma.com/design/yBy5951syO4QwcTCdyDNo9?node-id=16-16) | `?screen=checkin&role=organizer&scenario=approved`；桌面点击验证通过 | 实现中 |

## 阶段关卡

| 阶段 | 主要决策 | 状态 | 通过时间 | 验收证据 |
| --- | --- | --- | --- | --- |
| T0 立项 | 目标、用户、边界、模式 | `已通过` | 2026-08-01 | 用户确认；[project-brief.md](project-brief.md) |
| T1 需求 | 规则、范围、验收标准与功能架构 | `已通过，DEC-006 待确认` | 2026-08-01 | [requirements.md](requirements.md)；[product-architecture.md](product-architecture.md)；页面维度材料 |
| T2 流程原型 | 状态、跳转、反馈、异常 | `已通过，DEC-006 待确认` | 2026-08-01 | [prototype.md](prototype.md)；[page-flow-prototype.md](page-flow-prototype.md) |
| T3 视觉设计 | 方向、关键状态、资源规范 | `风格已通过，术语已同步待确认` | 2026-08-01 | [visual-spec.md](visual-spec.md)；KF-01R 至 KF-04R |
| T4 技术就绪 | 架构、数据、预览、验证方案 | `重新同步完成，待确认` | 2026-08-01 | [technical-readiness.md](technical-readiness.md)；DEC-006 |
| T5 静态实现 | 视觉基线与响应式稳定性 | `进行中` | 2026-08-01 | 会务待办、会议、核验和记录页使用会务专属路由；参会端“会议、日程、通知、我的”静态页面均已落地；`npm run build` 通过；会务端 1440 x 900 逐项点击验证通过；参会端 390 x 844 点击链路验证通过、375 x 812 无横向溢出；T5-C 完成全量可用链接走查 |
| T6 行为实现 | 交互、状态、数据与异常 | `进行中` | 2026-08-01 | T6-A 已通过运行验收；T6-B 已完成“会议”页的邀请、推荐、远期会议信息、搜索筛选与时区校准交互，其余页面调整待继续。 |
| T7 交付验收 | 四视图一致并可运行 | `进行中` | 2026-08-01 | 根目录 `README.md`、[需求文档](requirements.md)、[流程原型](prototype.md)、[视觉说明](visual-spec.md)、[技术说明](technical-readiness.md)、[验收记录](acceptance.md)、[GitHub Pages 在线演示](https://bunqnf.github.io/globmeet-international-meeting-demo/) |
| T8 复盘 | 可复用经验及适用边界 | `待进入` |  |  |

## 决策记录

只记录范围、规则、交互、数据、验收或发布风险变化；不记录普通颜色、间距和无行为影响的修复。

| 决策 ID | 日期 | 变更类型 | 决定与原因 | 影响状态 | 影响视图 | 决策人 | 证据 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-001 | 2026-08-01 | B+D | 采用会议预约与参会协同范围，真实音视频、服务端与真实集成不纳入竞赛 Demo；降低实现风险，确保覆盖赛题闭环。 | MEET-01, BOOK-01, REVIEW-01, SCHEDULE-01, CHANGE-01, CHECKIN-01 | 需求、原型、UI、运行 | 用户 | T0 确认；[project-brief.md](project-brief.md) |
| DEC-002 | 2026-08-01 | B+D | 采用会务审核、四时区中英双语和可控的本地规则 AI 建议，以覆盖国际预约闭环。 | BOOK-01, REVIEW-01, SCHEDULE-01 | 需求、原型、UI、运行 | 用户 | T1 确认；[requirements.md](requirements.md) 第 4、6、9 节 |
| DEC-003 | 2026-08-01 | B | 参会人员可取消待审核或未签到的已批准预约；拒绝会务调整时变为已拒绝/不参加，不恢复原预约。两者均同步更新相关状态并保留记录。 | BOOK-01, REVIEW-01, SCHEDULE-01 | 需求、原型、UI、运行 | 用户 | T2 确认；[requirements.md](requirements.md) REQ-007、REQ-016；[prototype.md](prototype.md) |
| DEC-004 | 2026-08-01 | V | 冻结 TaskFlow 转译后的视觉语言、组件规则和四个关键帧作为实现风格基线；当前帧不替代 T1/T2 的功能内容与状态规则，后续实现必须以需求与流程为准补齐。 | MEET-01, BOOK-01, REVIEW-01, SCHEDULE-01, CHANGE-01, CHECKIN-01 | UI、运行 | 用户 | T3 确认；[visual-spec.md](visual-spec.md)；KF-01R 至 KF-04R |
| DEC-005 | 2026-08-01 | D | 竞赛 Demo 采用版本化 `localStorage` 保存虚构的本地演示状态，并提供重置/种子场景入口；提高刷新后的演示稳定性，不引入服务端或跨设备同步。 | BOOK-01, REVIEW-01, SCHEDULE-01, CHANGE-01, CHECKIN-01 | 需求、原型、运行 | 用户授权技术方案 | T4；[technical-readiness.md](technical-readiness.md) |
| DEC-006 | 2026-08-01 | B+V | 参会人员一级导航收敛为“会议、日程、通知、我的”；会务人员一级工作区收敛为“待办、会议、核验”。AI、操作记录、凭证、角色切换和冲突处理下沉到任务上下文，避免非常用功能占用一级入口。移动端关键帧首项同步由“发现”改为“会议”。 | MEET-01, BOOK-01, REVIEW-01, SCHEDULE-01, CHANGE-01, CHECKIN-01 | 需求、原型、UI、运行、技术 | 用户 | [market-ia-benchmark.md](market-ia-benchmark.md)；[page-requirements.md](page-requirements.md)；[page-function-inventory.md](page-function-inventory.md)；[page-flow-prototype.md](page-flow-prototype.md) |
| DEC-007 | 2026-08-01 | B | 会议标题默认使用中文；仅在用户主动选择 `English` 后显示对应英文标题。该规则覆盖会议卡、详情、预约、冲突、日程、通知、会务待办和操作记录，不改变业务状态。 | MEET-01, BOOK-01, REVIEW-01, SCHEDULE-01 | 需求、原型、运行 | 用户 | 用户确认；[requirements.md](requirements.md) REQ-017 |
| DEC-008 | 2026-08-01 | B+V | 会议页采用“我的邀请、本周推荐、线上+现场、筛选”四段浏览结构；邀请项显示未读提醒与高亮卡片，筛选下沉为同页搜索工作面。时区支持浏览器自动校准与四个演示时区的手动选择，当前日期时间随所选时区显示。 | MEET-01, SCHEDULE-01 | 需求、原型、UI、运行 | 用户 | 本轮确认；`src/App.tsx` |
| DEC-010 | 2026-08-01 | R | 采用 GitHub Pages 发布公开高保真 Demo；根目录 README 提供电脑访问链接和编码同一公开地址的手机扫码二维码。发布由 `main` 分支的 GitHub Actions 自动构建，避免手工上传构建产物。 | 全部在线演示状态 | 运行、交付 | 用户 | 本轮确认；`.github/workflows/deploy-pages.yml`、`README.md` |
| DEC-011 | 2026-08-01 | R | 交付方式调整为仓库内可直接查看的 Markdown 文档与公开在线 Demo；移除独立 `deliverables/` 目录和源码 ZIP，README 为每份设计、流程、技术和验收材料提供直达链接。 | 全部交付状态 | 需求、原型、UI、运行、交付 | 用户 | 本轮确认；`README.md`、`docs/delivery-map.md` |

## T5-B 验证记录

| 范围 | 验证结果 | 边界 |
| --- | --- | --- |
| 参会端一级导航 | `会议 → 详情 → 预约确认 → 日程 → 通知 → 我的` 在 `390 x 844` 逐项点击到达；预约确认页仅高亮“会议”。 | 预约、批准、通知已读及偏好修改等状态变化待 T6。 |
| 我的 | `?screen=profile&scenario=seed` 展示头像、昵称、个人信息、语言/时区/演示角色偏好及设置；“我的”底栏选中态符合 T3 基线。 | 当前为预置演示数据，不提供编辑或持久化。 |
| 小屏响应式 | `discover`、`detail`、`conflict`、`schedule`、`notice`、`profile` 在 `375 x 812` 均保持底部导航可见且 `scrollWidth = clientWidth`。 | 未作为本轮动态交互的验收。 |

## T5-C 静态链路走查

| 范围 | 走查结果 | 边界 |
| --- | --- | --- |
| 会议与预约 | 三张会议卡均进入对应会议；列表直接预约可一步返回列表；详情预约可返回对应详情；AI 冲突可返回预约、采纳替代或继续提交至预置结果。 | 提交后的真实预约创建、容量校验与跨页数据同步待 T6。 |
| 日程与通知 | 日程“查看影响”进入地点变更影响页，确认后返回日程；会议详情从日程进入后返回日程；三条通知均进入对应日程上下文。 | 通知已读、变更接受/拒绝和 AI 建议采纳状态待 T6。 |
| 全量可用链接 | 在 14 个代表性页面实际点击 110 个链接：96 个导航/任务链接均到达预期页面；14 个“跳到主要内容”无障碍链接均将焦点转入主内容，不以 URL 变化为通过条件。 | 禁用按钮为 T6 的写入操作，不属于 T5 可点击静态链路。 |
| 视觉与响应式 | 新增预约确认、冲突、预置结果、变更影响页在 `390 x 844` 维持 `scrollWidth = clientWidth`，底部导航未遮挡操作。 | 大屏会务端的动态动作仍待 T6。 |

## T6-A 运行验收记录

| 范围 | 验证结果 | 边界 |
| --- | --- | --- |
| 预约与冲突 | 中文默认会议列表中发起“AI 内容交流会”预约，进入冲突页后仍提交，生成 `GM-2026-021` 待审核申请；个人预约和会务待审队列同步可见。 | 替代场次的 AI 采纳策略和完整推荐编排属于后续 T6-B。 |
| 会务审核 | 批准 `GM-2026-021` 后，个人预约、日程、通知和会务操作记录均显示一致状态；拒绝 Sofia 的申请时，空原因就地报错，填写原因后成功反馈在待办清空状态中保留。 | 不接入真实审核账号或后台服务。 |
| 取消、刷新与重置 | 已批准预约取消后从日程移除，并同步取消通知和记录；刷新后批准状态仍保持；“重置”恢复种子预约 `GM-2026-019` 并清除本轮申请。 | 状态仅保存在当前浏览器的版本化 `localStorage`，不跨设备同步。 |
| 会议标题语言 | 会议列表、详情、冲突、日程、通知、会务待办和操作记录均验证：中文模式显示中文标题；切换 `English` 后显示同一会议英文标题。 | 当前仅固定会议标题的双语规则，完整界面文案国际化在后续范围处理。 |
| 视口稳定性 | `390 x 844` 的会议、冲突、日程、通知、个人页，以及 `375 x 812` 的四个一级页均无横向溢出、底部导航可见；`1440 x 900` 会务待办无横向溢出。 | 本记录不替代后续 T7 的全量交付验收。 |

## 未决问题

| 问题 ID | 问题 | 影响 | 最晚决策点 | 负责人 | 状态 |
| --- | --- | --- | --- | --- | --- |
| Q-001 | 默认所有预约均进入会务审核；满员不可批准，冲突可查看替代建议。 | 预约、审核、日程状态 | T1 | 用户 | 已决定 |
| Q-002 | 最小国际化范围为中英界面与上海、伦敦、纽约、东京四时区。 | 国际化展示与日程准确性 | T1 | 用户 | 已决定 |
| Q-003 | AI 以本地规则模拟，建议可解释、采纳、修改或忽略。 | AI 价值与交互状态 | T1 | 用户 | 已决定 |
| Q-004 | 采用版本化 localStorage 保持虚构演示状态，并提供重置与种子场景入口。 | 技术实现与演示复现 | T4 | 用户 | 已决定 |
| Q-005 | 参会人员取消预约的时点、状态、名额和通知后果。 | 预约、日程、通知、容量 | T2 | 用户 | 已决定 |
| Q-006 | 参会人员拒绝会务调整时，申请的后续状态和同步影响。 | 审核、日程、通知、凭证 | T2 | 用户 | 已决定 |
