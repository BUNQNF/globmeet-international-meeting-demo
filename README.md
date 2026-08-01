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

| 手机端扫码访问 | 电脑端浏览器访问 |
| --- | --- |
| <a href="https://bunqnf.github.io/globmeet-international-meeting-demo/"><img src="https://raw.githubusercontent.com/BUNQNF/globmeet-international-meeting-demo/main/public/globmeet-mobile-demo-qr.png" width="220" alt="GlobMeet 手机端演示二维码"></a><br>扫码打开移动端参会页面 | [打开 GlobMeet 在线 Demo](https://bunqnf.github.io/globmeet-international-meeting-demo/) |

## 交付清单

考核方案要求以六个维度验收。下表明确每项最终提交文件、当前仓库依据与交付状态。`待导出` 表示已有内容基础，但仍必须按指定格式放入对应目录后才能作为最终竞赛材料提交。

| 考核维度 | 最终交付物 | 最终格式 / 存放位置 | 仓库现有依据 | 状态 |
| --- | --- | --- | --- | --- |
| 产品场景分析 | 业务分析、用户分析、问题定义、业务目标 | `deliverables/01-prd/GlobMeet-PRD.docx` 的场景分析章节 | `docs/product-scenario-analysis.md` | 待导出 Word |
| 产品方案设计 | PRD、产品框架图、业务流程图、版本规划 | Word PRD；限时手绘产品框架图按考试现场要求另行提交；流程图/规划作为 PRD 附件 | `docs/requirements.md`、`docs/product-architecture.md`、`docs/prototype.md` | PRD 待导出；手绘图待现场提交 |
| UX 体验设计 | 信息架构、交互说明、高保真 UI、Design System | 原型源文件放入 `deliverables/02-prototype/`；PNG UI 图放入 `deliverables/03-ui/` | `docs/page-flow-prototype.md`、`docs/page-requirements.md`、`docs/visual-spec.md`、Figma 关键帧链接 | 待放入最终文件 |
| HTML 交付实现 | 可交互高保真 Demo、源码 | 源码在本仓库；提交压缩包位于 `deliverables/04-source-code/` | `src/`、`package.json`、`docs/technical-readiness.md` | Demo 可运行；源码 ZIP 已生成 |
| 交付规范 | UI 图、交付清单、部署地址、技术说明 | 本 README、`deliverables/README.md`、[在线演示](https://bunqnf.github.io/globmeet-international-meeting-demo/) | `docs/acceptance.md`、`docs/delivery-map.md` | 在线 Demo 已部署 |
| AI 应用能力 | AI 能力说明、创新亮点、AI 交互资产/工作记录 | PRD AI 章节与 `deliverables/05-ai-evidence/` | `docs/requirements.md`、`docs/prototype.md` | 待整理为最终附件 |

> 说明：竞赛方案明确要求产品框架图为限时手绘，须依照现场时间节点提交；该图不能以仓库内自动生成文件替代。

## 目录说明

```text
src/                         React + TypeScript 高保真 Demo 源码
docs/                        需求、流程、视觉、技术与验收过程材料
design-system/               视觉令牌与产品界面覆盖规则
deliverables/                最终竞赛提交物的固定落位目录
  01-prd/                    PRD Word 文档
  02-prototype/              原型源文件及导出说明
  03-ui/                     高保真 UI 图片导出
  04-source-code/            源码压缩包
  05-ai-evidence/            AI 设计说明、亮点和交互资产
第二期研发智能挑战赛｜*.html  赛题与考核方案原文
```

## 产品与技术说明

- 产品定位：面向国际会议预约与执行协同的轻量化智能会议平台。
- 功能闭环：发现会议 → 申请预约 → 会务审核 → 跨时区日程 → 变更通知 → 现场核验 → 操作留痕。
- AI 表现：以可解释的本地规则模拟冲突提示、会议推荐和行程建议，适合稳定演示；不声称调用真实模型。
- 数据边界：所有人名、会议、地点和记录均为虚构演示数据，保存范围仅为当前浏览器的 `localStorage`。
- 技术栈：React、TypeScript、Vite、Lucide Icons、CSS 响应式布局。

详细可检查材料见 [`docs/delivery-map.md`](docs/delivery-map.md)、[`docs/acceptance.md`](docs/acceptance.md) 与 [`deliverables/README.md`](deliverables/README.md)。

## 评审前检查

1. 在 `deliverables/01-prd/` 放入最终的 `.docx` PRD。
2. 在 `deliverables/02-prototype/` 放入可打开的原型源文件或明确的在线原型链接说明。
3. 在 `deliverables/03-ui/` 放入命名完整的高保真 PNG 导出图。
4. 复核 `deliverables/04-source-code/` 中的源码 `.zip` 不含 `node_modules`、`dist`、`.git` 和密钥，并可按本 README 构建。
5. 在 `deliverables/05-ai-evidence/` 放入 AI 能力说明、创新说明及相关交互资产/工作记录。
6. 已部署至 [GitHub Pages](https://bunqnf.github.io/globmeet-international-meeting-demo/)；提交前在目标设备完成一次走查。
