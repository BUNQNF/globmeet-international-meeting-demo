# GlobMeet 国际智能会议协同平台

第二期研发智能挑战赛，场景二「国际化智能会议预约系统」的竞赛交付仓库。

公开仓库：[github.com/BUNQNF/globmeet-international-meeting-demo](https://github.com/BUNQNF/globmeet-international-meeting-demo)

GlobMeet 面向跨国参会人员与会务人员，围绕会议查询、预约申请、会务审核、跨时区日程、变更通知和现场核验建立可演示闭环。参会端为移动优先界面；会务端为桌面工作台。项目使用本地演示数据和浏览器 `localStorage` 模拟跨页面同步，不包含真实登录、音视频、服务端或外部 AI 调用。

## 赛题对应

场景二要求解决多语言沟通、日程冲突、信息同步不及时及多角色协作问题，并要求覆盖：

- 会议查询、预约申请、审核确认、日程管理、变更通知、现场核验；
- 多语言、跨时区、移动端适配，以及 AI 支持的会议推荐和行程安排；
- 参会人员、会务人员、系统管理员的权限边界，以及预约和变更的同步、追溯与隐私边界；
- 完整产品设计方案和可交互、可演示的高保真 Demo。

赛题原文与统一考核方案保留在仓库根目录，便于评审核对。

## 在线演示

GlobMeet 提供两套面向不同用户角色的高保真演示界面：参会者使用移动端完成会议浏览、预约和日程协同；会务人员使用桌面后台完成待办审核、会议管理和现场核验。

| 参会者移动端 | 会务人员后台管理端 |
| --- | --- |
| <a href="https://bunqnf.github.io/globmeet-international-meeting-demo/?screen=discover&scenario=seed"><img src="https://raw.githubusercontent.com/BUNQNF/globmeet-international-meeting-demo/main/public/globmeet-mobile-demo-qr.png" width="220" alt="GlobMeet 参会者移动端演示二维码"></a><br>请使用手机扫码查看 | 请在电脑浏览器中打开：[会务人员后台管理页面](https://bunqnf.github.io/globmeet-international-meeting-demo/?screen=review&role=organizer&scenario=pending) |

## 交付清单

考核方案要求以六个维度验收。以下材料均以仓库内可直接打开的 Markdown 文档交付。

| 考核维度 | 交付内容 | 直接查看 |
| --- | --- | --- |
| 产品场景分析 | 业务分析、用户分析、问题定义、业务目标 | [项目简报](docs/project-brief.md) · [产品场景分析](docs/product-scenario-analysis.md) |
| 产品方案设计 | 产品定位、PRD、功能框架、业务流程、版本规划 | [PRD 需求文档](docs/requirements.md) · [产品功能架构](docs/product-architecture.md) · [流程原型](docs/prototype.md) |
| UX 体验设计 | Figma 页面截图、信息架构、页面需求、交互说明、高保真视觉、Design System | **Figma 页面截图：** [会议发现](docs/assets/figma-keyframes/01-attendee-meetings.png) · [预约冲突与建议](docs/assets/figma-keyframes/02-attendee-schedule.png) · [会务审核](docs/assets/figma-keyframes/03-organizer-review.png) · [日程与现场核验](docs/assets/figma-keyframes/04-attendee-notice-checkin.png)<br>**设计文档：** [页面需求](docs/page-requirements.md) · [页面功能清单](docs/page-function-inventory.md) · [页面流程原型](docs/page-flow-prototype.md) · [视觉说明](docs/visual-spec.md) · [设计系统](design-system/globmeet/MASTER.md) · [产品 UI 覆盖规则](design-system/globmeet/pages/product-ui.md) |
| HTML 交付实现 | 可交互高保真 Demo、源码与技术实现说明 | [技术就绪说明](docs/technical-readiness.md) · [验收记录](docs/acceptance.md) · [参会者移动端](https://bunqnf.github.io/globmeet-international-meeting-demo/?screen=discover&scenario=seed) · [会务人员后台](https://bunqnf.github.io/globmeet-international-meeting-demo/?screen=review&role=organizer&scenario=pending) |
| 交付规范 | 交付对照、验收证据、公开部署地址 | [交付对照表](docs/delivery-map.md) · [验收记录](docs/acceptance.md) · [GitHub Pages 在线演示](https://bunqnf.github.io/globmeet-international-meeting-demo/) |
| AI 应用能力 | 自研四视图全栈同步工作流、AI 产研协同方法与创新价值 | [AI 应用与创新亮点：四视图全栈同步工作流](docs/ai-application-innovation.md) |

## 全部文档导航

- [项目简报](docs/project-brief.md)
- [AI 应用与创新亮点：四视图全栈同步工作流](docs/ai-application-innovation.md)
- [产品场景分析](docs/product-scenario-analysis.md)
- [市场案例与信息架构调研](docs/market-ia-benchmark.md)
- [PRD 需求文档](docs/requirements.md)
- [产品功能架构](docs/product-architecture.md)
- [流程原型](docs/prototype.md)
- [页面需求](docs/page-requirements.md)
- [页面功能清单](docs/page-function-inventory.md)
- [页面流程原型](docs/page-flow-prototype.md)
- [视觉说明](docs/visual-spec.md)
- [设计系统](design-system/globmeet/MASTER.md)
- [产品 UI 覆盖规则](design-system/globmeet/pages/product-ui.md)
- [技术就绪说明](docs/technical-readiness.md)
- [验收记录](docs/acceptance.md)
- [交付对照表](docs/delivery-map.md)

## 目录说明

```text
src/                         React + TypeScript 高保真 Demo 源码
docs/                        需求、流程、视觉、技术与验收过程材料
  assets/figma-keyframes/    已确认 Figma 关键帧 PNG
design-system/               视觉令牌与产品界面覆盖规则
public/                      README 手机端演示二维码
第二期研发智能挑战赛｜*.html  赛题与考核方案原文
```

## 产品与技术说明

- 产品定位：面向国际会议预约与执行协同的轻量化智能会议平台。
- 功能闭环：发现会议 → 申请预约 → 会务审核 → 跨时区日程 → 变更通知 → 现场核验 → 操作留痕。
- AI 表现：以可解释的本地规则模拟冲突提示、会议推荐和行程建议，适合稳定演示；不声称调用真实模型。
- 数据边界：所有人名、会议、地点和记录均为虚构演示数据，保存范围仅为当前浏览器的 `localStorage`。
- 技术栈：React、TypeScript、Vite、Lucide Icons、CSS 响应式布局。

详细可检查材料见 [交付对照表](docs/delivery-map.md) 与 [验收记录](docs/acceptance.md)。
