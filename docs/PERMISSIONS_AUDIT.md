# Tauri 权限审计（P0）

更新时间：2026-04-06

## 当前 capability

文件：`src-tauri/capabilities/default.json`

已启用权限：

- `core:default`
- `opener:default`
- `log:default`
- `autostart:default`
- `store:default`
- `updater:default`

## 权限用途与风险

1. `core:default`
- 用途：Tauri 基础窗口与事件能力。
- 风险：基础权限集合，风险可控。

2. `opener:default`
- 用途：在系统默认浏览器中打开外链（About 页、Release Notes）。
- 风险：外链跳转，需确保链接来源可信。

3. `log:default`
- 用途：前后端日志记录。
- 风险：可能记录敏感信息，需避免输出 token/密钥/用户隐私。

4. `autostart:default`
- 用途：设置页控制开机自启动。
- 风险：系统级行为，需明确告知用户并支持关闭。

5. `store:default`
- 用途：本地配置持久化（language/theme/autostart）。
- 风险：本地文件篡改会影响行为，已通过 schema 归一化降低风险。

6. `updater:default`
- 用途：检查并安装更新。
- 风险：更新通道安全高度敏感，必须保持签名校验与 HTTPS 端点。

## 最小授权结论

- 当前权限集合与现有功能一致，没有明显冗余权限。
- 未启用文件系统、Shell 执行等高风险权限，基线较好。

## 后续建议

1. 如果后续新增文件读写能力，必须按目录粒度最小化授权。
2. `opener` 建议增加允许域名白名单（仅项目官方站点）。
3. 对 `updater` 增加发布流程校验：签名存在、`latest.json` 与版本号一致。
