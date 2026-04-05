# JustTodo - Tauri 2.0 脚手架

一个基于 `Tauri 2 + React + TypeScript + Vite + Mantine` 的桌面应用脚手架，内置常见的桌面能力，可作为新项目起点。

## 当前已具备能力

- `Tauri 2` 多插件集成（`autostart` / `updater` / `single-instance` / `opener` / `log`）
- 基础设置页与状态管理（`zustand`）
- `i18n` 国际化（英文、简中、繁中、柬文）
- 自动更新检查与安装（GitHub Releases `latest.json`）
- 单实例运行与窗口唤起
- React + Vitest + ESLint + Prettier 工程化基础

## 技术栈

- 前端：`React 18`、`TypeScript`、`Vite 7`、`Mantine`
- 桌面：`Tauri 2`
- 状态：`zustand`
- 国际化：`i18next + react-i18next`
- 测试：`Vitest + Testing Library`

## 快速开始

### 1. 环境准备

- Node.js `>= 20`
- `pnpm`（推荐）
- Rust stable（含 `cargo`）
- Tauri 官方依赖（Windows/macOS/Linux）

参考：<https://tauri.app/start/prerequisites/>

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发

```bash
pnpm tauri dev
```

### 4. 构建发布

```bash
pnpm tauri build
```

## 常用脚本

- `pnpm dev`：启动前端开发服务器
- `pnpm tauri dev`：启动 Tauri 开发模式
- `pnpm build`：构建前端
- `pnpm tauri build`：打包桌面应用
- `pnpm test`：运行测试
- `pnpm lint`：代码检查
- `pnpm format`：代码格式化

## 项目结构

```text
.
├─ src/                      # React 前端
│  ├─ components/            # 页面与组件
│  ├─ hooks/                 # 业务 hooks（设置、更新等）
│  ├─ locale/                # i18n 文案
│  ├─ types/                 # 类型定义
│  └─ utils/                 # 工具方法
├─ src-tauri/
│  ├─ src/                   # Rust 入口与后端逻辑
│  ├─ capabilities/          # Tauri 权限能力
│  └─ tauri.conf.json        # Tauri 配置
└─ docs/
   ├─ CODE_AUDIT.md          # 审查报告
   └─ DEVELOPMENT_PLAN.md    # 开发计划
```

## 自动更新配置说明

当前使用 `tauri-plugin-updater` + GitHub Releases：

- 更新元数据地址在 `src-tauri/tauri.conf.json > plugins.updater.endpoints`
- 需要正确配置公钥 `plugins.updater.pubkey`
- 发布时需生成并上传更新工件（包含 `latest.json`）

## 作为“完整脚手架”还需要补齐什么

请按以下文档推进：

- 开发计划：`docs/DEVELOPMENT_PLAN.md`
- 代码审查：`docs/CODE_AUDIT.md`

核心缺口：

- 设置持久化目前混用 `localStorage` 与默认 JSON，缺少统一配置层
- 缺少 CI/CD（检查、测试、打包、发布、自动更新产物）
- 缺少 E2E 与 Rust 集成测试
- 缺少模板化生成功能（项目名、包名、标识符、更新源一键替换）

## 许可证

当前仓库存在许可证信息不一致（`package.json` 为 GPLv3，Cargo workspace 为 MIT），请先统一再对外发布模板。
