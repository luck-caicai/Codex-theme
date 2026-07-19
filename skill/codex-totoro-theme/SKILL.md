---
name: codex-totoro-theme
description: Install, launch, check, repair, switch, customize, or restore the Windows Codex Desktop Totoro Night theme, empty-task dashboard, user-uploaded home and workspace background, animated Totoro pet, extensible top-bar theme picker, and Free/Plus/Pro sidebar color switcher. Use when a user wants a comfortable black, charcoal, deep-forest Codex appearance, a custom local background image, a visual quick-start home, a Totoro companion, instant or multi-theme selection, plan-specific directory colors, theme status checks, troubleshooting, or a reversible return to the official appearance. Includes exact-build safety checks.
---

# Codex Totoro Night

Resolve every path relative to this `SKILL.md`. Use `scripts/windows-theme.ps1` from PowerShell. The workflow injects CSS and the Totoro spritesheet at runtime; it does not edit the protected Microsoft Store package or `app.asar`.

| User intent | Action |
|---|---|
| Install the launcher | `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/windows-theme.ps1 install` |
| Check compatibility | `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/windows-theme.ps1 check` |
| Launch themed Codex | Fully quit Codex, then run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/windows-theme.ps1 start` or open `Codex - Totoro Night` from Start |
| Restore official appearance | `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/windows-theme.ps1 restore`, then restart Codex normally |
| Diagnose or adapt a build | Read `references/windows-maintenance.md` before changing selectors, assets, or compatibility gates |

Treat a package version or ASAR hash mismatch as a compatibility boundary. Do not weaken the checks. Never kill Codex automatically. If Codex is already running, ask the user to quit it normally before using the themed launcher.

The launcher binds Chromium debugging to a random loopback-only port, keeps a small injector process alive for page reloads, and exits after Codex closes. On an empty task, the injector restyles Codex's native quick actions as a Totoro dashboard; after a task starts, it removes the dashboard while keeping the dark theme and companion. The official package remains unchanged, so restoration requires no ASAR backup.

Switch sidebar directory colors from the directory-color section in the bottom-left profile menu. Free, Plus, and Pro use distinct neutral, green, and gold palettes. A manual choice is stored in Codex local storage and survives restarts; do not replace this with account-name guessing.

Switch themes from the centered picker in the 36px application menu bar. Define available themes in the `themeCatalog` array so future themes appear as panel options without rebuilding the control. Keep the picker in its own always-on stylesheet so it remains usable while the active theme stylesheet is disabled. Synchronize the selected mode across Codex auxiliary windows through the `storage` event, but render the picker only in the main window.

Upload a custom theme background from **Custom image** at the bottom of the theme picker. Accept PNG, JPEG, or WebP files up to 15 MB; recommend a 1536 x 1024 landscape source with the subject centered to the right. The injector center-crops the image to 1240 x 889, encodes it as WebP, stores it locally, and applies it to both the empty-task banner and active workspace canvas. **Restore default** removes the custom background without changing the pet or sidebar artwork. Read `references/windows-maintenance.md` before changing upload limits, crop behavior, or storage keys.

Report the compatibility result and confirm that the Start menu launcher exists. Remind the user that the official Codex shortcut still opens the untouched appearance.
