# 代码审查报告（2026-04-05）

## 结论摘要

当前项目已经具备 Tauri 脚手架的基础形态，但距离“可复用、可扩展、可发布”的完整脚手架还有明显差距。主要问题集中在跨平台稳定性、设置体系一致性、测试与发布链路。

## 已修复问题

1. `src-tauri/src/lib.rs`
- 问题：Windows API 直接全局引入，会导致非 Windows 平台编译失败。
- 修复：增加 `cfg(target_os = "windows")` 条件编译，并提供非 Windows 的窗口唤起实现。

2. `src-tauri/src/lib.rs`
- 问题：声明了自启动隐藏参数 `--justtodo-autostart-hidden`，但启动时未消费。
- 修复：`setup` 阶段检测参数并隐藏主窗口。

3. `src/components/About.tsx`
- 问题：更新弹窗 `onClose` 为空函数，用户无法关闭。
- 修复：增加本地状态控制弹窗打开/关闭。

4. `src/components/settings-ui/Settings.tsx`
- 问题：自动启动开关初始值不读取系统真实状态。
- 修复：页面加载时调用 `isEnabled()` 同步实际状态。

5. `src/components/Home.tsx`
- 问题：组件命名与文件语义不一致（`Home.tsx` 内部函数名为 `About`）。
- 修复：更正为 `Home` 并清理占位文案。

## 高优先级待办（P0）

1. 统一设置存储层
- 现状：`localStorage` + `src-tauri/src/app/default/settings.json` 混用。
- 建议：统一到 `tauri-plugin-store`，并定义设置 schema + 默认值迁移策略。

2. 统一许可证与元数据
- 现状：`package.json` 为 `GNU GPLv3`，`Cargo.toml(workspace)` 为 `MIT`。
- 风险：对外分发时合规风险高。

3. 最小权限与能力清单审计
- 现状：已有 capability，但缺少权限说明与安全边界文档。
- 建议：给出每个插件权限使用场景与最小授权原则。

## 中优先级待办（P1）

1. 发布流水线（GitHub Actions）
- lint/test/build/release/update-metadata 自动化

2. 自动更新发布规范
- 版本号规范、签名流程、回滚策略、稳定版/灰度版通道

3. 测试体系完善
- 前端单测覆盖率门槛
- Rust 集成测试
- 基础 E2E（首启、设置、更新提示、单实例）

## 低优先级待办（P2）

1. 模板化能力
- 一键替换应用名、Bundle ID、更新源、作者信息

2. 文档化
- 贡献指南、架构图、FAQ、常见故障定位

## 验证说明

本次未执行完整 `pnpm build/test`，因为当前环境缺少 Node 依赖安装（`tsc`/`vitest` 命令不可用）。Rust 侧 `cargo check` 通过。
