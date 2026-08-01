# T4 技术就绪草案

**阶段状态：** 因信息架构变更重新同步，待确认  
**对应依据：** [requirements.md](requirements.md)、[prototype.md](prototype.md)、[visual-spec.md](visual-spec.md)  
**运行模式：** 竞赛 Demo；离线、本地模拟数据、无服务端

## 1. 目标与边界

- 将 T1 的 P0 规则、T2 的状态转移和 T3 的视觉基线落到一个可直接运行、可复现的前端实现方案。
- 不建设真实登录、后端、第三方日历、翻译、AI、扫码或音视频服务。
- 不把当前 Figma 关键帧当作功能范围；实现以需求和流程的状态/规则为准，视觉规范决定页面表达。

## 2. 推荐架构

| 层级 | 推荐 | 原因与边界 |
| --- | --- | --- |
| 工程 | Vite + React + TypeScript | 从空仓库快速建立可维护的单页竞赛 Demo；类型约束覆盖复杂状态机。 |
| 样式 | 原生 CSS + CSS 自定义属性 | 直接映射 T3 令牌；避免为静态视觉引入额外运行时依赖。 |
| 图标 | `lucide-react` | 与视觉规范一致，图标可访问且不依赖外部资源。 |
| 状态 | React Context + `useReducer` | 以显式领域动作处理跨角色同步，避免引入服务端状态或复杂状态库。 |
| 时间 | 浏览器 `Intl.DateTimeFormat` | 使用真实时区格式化，无须额外日期库；会议绝对时刻以 UTC 时间戳比较。 |
| 路由/预览 | URL 查询参数 + 前端视图状态 | 每个关键状态可直接打开，无须新增路由依赖。 |
| 数据 | 本地 TypeScript 数据模块 | 虚构预置会议、角色、预约和核验码；绝不请求网络。 |

## 3. 领域数据与状态模型

### 3.1 固定预置数据

- `Meeting`：主题双语、类型、主办方、地区、形式、容量、来源时区、开始/结束 UTC 时间戳、议程和变更历史。
- `Reservation`：申请编号、参会人、会议、状态、创建时间、调整信息、凭证/核验状态。
- `Notification` 与 `AuditEvent`：对象编号、操作者角色、时间、结果和可展示的最少必要信息。
- `DemoProfile`：三种演示身份及其权限范围；身份切换显式标注为演示。

### 3.2 可变应用状态

```text
AppState
  preferences: locale, timeZone, activeRole
  meetings: Meeting[]
  reservations: Reservation[]
  notifications: Notification[]
  auditEvents: AuditEvent[]
  ui: activeScreen, selectedMeetingId, filters, modal, toast
```

所有状态改变通过具名 reducer 动作完成：`SUBMIT_RESERVATION`、`APPROVE_RESERVATION`、`REJECT_RESERVATION`、`REQUEST_ADJUSTMENT`、`ACCEPT_ADJUSTMENT`、`DECLINE_ADJUSTMENT`、`CANCEL_RESERVATION`、`PUBLISH_CHANGE`、`CHECK_IN`、`MARK_NOTIFICATION_READ`、`SET_PREFERENCE`。动作先验证角色、容量、重复申请、状态前置条件和输入原因，再同步受影响的日程、通知、凭证与审计记录。

## 4. 模拟边界与确定性

- 冲突检测与容量以 UTC 时间戳和预置容量计算；语言、显示时区不参与判定。
- AI 建议为纯本地规则：根据标签、偏好、已确认日程和当前时区输出固定理由；只有“采纳”动作才写入草稿或预约路径。
- 凭证采用展示型模拟码，如 `GM-0826-019`；核验仅匹配本地预约且只允许首次有效签到。
- 角色切换不是鉴权；每个可变动作仍由权限守卫拦截，并保留不可操作说明。

## 5. 刷新与演示复现

**已确认决策：启用版本化 `localStorage` 快照。**

| 项目 | 方案 |
| --- | --- |
| 键名 | `globmeet-demo-state-v1` |
| 写入时机 | 每次成功领域动作及语言/时区/角色偏好变更后。 |
| 初始值 | 内置 `seedDemoState`，包含可演示的预约、冲突、已批准凭证和待审项。 |
| 复现方式 | 显式“重置演示数据”操作清除快照并恢复种子；URL `?scenario=seed` 强制以种子状态载入。 |
| 失败恢复 | 无法解析或版本不匹配时丢弃快照、回退种子并显示非阻断提示。 |
| 数据边界 | 仅存虚构竞赛数据；不跨设备同步、不上传、不存储个人真实信息。 |

该项对应 Q-004，作为 T4 冻结决策执行。它只保存虚构的竞赛 Demo 状态，配合重置入口保证每次演示可从同一预置场景开始。

## 6. 直达预览与响应式约定

| 目标 | 示例访问参数 | 验证意图 |
| --- | --- | --- |
| 会议 | `?screen=discover&role=attendee&scenario=seed` | 筛选、双语、时区与会议卡；运行内部键可保留 `discover`，页面文案为“会议”。 |
| 冲突与 AI | `?screen=conflict&role=attendee&scenario=conflict` | 冲突说明、替代建议及不自动写入。 |
| 日程 | `?screen=schedule&role=attendee&scenario=approved` | 时区切换、AI 建议、凭证和已签到状态。 |
| 通知 | `?screen=notice&role=attendee&scenario=changed` | 审核结果、变更和调整的未读/已读与跳转。 |
| 我的 | `?screen=my-bookings&role=attendee&scenario=approved` | 预约状态、凭证、语言/时区与演示角色偏好。 |
| 会务待办 | `?screen=review&role=organizer&scenario=pending` | 待审队列、理由校验、批准/拒绝/调整。 |
| 会务会议 | `?screen=meetings&role=organizer&scenario=changed` | 负责会议、变更预览与发布影响。 |
| 现场核验 | `?screen=checkin&role=organizer&scenario=approved` | 有效、无效、重复核验反馈。 |

- 移动优先验证 `390 x 844` 与 `375 x 812`；会务审核验证 `1440 x 900`，低于 `1024px` 转为单主列/可展开队列。
- 底部导航、模态与 Toast 必须纳入安全区，不覆盖可操作内容。

## 7. 实施与验证顺序

1. **T5-A 统一壳层与导航：** Vite 工程、设计令牌、布局外壳、参会人员“会议/日程/通知/我的”底部导航、会务“待办/会议/核验”工作区导航、语言/时区控件和视图参数。
2. **T5-B 页面静态骨架：** 按页面维度补齐会议详情/预约/冲突、日程与 AI、通知、我的预约/凭证/偏好、会务审核/变更/核验与管理员页面；四个关键帧只作为视觉风格与组件基线。
3. **T6-A 预约闭环：** 会议筛选、详情、冲突、提交、待审、审批同步与审计记录。
4. **T6-B 行程与变更：** 时区/语言、AI 建议、调整、取消、变更通知与日程一致性。
5. **T6-C 凭证与核验：** 资格限制、有效/无效/重复核验与角色权限边界。
6. **T7：** 构建、关键 URL 场景、移动/桌面截图、端到端演示路径与无敏感数据检查。

## 8. T4 验证与退出条件

- 工程、状态、数据、视觉和流程之间的所有 P0 映射均有明确实现位置与直达预览参数；页面归属遵循新一级导航，不能以 AI、记录、凭证或角色切换替代主要任务入口。
- Q-004 的持久化策略已确认，重置和异常回退行为可复现。
- 能在不使用外部网络与服务端的前提下，解释每个 P0 状态的实现、数据影响与验证方法。
- 任何实现范围外的功能均保持为明确模拟，不伪装为真实集成。
