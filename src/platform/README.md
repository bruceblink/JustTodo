# Platform

放置平台层封装（Tauri API、插件调用、系统交互）。

建议把直接依赖 `@tauri-apps/*` 的代码收敛到此目录，
上层 feature 通过平台适配层间接调用，便于测试与替换实现。
