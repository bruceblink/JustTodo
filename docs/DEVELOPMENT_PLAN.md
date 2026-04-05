# JustTodo 脚手架开发计划

目标：把当前项目升级为“可复制、可维护、可发布”的完整 Tauri 2.0 脚手架。

## 当前进度（2026-04-06）

1. P0-1 配置与状态统一：已完成
- 已迁移到 `tauri-plugin-store`
- 已引入 `settings.schema.json` 与迁移逻辑

2. P0-2 元数据与许可证统一：已完成
- 已统一版本到 `0.1.0`
- 已统一许可证为 `AGPL-3.0-or-later`

3. P0-3 权限与安全基线：已完成（第一版）
- 已产出 `docs/PERMISSIONS_AUDIT.md`

4. P0-4 多平台最小可用验证：进行中
- 已在 CI 增加前端跨平台冒烟（Windows/macOS/Linux）
- Rust `cargo check` 当前先在 Windows 运行

5. P1-1 初始化模板系统：进行中
- 已新增 `scripts/init-template.mjs`
- 已支持一键替换 app/package/bundle/author/repository/updater endpoint

6. P1-2 模块化目录约定：已完成基础骨架
- 已新增 `src/features` / `src/shared` / `src/platform`
- 已补充路径别名 `@features/*`、`@shared/*`、`@platform/*`

7. P1-3 可选能力开关：进行中
- 已增加 `scaffold.features`（`updater`/`autostart`）
- 已实现前端按开关隐藏/禁用对应能力

## 里程碑概览

1. M1（1-2 周）：工程稳定化
2. M2（2-3 周）：脚手架化与模板能力
3. M3（2 周）：质量与发布体系
4. M4（持续）：生态完善与版本运营

## M1 - 工程稳定化（P0）

1. 配置与状态统一
- 统一设置存储到 `tauri-plugin-store`
- 定义 `settings.schema.json`（默认值、类型、版本号）
- 加入配置迁移器（向后兼容）

2. 元数据与许可证统一
- 统一 `package.json` / Cargo workspace / `tauri.conf.json` 的版本、license、仓库地址
- 制定版本策略（SemVer）

3. 权限与安全基线
- 梳理 capability 与 plugin 权限
- 输出权限说明文档，减少默认授权范围

4. 多平台最小可用验证
- Windows/macOS/Linux 进行 `tauri dev` + `tauri build` 冒烟测试

验收标准：
- 首次启动、设置读写、语言切换、自动更新检查、单实例全部可用
- 三平台至少通过开发模式运行（构建可按资源情况分阶段完成）

## M2 - 脚手架化与模板能力（P1）

1. 初始化模板系统
- 增加 `scripts/init-template.*`
- 支持替换：应用名、包名、Bundle Identifier、作者、仓库地址、更新地址

2. 模块化目录约定
- `features/*`（按业务模块组织）
- `shared/*`（通用组件、hooks、utils）
- `platform/*`（Tauri 交互与平台封装）

3. 可选能力开关
- 可配置开启：自动更新、自启动、托盘、日志上报、崩溃报告

验收标准：
- 新项目可通过一次命令完成初始化
- 初始化后的项目可直接 `pnpm tauri dev`

## M3 - 质量与发布体系（P1）

1. CI 流水线（GitHub Actions）
- PR: lint + typecheck + test
- main/release: build + package + release artifacts

2. 更新发布链路
- 自动生成并发布 `latest.json`
- 校验签名与更新元数据
- 增加失败回滚流程文档

3. 测试体系补齐
- 前端：Vitest 覆盖率阈值（如 70%）
- Rust：核心逻辑单测/集成测试
- E2E：首启、设置变更、单实例、更新提示

验收标准：
- 合并 PR 前自动质量门禁
- 打 tag 后可自动生成可更新版本

## M4 - 生态完善（P2）

1. 文档体系
- 架构说明
- 插件接入指南
- 常见问题与排障指南

2. 开发者体验
- `pnpm new:app`（由当前模板生成新项目）
- Demo feature（待办模块、设置模块）

3. 运营策略
- release note 模板
- LTS 与 breaking change 策略

## 任务拆分建议（立即可执行）

1. 第一周
- 完成配置统一与设置 schema
- 统一许可证与版本策略
- 完成最小权限审计

2. 第二周
- 完成模板初始化脚本
- 增加 CI（lint/typecheck/test）

3. 第三周
- 完成自动更新发布链路
- 补齐关键 E2E 场景

## 风险与应对

1. 多平台构建环境复杂
- 解决：先保证 Windows 主线，macOS/Linux 通过 CI runner 分步补齐

2. 自动更新链路不稳定
- 解决：先做手工可验证流程，再自动化发布

3. 模板通用性不足
- 解决：先定义最小模板参数集，再逐步扩展
