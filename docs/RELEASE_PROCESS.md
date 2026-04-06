# 发布与自动更新流程

更新时间：2026-04-06

## 目标

通过 GitHub Actions 自动构建并发布 Tauri 安装包与 updater 工件（`latest.json` 等）。

## 前置条件

1. 在仓库 Secrets 配置（仅当 `package.json.scaffold.features.updater=true` 时必须）：
- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`

2. `src-tauri/tauri.conf.json` 中已正确配置：
- `plugins.updater.endpoints`
- `plugins.updater.pubkey`
- `bundle.createUpdaterArtifacts = true`

## 触发方式

1. 推送 tag（推荐）：

```bash
git tag v0.1.1
git push origin v0.1.1
```

2. 手动触发：
- GitHub Actions 页面选择 `publish` 工作流 -> `Run workflow`

## 工作流行为

文件：`.github/workflows/publish.yml`

- 在 Windows / Linux / macOS 三个平台构建
- 使用 `tauri-apps/tauri-action@v0.5` 发布 Draft Release
- 预检版本一致性（`package.json` / `src-tauri/package.json` / `tauri.conf.json` / `Cargo.toml`）
- 根据 `package.json.scaffold.features.updater` 自动决定是否生成 updater 工件
- 当 updater 启用时，自动校验签名 secrets 是否存在

## 发布检查清单

1. Draft Release 包含三平台安装包
2. Release 附件中包含 updater 工件（含 `latest.json`）
3. 应用内点击“检查更新”可识别新版本
4. 验签通过并可完成更新安装

## 回滚建议

1. 发现严重问题时，不发布 Draft
2. 如已发布稳定版，立刻发布更高版本 hotfix
3. 仅在明确不可恢复时回退更新通道
