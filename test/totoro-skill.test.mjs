import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const skillRoot = new URL("../skill/codex-totoro-theme/", import.meta.url);
const repoRoot = new URL("../", import.meta.url);

async function text(path) {
  return readFile(new URL(path, skillRoot), "utf8");
}

test("ships the complete Windows Totoro skill", async () => {
  const required = [
    "SKILL.md",
    "agents/openai.yaml",
    "references/windows-maintenance.md",
    "scripts/windows-theme.ps1",
    "payload/src/windows-injector.mjs",
    "payload/src/totoro-night.css",
    "payload/assets/totoro-night-full-canvas.webp",
    "payload/assets/totoro-night-sidebar-wash.webp",
    "payload/assets/totoro-pet-spritesheet.webp",
  ];

  await Promise.all(required.map((path) => access(new URL(path, skillRoot), fsConstants.R_OK)));
});

test("keeps Windows injection local, reversible, and exact-build gated", async () => {
  const launcher = await text("scripts/windows-theme.ps1");
  const injector = await text("payload/src/windows-injector.mjs");

  assert.match(launcher, /26\.707\.9981\.0/);
  assert.match(launcher, /E286D538971D7B4648692B244D80B0B1E9D227D29564275AD46F6653280D4094/);
  assert.match(launcher, /26\.715\.2305\.0/);
  assert.match(launcher, /D909924D6AE7A160AC78B88F01F9B16F079E6ABBE3F677427B752A411C6A3449/);
  assert.match(launcher, /26\.715\.4045\.0/);
  assert.match(launcher, /4F81FE8CFADD0ECD1D55A46F4B101B1DB70ABBB372B63A0120218B1D868008A3/);
  assert.match(launcher, /127\.0\.0\.1/);
  assert.match(launcher, /officialPackageModified = \$false/);
  assert.doesNotMatch(launcher, /Set-Content[^\n]*app\.asar|Copy-Item[^\n]*app\.asar/i);
  assert.doesNotMatch(injector, /https?:\/\/(?!127\.0\.0\.1)/i);
});

test("contains the regression fixes and persistent plan switcher", async () => {
  const css = await text("payload/src/totoro-night.css");
  const injector = await text("payload/src/windows-injector.mjs");
  const maintenance = await text("references/windows-maintenance.md");

  assert.match(css, /data-app-action-sidebar-project-row/);
  assert.match(css, /data-app-action-sidebar-thread-row/);
  assert.match(css, /totoro-night-plan-picker/);
  assert.equal(css.match(/var\(--totoro-night-hero-image/g)?.length, 2);
  assert.match(injector, /codex-totoro-night-plan-manual/);
  assert.match(injector, /addPlanPicker\(\)/);
  assert.match(injector, /codex-totoro-theme-mode/);
  assert.match(injector, /totoro-night-theme-switch/);
  assert.match(injector, /const themeCatalog = \[/);
  assert.match(injector, /totoro-theme-picker-panel/);
  assert.match(injector, /closeThemePicker/);
  assert.match(injector, /style\.disabled = mode === "official"/);
  assert.match(injector, /codex-totoro-custom-hero/);
  assert.match(injector, /image\/png,image\/jpeg,image\/webp/);
  assert.match(injector, /customHeroWidth = 1240/);
  assert.match(injector, /customHeroHeight = 889/);
  assert.match(injector, /canvas\.toDataURL\("image\/webp", 0\.86\)/);
  assert.match(injector, /localStorage\.setItem\(customHeroKey, dataUrl\)/);
  assert.match(injector, /localStorage\.removeItem\(customHeroKey\)/);
  assert.match(injector, /totoro-theme-custom-background/);
  assert.match(injector, /new URLSearchParams\(location\.search\)\.get\("initialRoute"\)/);
  assert.match(injector, /addEventListener\("storage", storageHandler\)/);
  assert.match(injector, /initialRoute === "\/avatar-overlay"/);
  assert.match(injector, /if \(!isAvatarWindow \|\| !\(element instanceof Element\)\) return/);
  assert.match(injector, /hasAttribute\("data-totoro-night-background"\)/);
  assert.match(injector, /original !== themedPetBackground/);
  assert.match(maintenance, /顶栏与窗口顶部之间出现空隙/);
  assert.match(maintenance, /宠物后面出现半透明矩形/);
  assert.match(maintenance, /文字覆盖右上角按钮/);
  assert.match(maintenance, /菜单已挂载但切换器不出现/);
  assert.match(maintenance, /宠物列表的所有缩略图都变成龙猫/);
  assert.match(maintenance, /自定义主题背景/);
  assert.match(maintenance, /codex-totoro-custom-hero/);
});

test("Windows repository installer can stage the skill in isolation", { skip: process.platform !== "win32" }, async () => {
  const temp = await mkdtemp(join(tmpdir(), "codex-totoro-install-"));
  const installRoot = join(temp, "skills");
  const installer = new URL("scripts/install-totoro-windows.ps1", repoRoot);

  try {
    const args = [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      fileURLToPath(installer),
      "-InstallRoot",
      installRoot,
      "-SkipLauncher",
    ];
    const first = await execFileAsync("powershell.exe", args, { windowsHide: true });
    const second = await execFileAsync("powershell.exe", args, { windowsHide: true });
    const result = JSON.parse(second.stdout);
    assert.equal(JSON.parse(first.stdout).installed, true);
    assert.equal(result.installed, true);
    assert.equal(result.launcherInstalled, false);
    await access(join(installRoot, "codex-totoro-theme", "SKILL.md"), fsConstants.R_OK);
    await access(
      join(installRoot, "codex-totoro-theme", "payload", "assets", "totoro-pet-spritesheet.webp"),
      fsConstants.R_OK,
    );
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
