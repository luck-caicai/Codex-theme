# Codex Desktop Theme Pack

这个仓库同时提供两套互不干扰的 Codex Desktop 主题：

| 主题 | 平台 | 安装方式 | 状态 |
|---|---|---|---|
| **Totoro Night / 龙猫夜色** | Windows | 运行时注入，不修改官方包 | 推荐，已验证 `26.707.9981.0`、`26.715.2305.0`、`26.715.4045.0` |
| **Miku v4 / 初音未来** | macOS | 校验后修改并备份 `app.asar` | 已验证 `26.707.72221 (5307)` |

![Totoro Night](skill/codex-totoro-theme/payload/assets/totoro-night-full-canvas.webp)

## Windows 龙猫主题

龙猫主题包含黑色、炭灰和深森林配色、空任务快捷面板、透明背景动画宠物、支持上传自定义首页及工作页背景的顶部主题选择面板，以及 Free / Plus / Pro 三套左侧目录文字颜色。

### 开箱安装

准备条件：

- Windows 10/11
- Microsoft Store 版 Codex Desktop
- Node.js 已加入 `PATH`
- 当前支持 Codex `26.707.9981.0`、`26.715.2305.0`、`26.715.4045.0`

在仓库根目录运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-totoro-windows.ps1
```

脚本会完成三件事：

1. 校验 Codex 包版本与完整 `app.asar` SHA-256。
2. 安装 Skill 到 `$HOME\.codex\skills\codex-totoro-theme`。
3. 创建开始菜单快捷方式 `Codex - Totoro Night`。

安装后先正常退出所有 Codex 窗口，再从开始菜单打开 `Codex - Totoro Night`。主题启动器不会自动结束 Codex，也不会写入 Microsoft Store 的受保护安装目录。

也可以从 Releases 下载 `codex-totoro-theme.skill`，交给 Codex 并说：

> 安装这个 Skill，然后安装并启动 Windows 龙猫夜色主题。

### 切换目录配色

打开 **左下角头像 > 目录配色**，选择 `Free`、`Plus` 或 `Pro`。点击后立即生效并自动保存；手动选择不会被后续套餐识别覆盖。

### 切换原版与龙猫主题

点击窗口最上方中央的主题名称打开选择面板，再选择 **Codex 原版** 或 **龙猫夜色**。选择会自动保存，并同步到宠物浮窗和快捷窗口；切到原版时会恢复官方样式与原生宠物，但保留主题入口。后续主题统一追加到数据驱动的 `themeCatalog`，不需要重做顶部控件。

### 使用自定义背景

1. 点击窗口顶部中央的主题名称，打开主题选择面板。
2. 点击面板最下方的 **自定义图片**，选择 PNG、JPEG 或 WebP 图片。
3. 图片会自动居中裁切为 `1240 × 889`、压缩为 WebP 并保存在本机，不会上传到网络；处理完成后自动切换到 **龙猫夜色**，重启 Codex 后仍然生效。
4. 需要换图时点击 **更换自定义图片**；需要恢复内置龙猫背景时点击 **恢复默认**。

推荐使用 `1536 × 1024` 或更高分辨率的横向图片，文件不超过 `15 MB`。主体放在中间偏右、四周保留约 10% 裁切空间，左侧约 55% 尽量保持简洁，不要在图片里放重要文字。自定义图片会同时替换空任务首页横幅和任务工作页画布背景；工作页继续保留暗色遮罩以保证文字可读，不改变侧边栏和龙猫宠物。

### 检查、启动与恢复

```powershell
$theme = "$HOME\.codex\skills\codex-totoro-theme\scripts\windows-theme.ps1"

# 查看兼容性、快捷方式和主题会话状态
powershell -NoProfile -ExecutionPolicy Bypass -File $theme check

# 完全退出 Codex 后启动主题
powershell -NoProfile -ExecutionPolicy Bypass -File $theme start

# 移除实时主题和主题快捷方式
powershell -NoProfile -ExecutionPolicy Bypass -File $theme restore
```

官方 Codex 快捷方式始终打开官方外观。运行 `restore` 后无需恢复 ASAR 备份，因为 Windows 方案从未修改它。

### 为什么必须限制构建版本

Codex Desktop 更新可能改变 DOM、资源槽和窗口结构。启动器同时检查包版本与 `app.asar` 哈希；任一不匹配都会拒绝启动主题，避免旧选择器遮挡按钮或破坏布局。适配新版本时请按 [Windows 维护与踩坑记录](skill/codex-totoro-theme/references/windows-maintenance.md) 的清单重新验证，不能简单删除版本门禁。

## macOS 初音未来主题

![Codex Miku Theme v4](assets/codex-miku-theme-v4-full-canvas-pet.png)

从 Releases 下载 `codex-miku-theme.skill`，交给 Codex 并说：

> 安装这个 Skill，然后帮我安装初音未来主题和配套宠物。

也可以手动解压到 `~/.agents/skills`。安装或恢复前必须使用 `Command + Q` 完全退出 Codex：

```bash
open scripts/install.command
open scripts/restore.command
```

macOS 安装器只接受已验证的 `26.707.72221 (5307)`，会校验完整 ASAR、CSS 容量、背景资源槽和宠物槽，并在 `~/Library/Application Support/Codex Miku Theme/backups/` 保存带 SHA-256 的原始备份。官方升级后不要用旧备份覆盖新构建。

## 开发与发布

需要 Node.js 20 或更新版本：

```bash
npm test
```

在 Windows 生成可分发龙猫 Skill：

```powershell
npm run package:totoro
```

输出文件为 `output/codex-totoro-theme.skill`，压缩包第一层是 `codex-totoro-theme/`，可以直接交给 Codex 安装。

主要目录：

```text
skill/codex-miku-theme/       macOS 初音主题 Skill
skill/codex-totoro-theme/     Windows 龙猫主题 Skill
scripts/                      安装、恢复、打包和素材脚本
test/                         ASAR、主题和 Skill 结构测试
output/                       可分发 .skill 文件
```

## 许可与声明

源代码使用 [MIT License](LICENSE)。本项目是非官方同人主题，与 OpenAI、Crypton Future Media、Studio Ghibli 及其合作方无隶属或背书关系。MIT 许可证不授予角色名称、形象、商标或视觉素材的额外权利，详见 [NOTICE](NOTICE.md)。

## 作者渠道

AI 会员相关信息可通过作者公众号了解：

<img src="assets/wx.png" width="240" alt="作者公众号">
