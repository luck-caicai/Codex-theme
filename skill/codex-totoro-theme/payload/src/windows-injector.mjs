import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";


const PAYLOAD_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ASSET_ROOT = join(PAYLOAD_ROOT, "assets");
const STYLE_ID = "codex-totoro-night-theme";
const SWITCH_STYLE_ID = "codex-totoro-theme-switch-style";
const SWITCH_ID = "totoro-night-theme-switch";
const SWITCH_CSS = `
#totoro-night-theme-switch {
  -webkit-app-region: no-drag;
  position: fixed;
  top: 4px;
  left: 50%;
  z-index: 70;
  width: 156px;
  transform: translateX(-50%);
  pointer-events: auto;
  box-sizing: border-box;
}
#totoro-night-theme-switch button {
  -webkit-app-region: no-drag;
  font-family: system-ui, sans-serif;
  letter-spacing: 0;
  cursor: pointer;
  box-sizing: border-box;
}
#totoro-night-theme-switch .totoro-theme-picker-trigger {
  display: inline-flex;
  align-items: center;
  width: 156px;
  height: 28px;
  min-width: 0;
  padding: 0 9px;
  border: 1px solid rgba(151, 166, 155, .28);
  border-radius: 6px;
  background: rgba(17, 21, 18, .94);
  box-shadow: 0 2px 10px rgba(0, 0, 0, .24);
  color: #edf1ed;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}
#totoro-night-theme-switch .totoro-theme-picker-trigger:hover,
#totoro-night-theme-switch .totoro-theme-picker-trigger[aria-expanded="true"] {
  background: rgba(255, 255, 255, .08);
}
#totoro-night-theme-switch .totoro-theme-picker-prefix {
  color: #8f9992;
  margin-right: 6px;
}
#totoro-night-theme-switch .totoro-theme-picker-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  white-space: nowrap;
  flex: 1;
}
#totoro-night-theme-switch button:focus-visible {
  outline: 2px solid #d8ba67;
  outline-offset: -2px;
}
#totoro-night-theme-switch .totoro-theme-picker-panel {
  position: absolute;
  top: 34px;
  left: 50%;
  width: 286px;
  padding: 7px;
  transform: translateX(-50%);
  border: 1px solid rgba(151, 166, 155, .26);
  border-radius: 7px;
  background: rgba(17, 21, 18, .98);
  box-shadow: 0 12px 32px rgba(0, 0, 0, .42);
  backdrop-filter: blur(16px) saturate(.86);
  box-sizing: border-box;
}
#totoro-night-theme-switch .totoro-theme-picker-panel[hidden] {
  display: none;
}
#totoro-night-theme-switch .totoro-theme-picker-heading {
  display: block;
  padding: 4px 7px 7px;
  color: #929b95;
  font: 500 11px/1 system-ui, sans-serif;
}
#totoro-night-theme-switch .totoro-theme-picker-option {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 48px;
  padding: 7px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #e8ece9;
  text-align: left;
}
#totoro-night-theme-switch .totoro-theme-picker-option:hover {
  background: rgba(255, 255, 255, .07);
}
#totoro-night-theme-switch .totoro-theme-picker-option[aria-checked="true"] {
  background: rgba(93, 123, 96, .24);
}
#totoro-night-theme-switch .totoro-theme-picker-swatch {
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, .32);
  border-radius: 3px;
  box-sizing: border-box;
}
#totoro-night-theme-switch .totoro-theme-picker-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}
#totoro-night-theme-switch .totoro-theme-picker-name {
  overflow: hidden;
  color: #eef1ef;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#totoro-night-theme-switch .totoro-theme-picker-description {
  overflow: hidden;
  color: #949e97;
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#totoro-night-theme-switch .totoro-theme-picker-current {
  display: none;
  color: #d8ba67;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}
#totoro-night-theme-switch .totoro-theme-picker-option[aria-checked="true"] .totoro-theme-picker-current {
  display: inline;
}
#totoro-night-theme-switch .totoro-theme-custom-background {
  margin-top: 6px;
  padding: 8px 7px 2px;
  border-top: 1px solid rgba(151, 166, 155, .2);
}
#totoro-night-theme-switch .totoro-theme-custom-actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 6px;
}
#totoro-night-theme-switch .totoro-theme-custom-button {
  min-width: 0;
  height: 32px;
  padding: 0 10px;
  border: 1px solid rgba(151, 166, 155, .28);
  border-radius: 5px;
  background: rgba(255, 255, 255, .05);
  color: #e8ece9;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}
#totoro-night-theme-switch .totoro-theme-custom-button:hover {
  background: rgba(255, 255, 255, .1);
}
#totoro-night-theme-switch .totoro-theme-custom-button:disabled {
  cursor: wait;
  opacity: .62;
}
#totoro-night-theme-switch .totoro-theme-custom-upload {
  width: 100%;
}
#totoro-night-theme-switch .totoro-theme-custom-reset {
  color: #b6beb8;
}
#totoro-night-theme-switch .totoro-theme-custom-reset[hidden],
#totoro-night-theme-switch .totoro-theme-custom-input,
#totoro-night-theme-switch .totoro-theme-custom-status[hidden] {
  display: none;
}
#totoro-night-theme-switch .totoro-theme-custom-status {
  display: block;
  margin-top: 6px;
  color: #91b59b;
  font: 400 10px/1.35 system-ui, sans-serif;
  overflow-wrap: anywhere;
}
#totoro-night-theme-switch .totoro-theme-custom-status[data-error="true"] {
  color: #d99a8a;
}
@media (max-width: 760px) {
  #totoro-night-theme-switch {
    right: 142px;
    left: auto;
    transform: none;
  }
  #totoro-night-theme-switch .totoro-theme-picker-panel {
    right: 0;
    left: auto;
    transform: none;
  }
}
`;
const STATE_DIR = join(
  process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"),
  "Codex Totoro Night",
);
const STATE_PATH = join(STATE_DIR, "runtime.json");
const LOG_PATH = join(STATE_DIR, "injector.log");


function parseArgs(argv) {
  const result = { mode: "install", port: 0 };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--port") result.port = Number(argv[++index]);
    else if (argv[index] === "--remove") result.mode = "remove";
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  if (!Number.isInteger(result.port) || result.port < 1 || result.port > 65535) {
    throw new Error("A valid --port is required");
  }
  return result;
}


function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}


function dataUri(bytes, mimeType) {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}


async function loadTheme() {
  const [source, hero, sidebar, pet, injector] = await Promise.all([
    readFile(join(PAYLOAD_ROOT, "src", "totoro-night.css"), "utf8"),
    readFile(join(ASSET_ROOT, "totoro-night-full-canvas.webp")),
    readFile(join(ASSET_ROOT, "totoro-night-sidebar-wash.webp")),
    readFile(join(ASSET_ROOT, "totoro-pet-spritesheet.webp")),
    readFile(fileURLToPath(import.meta.url)),
  ]);
  const petUri = dataUri(pet, "image/webp");
  const css = source
    .replaceAll("__TOTORO_NIGHT_HERO__", dataUri(hero, "image/webp"))
    .replaceAll("__TOTORO_NIGHT_SIDEBAR__", dataUri(sidebar, "image/webp"))
    .replaceAll("__TOTORO_NIGHT_PET__", petUri);
  const hashes = {
    css: sha256(Buffer.from(source)),
    hero: sha256(hero),
    injector: sha256(injector),
    pet: sha256(pet),
  };
  return {
    css,
    pet: petUri,
    revision: `${hashes.injector}:${hashes.css}:${hashes.hero}:${hashes.pet}`,
    sha256: hashes,
  };
}


function buildInstallExpression(theme) {
  const install = (cssText, switchCss, petUri, styleId, switchStyleId, switchId, revision) => {
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      (document.head ?? document.documentElement).append(style);
    }
    style.textContent = cssText;
    style.dataset.totoroNightRevision = revision;

    let switchStyle = document.getElementById(switchStyleId);
    if (!switchStyle) {
      switchStyle = document.createElement("style");
      switchStyle.id = switchStyleId;
      (document.head ?? document.documentElement).append(switchStyle);
    }
    switchStyle.textContent = switchCss;
    switchStyle.dataset.totoroNightRevision = revision;

    const previous = globalThis.__codexTotoroNight;
    previous?.observer?.disconnect();
    clearInterval(previous?.companionTimer);
    if (previous?.storageHandler) removeEventListener("storage", previous.storageHandler);
    if (previous?.outsideHandler) removeEventListener("pointerdown", previous.outsideHandler, true);
    if (previous?.keyHandler) removeEventListener("keydown", previous.keyHandler, true);
    document.getElementById("totoro-night-dashboard")?.remove();
    document.getElementById("totoro-night-actions")?.remove();
    document.getElementById(switchId)?.remove();
    document.querySelectorAll(".totoro-night-pet").forEach((element) => element.remove());
    document.querySelectorAll(".totoro-night-plan-picker").forEach((element) => element.remove());

    const homeAttributes = [
      "data-totoro-night-home",
      "data-totoro-night-home-stage",
      "data-totoro-night-home-intro",
      "data-totoro-night-composer-stage",
      "data-totoro-night-native-title",
      "data-totoro-night-suggestions-wrap",
      "data-totoro-night-suggestions",
      "data-totoro-night-suggestions-grid",
    ];
    const clearHome = () => {
      document.getElementById("totoro-night-dashboard")?.remove();
      document.getElementById("totoro-night-actions")?.remove();
      for (const attribute of homeAttributes) {
        document.querySelectorAll(`[${attribute}]`).forEach((element) => {
          element.removeAttribute(attribute);
        });
      }
    };
    clearHome();

    const initialRoute = new URLSearchParams(location.search).get("initialRoute");
    const isAvatarWindow = initialRoute === "/avatar-overlay";
    const themedPetBackground = `url("${petUri}")`;

    const restorePet = () => {
      document.querySelectorAll("[data-totoro-night-source]").forEach((element) => {
        const original = element.dataset.totoroNightSource;
        if (original && original !== petUri) element.src = original;
        if (element.hasAttribute("data-totoro-night-source-set")) {
          element.srcset = element.dataset.totoroNightSourceSet;
          delete element.dataset.totoroNightSourceSet;
        }
        delete element.dataset.totoroNightSource;
      });
      document.querySelectorAll("[data-totoro-night-background]").forEach((element) => {
        const original = element.dataset.totoroNightBackground;
        const priority = element.dataset.totoroNightBackgroundPriority || "";
        element.style.removeProperty("background-image");
        if (original && original !== themedPetBackground) {
          element.style.setProperty("background-image", original, priority);
        }
        delete element.dataset.totoroNightBackground;
        delete element.dataset.totoroNightBackgroundPriority;
      });
    };
    restorePet();

    const applyPet = (element) => {
      if (!isAvatarWindow || !(element instanceof Element)) return;
      if (element.matches(".codex-avatar-root")) {
        if (!element.hasAttribute("data-totoro-night-background")) {
          element.dataset.totoroNightBackground = element.style.backgroundImage || "";
          element.dataset.totoroNightBackgroundPriority = element.style.getPropertyPriority(
            "background-image",
          );
        }
        if (
          element.style.backgroundImage !== themedPetBackground
          || element.style.getPropertyPriority("background-image") !== "important"
        ) {
          element.style.setProperty("background-image", themedPetBackground, "important");
        }
        return;
      }
      if (element instanceof HTMLImageElement && /codex-spritesheet/i.test(element.currentSrc || element.src)) {
        if (!element.hasAttribute("data-totoro-night-source")) {
          element.dataset.totoroNightSource = element.src;
          element.dataset.totoroNightSourceSet = element.srcset;
        }
        element.srcset = "";
        element.src = petUri;
      }
      const background = getComputedStyle(element).backgroundImage;
      if (/codex-spritesheet/i.test(background)) {
        if (!element.hasAttribute("data-totoro-night-background")) {
          element.dataset.totoroNightBackground = element.style.backgroundImage || "";
          element.dataset.totoroNightBackgroundPriority = element.style.getPropertyPriority(
            "background-image",
          );
        }
        element.style.setProperty("background-image", `url("${petUri}")`, "important");
      }
    };

    const scan = (root) => {
      applyPet(root);
      root.querySelectorAll?.("*").forEach(applyPet);
    };
    const addCompanion = (composer) => {
      composer.classList.add("totoro-night-composer-host");
      let companion = composer.querySelector(":scope > .totoro-night-pet");
      if (!companion) {
        companion = document.createElement("button");
        companion.type = "button";
        companion.className = "totoro-night-pet";
        companion.title = "逗逗龙猫";
        companion.setAttribute("aria-label", "逗逗龙猫");
        const sprite = document.createElement("span");
        sprite.className = "totoro-night-pet-sprite";
        sprite.setAttribute("aria-hidden", "true");
        companion.append(sprite);
        companion.addEventListener("click", () => {
          clearTimeout(companion.__totoroNightTimer);
          companion.dataset.state = "hopping";
          companion.__totoroNightTimer = setTimeout(() => {
            const thinking = Boolean(composer.querySelector(
              'button[aria-label="停止"], button[aria-label="Stop"]',
            ));
            companion.dataset.state = thinking ? "thinking" : "idle";
          }, 900);
        });
        composer.append(companion);
      }
      if (companion.dataset.state !== "hopping") {
        const thinking = Boolean(composer.querySelector(
          'button[aria-label="停止"], button[aria-label="Stop"]',
        ));
        companion.dataset.state = thinking ? "thinking" : "idle";
      }
    };

    const addDashboard = () => {
      const homeIcon = document.querySelector('[data-testid="home-icon"]');
      const composer = document.querySelector("[data-codex-composer-root]");
      const conversation = document.querySelector(
        "[data-app-action-timeline-scroll], [data-user-message-bubble], [data-local-conversation-final-assistant]",
      );
      if (!homeIcon || !composer || conversation) {
        clearHome();
        return;
      }

      const nativeTitle = homeIcon.parentElement?.parentElement;
      const intro = nativeTitle?.parentElement;
      const stage = intro?.parentElement;
      const home = stage?.parentElement;
      const composerStage = composer.parentElement?.parentElement?.parentElement;
      const suggestions = intro?.querySelector('section[class*="home-suggestions"]');
      const suggestionsWrap = suggestions?.parentElement;
      const suggestionsGrid = suggestions?.querySelector('[class*="grid-cols-"]');
      if (!nativeTitle || !intro || !stage || !home || !composerStage) {
        clearHome();
        return;
      }

      home.setAttribute("data-totoro-night-home", "true");
      stage.setAttribute("data-totoro-night-home-stage", "true");
      intro.setAttribute("data-totoro-night-home-intro", "true");
      composerStage.setAttribute("data-totoro-night-composer-stage", "true");
      nativeTitle.setAttribute("data-totoro-night-native-title", "true");
      suggestionsWrap?.setAttribute("data-totoro-night-suggestions-wrap", "true");
      suggestions?.setAttribute("data-totoro-night-suggestions", "true");
      suggestionsGrid?.setAttribute("data-totoro-night-suggestions-grid", "true");

      if (!document.getElementById("totoro-night-dashboard")) {
        const dashboard = document.createElement("section");
        dashboard.id = "totoro-night-dashboard";
        dashboard.setAttribute("aria-labelledby", "totoro-night-heading");

        const copy = document.createElement("div");
        copy.className = "totoro-night-dashboard-copy";
        const label = document.createElement("span");
        label.className = "totoro-night-dashboard-label";
        label.textContent = "TOTORO NIGHT";
        const heading = document.createElement("h2");
        heading.id = "totoro-night-heading";
        heading.textContent = "我们在夜林里做些什么？";
        const description = document.createElement("p");
        description.textContent = "让龙猫陪你读代码、搭功能，也陪你把问题修好。";
        copy.append(label, heading, description);
        dashboard.append(copy);
        intro.insertBefore(dashboard, nativeTitle);
      }

      if (!document.getElementById("totoro-night-actions")) {
        const prompts = [
          ["读懂代码", "探索并理解当前项目的代码结构，说明核心模块、数据流、运行方式和需要关注的风险。"],
          ["构建功能", "在当前项目中构建我接下来描述的新功能、应用或工具。先确认现有实现和约束，再直接完成并验证。"],
          ["审查改进", "审查当前项目或我指定的变更，优先指出错误、风险、行为回归和缺失测试，并给出可执行的修改建议。"],
          ["修复问题", "定位并修复我接下来描述的问题或失败。复现根因，实施最小修复，并运行相关验证。"],
        ];
        const nativeIcons = [...(suggestions?.querySelectorAll("button") ?? [])]
          .map((button) => button.querySelector("svg"));
        const actions = document.createElement("div");
        actions.id = "totoro-night-actions";
        actions.setAttribute("aria-label", "快速开始");
        prompts.forEach(([title, prompt], index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "totoro-night-action";
          button.dataset.totoroNightCard = String(index + 1);
          button.title = `${title}：点击填入提示词`;

          const icon = document.createElement("span");
          icon.className = "totoro-night-action-icon";
          icon.setAttribute("aria-hidden", "true");
          const nativeIcon = nativeIcons.length === prompts.length
            ? nativeIcons[index]?.cloneNode(true)
            : null;
          if (nativeIcon) icon.append(nativeIcon);
          else icon.textContent = String(index + 1).padStart(2, "0");

          const label = document.createElement("span");
          label.className = "totoro-night-action-label";
          label.textContent = title;
          button.append(icon, label);
          button.addEventListener("click", () => {
            const editor = document.querySelector('[data-codex-composer="true"]');
            if (!editor) return;
            editor.focus();
            const selection = getSelection();
            const range = document.createRange();
            range.selectNodeContents(editor);
            selection?.removeAllRanges();
            selection?.addRange(range);
            if (!document.execCommand("insertText", false, prompt)) {
              editor.textContent = prompt;
              editor.dispatchEvent(new InputEvent("input", {
                bubbles: true,
                data: prompt,
                inputType: "insertText",
              }));
            }
            editor.focus();
          });
          actions.append(button);
        });
        intro.insertBefore(actions, nativeTitle);
      }
    };

    const planKey = "codex-totoro-night-plan";
    const planManualKey = "codex-totoro-night-plan-manual";
    const plans = new Set(["free", "plus", "pro"]);
    const setPlan = (plan, manual = false) => {
      if (!plans.has(plan)) return;
      document.documentElement.dataset.totoroNightPlan = plan;
      localStorage.setItem(planKey, plan);
      if (manual) localStorage.setItem(planManualKey, "true");
      document.querySelectorAll(".totoro-night-plan-option").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.plan === plan));
      });
    };
    const syncPlan = () => {
      let plan = localStorage.getItem(planKey);
      if (!plans.has(plan)) plan = "free";
      if (localStorage.getItem(planManualKey) === "true") {
        setPlan(plan);
        return;
      }
      for (const menu of document.querySelectorAll('[role="menu"]')) {
        const menuItems = [...menu.querySelectorAll('[role="menuitem"]')];
        const text = menuItems
          .map((element) => element.innerText || element.textContent || "")
          .join(" ")
          .toLowerCase();
        const upgrading = /upgrade|\u5347\u7ea7|\u30a2\u30c3\u30d7\u30b0\u30ec\u30fc\u30c9/.test(text);
        const labels = menuItems.flatMap((item) => [item, ...item.querySelectorAll("*")])
          .filter((element) => element.children.length === 0)
          .map((element) => (element.textContent || "").trim().toLowerCase());
        if (upgrading && /\bplus\b/.test(text)) plan = "free";
        else if (upgrading && /\bpro\b/.test(text)) plan = "plus";
        else if (labels.includes("pro")) plan = "pro";
        else if (labels.includes("plus")) plan = "plus";
        else if (labels.includes("free")) plan = "free";
      }
      setPlan(plan);
    };
    const addPlanPicker = () => {
      for (const menu of document.querySelectorAll('[role="menu"]')) {
        const rect = menu.getBoundingClientRect();
        const menuItems = menu.querySelectorAll('[role="menuitem"]');
        if (rect.left > 320 || rect.bottom < innerHeight - 80 || menuItems.length < 4) continue;
        if (menu.querySelector(".totoro-night-plan-picker")) continue;

        const picker = document.createElement("div");
        picker.className = "totoro-night-plan-picker";
        picker.setAttribute("role", "group");
        picker.setAttribute("aria-label", "\u76ee\u5f55\u914d\u8272");
        const label = document.createElement("span");
        label.className = "totoro-night-plan-picker-label";
        label.textContent = "\u76ee\u5f55\u914d\u8272";
        const options = document.createElement("div");
        options.className = "totoro-night-plan-options";
        for (const plan of plans) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "totoro-night-plan-option";
          button.dataset.plan = plan;
          button.textContent = plan[0].toUpperCase() + plan.slice(1);
          button.setAttribute("aria-pressed", String(
            document.documentElement.dataset.totoroNightPlan === plan,
          ));
          button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setPlan(plan, true);
          });
          options.append(button);
        }
        picker.append(label, options);
        menuItems[0].insertAdjacentElement("afterend", picker);
      }
    };

    const themeModeKey = "codex-totoro-theme-mode";
    const customHeroKey = "codex-totoro-custom-hero";
    const customHeroProperty = "--totoro-night-hero-image";
    const customHeroWidth = 1240;
    const customHeroHeight = 889;
    const customHeroTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    const customHeroMaxBytes = 15 * 1024 * 1024;
    const themeCatalog = [
      {
        mode: "official",
        name: "Codex 原版",
        description: "官方界面与原生宠物",
        color: "#dfe3e0",
      },
      {
        mode: "totoro",
        name: "龙猫夜色",
        description: "黑色森林与动画龙猫",
        color: "#4b614c",
      },
    ];
    const themeModes = new Set(themeCatalog.map((theme) => theme.mode));
    const isMainWindow = initialRoute === null;
    let themeMode = localStorage.getItem(themeModeKey);
    if (!themeModes.has(themeMode)) themeMode = "totoro";

    const getCustomHero = () => {
      const value = localStorage.getItem(customHeroKey);
      return value?.startsWith("data:image/webp;base64,") ? value : null;
    };

    const applyCustomHero = () => {
      const value = getCustomHero();
      if (value && themeMode === "totoro") {
        document.documentElement.style.setProperty(customHeroProperty, `url("${value}")`);
      } else {
        document.documentElement.style.removeProperty(customHeroProperty);
      }
      return Boolean(value);
    };

    const updateCustomHeroControls = () => {
      const switcher = document.getElementById(switchId);
      const upload = switcher?.querySelector(".totoro-theme-custom-upload");
      const reset = switcher?.querySelector(".totoro-theme-custom-reset");
      const hasCustomHero = Boolean(getCustomHero());
      if (upload) upload.textContent = hasCustomHero ? "更换自定义图片" : "自定义图片";
      if (reset) reset.hidden = !hasCustomHero;
    };

    const setCustomHeroStatus = (message, isError = false) => {
      const status = document.querySelector(`#${switchId} .totoro-theme-custom-status`);
      if (!status) return;
      status.textContent = message;
      status.dataset.error = String(isError);
      status.hidden = !message;
    };

    const createCustomHero = (file) => new Promise((resolve, reject) => {
      if (!customHeroTypes.has(file.type.toLowerCase())) {
        reject(new Error("请选择 PNG、JPEG 或 WebP 图片"));
        return;
      }
      if (file.size > customHeroMaxBytes) {
        reject(new Error("图片不能超过 15 MB"));
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.addEventListener("load", () => {
        try {
          if (!image.naturalWidth || !image.naturalHeight) throw new Error("无法读取图片尺寸");
          if (image.naturalWidth * image.naturalHeight > 40_000_000) {
            throw new Error("图片像素过大，请先缩小后再上传");
          }
          const scale = Math.max(
            customHeroWidth / image.naturalWidth,
            customHeroHeight / image.naturalHeight,
          );
          const sourceWidth = customHeroWidth / scale;
          const sourceHeight = customHeroHeight / scale;
          const sourceX = (image.naturalWidth - sourceWidth) / 2;
          const sourceY = (image.naturalHeight - sourceHeight) / 2;
          const canvas = document.createElement("canvas");
          canvas.width = customHeroWidth;
          canvas.height = customHeroHeight;
          const context = canvas.getContext("2d", { alpha: false });
          if (!context) throw new Error("当前窗口无法处理图片");
          context.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            customHeroWidth,
            customHeroHeight,
          );
          const dataUrl = canvas.toDataURL("image/webp", 0.86);
          if (!dataUrl.startsWith("data:image/webp;base64,")) {
            throw new Error("当前窗口不支持 WebP 图片处理");
          }
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      }, { once: true });
      image.addEventListener("error", () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("图片已损坏或格式不受支持"));
      }, { once: true });
      image.src = objectUrl;
    });

    const clearThemeDom = () => {
      clearHome();
      document.querySelectorAll(".totoro-night-pet").forEach((element) => element.remove());
      document.querySelectorAll(".totoro-night-plan-picker").forEach((element) => element.remove());
      document.querySelectorAll(".totoro-night-composer-host").forEach((element) => {
        element.classList.remove("totoro-night-composer-host");
      });
      document.documentElement.removeAttribute("data-totoro-night-plan");
      document.documentElement.style.removeProperty(customHeroProperty);
      restorePet();
    };

    const updateThemeSwitcher = () => {
      const switcher = document.getElementById(switchId);
      const currentTheme = themeCatalog.find((theme) => theme.mode === themeMode);
      const value = switcher?.querySelector(".totoro-theme-picker-value");
      if (value && currentTheme) value.textContent = currentTheme.name;
      switcher?.querySelectorAll(".totoro-theme-picker-option").forEach((button) => {
        button.setAttribute("aria-checked", String(button.dataset.themeMode === themeMode));
      });
      updateCustomHeroControls();
    };

    const closeThemePicker = (restoreFocus = false) => {
      const switcher = document.getElementById(switchId);
      const trigger = switcher?.querySelector(".totoro-theme-picker-trigger");
      const panel = switcher?.querySelector(".totoro-theme-picker-panel");
      if (!trigger || !panel) return;
      trigger.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      if (restoreFocus) trigger.focus();
    };

    const addThemeSwitcher = () => {
      if (!isMainWindow) return;
      if (document.getElementById(switchId)) {
        updateThemeSwitcher();
        return;
      }
      const switcher = document.createElement("div");
      switcher.id = switchId;
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "totoro-theme-picker-trigger";
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", `${switchId}-panel`);
      trigger.title = "选择 Codex 主题";
      const prefix = document.createElement("span");
      prefix.className = "totoro-theme-picker-prefix";
      prefix.textContent = "主题";
      const value = document.createElement("span");
      value.className = "totoro-theme-picker-value";
      trigger.append(prefix, value);

      const panel = document.createElement("div");
      panel.id = `${switchId}-panel`;
      panel.className = "totoro-theme-picker-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "选择主题");
      panel.hidden = true;
      const heading = document.createElement("span");
      heading.className = "totoro-theme-picker-heading";
      heading.textContent = "选择主题";
      panel.append(heading);
      const themeOptions = document.createElement("div");
      themeOptions.setAttribute("role", "radiogroup");
      themeOptions.setAttribute("aria-label", "主题列表");
      panel.append(themeOptions);

      for (const theme of themeCatalog) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "totoro-theme-picker-option";
        button.dataset.themeMode = theme.mode;
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", "false");
        button.title = `切换到${theme.name}`;
        const swatch = document.createElement("span");
        swatch.className = "totoro-theme-picker-swatch";
        swatch.style.background = theme.color;
        const copy = document.createElement("span");
        copy.className = "totoro-theme-picker-copy";
        const name = document.createElement("span");
        name.className = "totoro-theme-picker-name";
        name.textContent = theme.name;
        const description = document.createElement("span");
        description.className = "totoro-theme-picker-description";
        description.textContent = theme.description;
        copy.append(name, description);
        const current = document.createElement("span");
        current.className = "totoro-theme-picker-current";
        current.textContent = "当前";
        button.append(swatch, copy, current);
        button.addEventListener("pointerdown", (event) => event.stopPropagation());
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          setThemeMode(theme.mode);
          closeThemePicker();
        });
        themeOptions.append(button);
      }

      const custom = document.createElement("div");
      custom.className = "totoro-theme-custom-background";
      const actions = document.createElement("div");
      actions.className = "totoro-theme-custom-actions";
      const upload = document.createElement("button");
      upload.type = "button";
      upload.className = "totoro-theme-custom-button totoro-theme-custom-upload";
      upload.textContent = "自定义图片";
      upload.title = "选择自定义主题背景图片";
      const reset = document.createElement("button");
      reset.type = "button";
      reset.className = "totoro-theme-custom-button totoro-theme-custom-reset";
      reset.textContent = "恢复默认";
      reset.title = "恢复龙猫默认背景";
      const input = document.createElement("input");
      input.type = "file";
      input.className = "totoro-theme-custom-input";
      input.accept = "image/png,image/jpeg,image/webp";
      const status = document.createElement("span");
      status.className = "totoro-theme-custom-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.hidden = true;
      upload.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        input.value = "";
        input.click();
      });
      input.addEventListener("change", async () => {
        const [file] = input.files ?? [];
        if (!file) return;
        upload.disabled = true;
        setCustomHeroStatus("正在处理图片...");
        try {
          const dataUrl = await createCustomHero(file);
          try {
            localStorage.setItem(customHeroKey, dataUrl);
          } catch {
            throw new Error("本地存储空间不足，请换一张图片");
          }
          setThemeMode("totoro");
          applyCustomHero();
          updateCustomHeroControls();
          setCustomHeroStatus("自定义背景已保存");
        } catch (error) {
          setCustomHeroStatus(error instanceof Error ? error.message : "图片处理失败", true);
        } finally {
          upload.disabled = false;
          input.value = "";
        }
      });
      reset.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        localStorage.removeItem(customHeroKey);
        applyCustomHero();
        updateCustomHeroControls();
        setCustomHeroStatus("已恢复龙猫默认背景");
      });
      actions.append(upload, reset);
      custom.append(actions, input, status);
      panel.append(custom);
      trigger.addEventListener("pointerdown", (event) => event.stopPropagation());
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const open = trigger.getAttribute("aria-expanded") !== "true";
        trigger.setAttribute("aria-expanded", String(open));
        panel.hidden = !open;
      });
      switcher.append(trigger, panel);
      document.body.append(switcher);
      updateThemeSwitcher();
    };

    const syncTotoroUi = () => {
      scan(document.documentElement);
      syncPlan();
      addPlanPicker();
      addDashboard();
      document.querySelectorAll("[data-codex-composer-root]").forEach(addCompanion);
    };

    const setThemeMode = (mode, persist = true) => {
      if (!themeModes.has(mode)) return;
      themeMode = mode;
      if (persist) localStorage.setItem(themeModeKey, mode);
      style.disabled = mode === "official";
      document.documentElement.dataset.totoroThemeMode = mode;
      if (mode === "official") clearThemeDom();
      else {
        applyCustomHero();
        syncTotoroUi();
      }
      addThemeSwitcher();
      updateThemeSwitcher();
    };

    const storageHandler = (event) => {
      if (event.key === themeModeKey && themeModes.has(event.newValue)) {
        setThemeMode(event.newValue, false);
      } else if (event.key === customHeroKey) {
        applyCustomHero();
        updateCustomHeroControls();
      }
    };
    addEventListener("storage", storageHandler);
    const outsideHandler = (event) => {
      const switcher = document.getElementById(switchId);
      if (switcher && !switcher.contains(event.target)) closeThemePicker();
    };
    const keyHandler = (event) => {
      if (event.key === "Escape") closeThemePicker(true);
    };
    if (isMainWindow) {
      addEventListener("pointerdown", outsideHandler, true);
      addEventListener("keydown", keyHandler, true);
    }

    const syncUi = () => {
      addThemeSwitcher();
      if (themeMode === "totoro") syncTotoroUi();
    };
    setThemeMode(themeMode, false);
    const companionTimer = setInterval(() => {
      syncUi();
    }, 500);

    let queued = false;
    const pendingRecords = [];
    const observer = new MutationObserver((records) => {
      pendingRecords.push(...records);
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const batch = pendingRecords.splice(0);
        for (const record of batch) {
          if (themeMode !== "totoro") continue;
          if (record.type === "attributes") applyPet(record.target);
          record.addedNodes.forEach(scan);
        }
        syncUi();
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["aria-label", "class", "src", "style"],
      childList: true,
      subtree: true,
    });
    globalThis.__codexTotoroNight = {
      companionTimer,
      observer,
      outsideHandler,
      keyHandler,
      revision,
      setThemeMode,
      storageHandler,
      styleId,
      syncUi,
    };
    return {
      dashboard: Boolean(document.getElementById("totoro-night-dashboard")),
      installed: true,
      revision,
      themeMode,
      title: document.title,
    };
  };
  return `(${install})(${JSON.stringify(theme.css)},${JSON.stringify(SWITCH_CSS)},${JSON.stringify(theme.pet)},${JSON.stringify(STYLE_ID)},${JSON.stringify(SWITCH_STYLE_ID)},${JSON.stringify(SWITCH_ID)},${JSON.stringify(theme.revision)})`;
}


function buildRemoveExpression(theme) {
  const remove = (styleId, switchStyleId, switchId, petUri) => {
    const themedPetBackground = `url("${petUri}")`;
    document.getElementById(styleId)?.remove();
    document.getElementById(switchStyleId)?.remove();
    document.getElementById(switchId)?.remove();
    globalThis.__codexTotoroNight?.observer?.disconnect();
    clearInterval(globalThis.__codexTotoroNight?.companionTimer);
    if (globalThis.__codexTotoroNight?.storageHandler) {
      removeEventListener("storage", globalThis.__codexTotoroNight.storageHandler);
    }
    if (globalThis.__codexTotoroNight?.outsideHandler) {
      removeEventListener("pointerdown", globalThis.__codexTotoroNight.outsideHandler, true);
    }
    if (globalThis.__codexTotoroNight?.keyHandler) {
      removeEventListener("keydown", globalThis.__codexTotoroNight.keyHandler, true);
    }
    document.getElementById("totoro-night-dashboard")?.remove();
    document.getElementById("totoro-night-actions")?.remove();
    document.querySelectorAll(".totoro-night-pet").forEach((element) => element.remove());
    document.querySelectorAll(".totoro-night-plan-picker").forEach((element) => element.remove());
    document.querySelectorAll(".totoro-night-composer-host").forEach((element) => {
      element.classList.remove("totoro-night-composer-host");
    });
    for (const attribute of [
      "data-totoro-night-home",
      "data-totoro-night-home-stage",
      "data-totoro-night-home-intro",
      "data-totoro-night-composer-stage",
      "data-totoro-night-native-title",
      "data-totoro-night-suggestions-wrap",
      "data-totoro-night-suggestions",
      "data-totoro-night-suggestions-grid",
    ]) {
      document.querySelectorAll(`[${attribute}]`).forEach((element) => {
        element.removeAttribute(attribute);
      });
    }
    document.querySelectorAll("[data-totoro-night-source]").forEach((element) => {
      const original = element.dataset.totoroNightSource;
      if (original && original !== petUri) element.src = original;
      if (element.hasAttribute("data-totoro-night-source-set")) {
        element.srcset = element.dataset.totoroNightSourceSet;
        delete element.dataset.totoroNightSourceSet;
      }
      delete element.dataset.totoroNightSource;
    });
    document.querySelectorAll("[data-totoro-night-background]").forEach((element) => {
      const original = element.dataset.totoroNightBackground;
      const priority = element.dataset.totoroNightBackgroundPriority || "";
      element.style.removeProperty("background-image");
      if (original && original !== themedPetBackground) {
        element.style.setProperty("background-image", original, priority);
      }
      delete element.dataset.totoroNightBackground;
      delete element.dataset.totoroNightBackgroundPriority;
    });
    document.documentElement.removeAttribute("data-totoro-night-plan");
    document.documentElement.removeAttribute("data-totoro-theme-mode");
    document.documentElement.style.removeProperty("--totoro-night-hero-image");
    delete globalThis.__codexTotoroNight;
    return { removed: true, title: document.title };
  };
  return `(${remove})(${JSON.stringify(STYLE_ID)},${JSON.stringify(SWITCH_STYLE_ID)},${JSON.stringify(SWITCH_ID)},${JSON.stringify(theme.pet)})`;
}


function evaluate(webSocketUrl, expression) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const timer = setTimeout(() => {
      socket.close();
      reject(new Error("CDP evaluation timed out"));
    }, 5000);
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({
        id: 1,
        method: "Runtime.evaluate",
        params: { awaitPromise: true, expression, returnByValue: true },
      }));
    });
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id !== 1) return;
      clearTimeout(timer);
      socket.close();
      if (message.error || message.result?.exceptionDetails) {
        reject(new Error(message.error?.message ?? "Runtime evaluation failed"));
      } else {
        resolve(message.result?.result?.value);
      }
    });
    socket.addEventListener("error", () => {
      clearTimeout(timer);
      reject(new Error("CDP WebSocket connection failed"));
    });
  });
}


async function targets(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
    signal: AbortSignal.timeout(1500),
  });
  if (!response.ok) throw new Error(`CDP returned HTTP ${response.status}`);
  return (await response.json()).filter(
    (target) => target.webSocketDebuggerUrl && ["page", "webview", "iframe"].includes(target.type),
  );
}


async function appendLog(message) {
  await mkdir(STATE_DIR, { recursive: true });
  const line = `[${new Date().toISOString()}] ${message}\n`;
  const previous = await readFile(LOG_PATH, "utf8").catch(() => "");
  await writeFile(LOG_PATH, `${previous}${line}`.slice(-64_000), "utf8");
}


async function main() {
  const options = parseArgs(process.argv.slice(2));
  const theme = await loadTheme();
  const installExpression = buildInstallExpression(theme);
  const removeExpression = buildRemoveExpression(theme);
  const probeExpression = `document.getElementById(${JSON.stringify(STYLE_ID)})?.dataset.totoroNightRevision === ${JSON.stringify(theme.revision)} && document.getElementById(${JSON.stringify(SWITCH_STYLE_ID)})?.dataset.totoroNightRevision === ${JSON.stringify(theme.revision)}`;
  let connected = false;
  let misses = 0;

  await mkdir(STATE_DIR, { recursive: true });
  await writeFile(
    STATE_PATH,
    `${JSON.stringify({ mode: options.mode, pid: process.pid, port: options.port, startedAt: new Date().toISOString(), revision: theme.revision, ...theme.sha256 }, null, 2)}\n`,
    "utf8",
  );

  for (;;) {
    try {
      const currentTargets = await targets(options.port);
      if (currentTargets.length === 0) throw new Error("No inspectable Codex targets yet");
      connected = true;
      misses = 0;
      for (const target of currentTargets) {
        try {
          if (options.mode === "remove") {
            await evaluate(target.webSocketDebuggerUrl, removeExpression);
          } else if (!(await evaluate(target.webSocketDebuggerUrl, probeExpression))) {
            await evaluate(target.webSocketDebuggerUrl, installExpression);
            await appendLog(`Injected ${target.type} ${target.id}`);
          }
        } catch (error) {
          await appendLog(`Skipped ${target.id}: ${error.message}`);
        }
      }
      if (options.mode === "remove") return;
    } catch (error) {
      misses += 1;
      if (connected && misses >= 8) return;
      if (!connected && misses >= 45) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}


main().catch(async (error) => {
  await appendLog(`Fatal: ${error.message}`).catch(() => {});
  console.error(`Codex Totoro Night: ${error.message}`);
  process.exitCode = 1;
});
