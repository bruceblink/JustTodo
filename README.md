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
│  ├─ features/              # 按业务模块组织
│  ├─ hooks/                 # 业务 hooks（设置、更新等）
│  ├─ locale/                # i18n 文案
│  ├─ platform/              # 平台层封装（Tauri/API）
│  ├─ shared/                # 通用复用层
│  ├─ types/                 # 类型定义
│  └─ utils/                 # 工具方法
├─ src-tauri/
│  ├─ src/                   # Rust 入口与后端逻辑
│  ├─ capabilities/          # Tauri 权限能力
│  └─ tauri.conf.json        # Tauri 配置
└─ docs/
   ├─ CODE_AUDIT.md          # 审查报告
   ├─ DEVELOPMENT_PLAN.md    # 开发计划
   └─ PERMISSIONS_AUDIT.md   # 权限审计
```

## 自动更新配置说明

当前使用 `tauri-plugin-updater` + GitHub Releases：

- 更新元数据地址在 `src-tauri/tauri.conf.json > plugins.updater.endpoints`
- 需要正确配置公钥 `plugins.updater.pubkey`
- 发布时需生成并上传更新工件（包含 `latest.json`）

## 模板初始化

可使用下面命令把当前模板改为你的项目信息：

```bash
pnpm init:template -- \
  --app-name "MyDesktopApp" \
  --package-name "my-desktop-app" \
  --bundle-id "com.example.mydesktopapp" \
  --author-name "Your Name" \
  --author-email "you@example.com" \
  --author-url "https://example.com" \
  --repository-url "https://github.com/your-org/my-desktop-app" \
  --sponsoring-url "https://buymeacoffee.com/yourname" \
  --enable-updater true \
  --enable-autostart true
```

说明：

- `--updater-endpoint` 可选；未提供时自动使用 `${repository-url}/releases/latest/download/latest.json`
- `--enable-updater` / `--enable-autostart` 可选，默认都为 `true`
- 可先加 `--dry-run` 查看将应用的参数，不写文件

## 作为“完整脚手架”还需要补齐什么

请按以下文档推进：

- 开发计划：`docs/DEVELOPMENT_PLAN.md`
- 代码审查：`docs/CODE_AUDIT.md`

核心缺口：

- 自动更新发布流水线（release、签名、`latest.json`）仍需打通
- 缺少 E2E 与 Rust 集成测试
- 缺少模板化生成功能（项目名、包名、标识符、更新源一键替换）

## 许可证

`AGPL-3.0-or-later`
