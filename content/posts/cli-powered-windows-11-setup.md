+++
date = 2025-12-01T20:47:46-05:00
title = "CLI-Powered Win 11 Setup: Fast, Private, and Bloat-Free"
tags = ['Windows 11', 'CLI', 'Winget', 'Setup', 'Privacy']
categories = ['Tech']
+++

Just unboxed the new machine and the first thing I want to do is strip away all the nonsense and turn it into a productivity powerhouse, quickly. The default Windows 11 setup is slow, packed with bloat, and frankly, a bit invasive.

My goal for this setup:
1.  **Speed:** Get all my essential software installed in minutes using the CLI.
2.  **Automation:** Set up continuous auto-updating for all those apps.
3.  **Privacy:** Disable as many of the nagging, data-hungry features as possible.

Here's the reference guide for my personal Windows 11 "clean install" process.

---

## Phase 1: Bypassing the OOBE & Account Wall

The slowest part of any new Windows setup is the Out-of-Box Experience (OOBE), especially when it forces a Microsoft Account login. We're skipping that to get straight to a local, private account.

1.  When you reach the **"Let's connect you to a network"** screen during setup, stop.
2.  Hit **`Shift` + `F10`** to open the Command Prompt.
3.  Type the following command and press Enter: `OOBE\BYPASSNRO`

The system will reboot. When it comes back up, you will now see the option to set up the device *without* an internet connection and create a local user account.

---

## Phase 2: The Command-Line Software Stack (Winget)

This is where the true speed comes in. Using **Winget** (the Windows Package Manager), I install everything in one go and ensure future maintenance is trivial.

Open **Windows Terminal as Administrator** (Right-click the Start button, select *Windows Terminal (Admin)*).

### My Essentials Stack (Installed in One Line)

This command uses the `--silent` flag for a non-interactive installation.

`winget install WinMerge.WinMerge Axosoft.GitKraken Valve.Steam Postman.Postman ArminOsaj.AutoDarkMode Docker.DockerDesktop flux.flux Git.Git M2Team.NanaZip SumatraPDF.SumatraPDF EpicGames.EpicGamesLauncher Microsoft.Powertoys VideoLAN.VLC Notepad++.Notepad++ Microsoft.VisualStudioCode Mozilla.Firefox Google.Chrome CoreyButler.NVMforWindows JanDeDobbeleer.OhMyPosh --silent`

### Package List and Official Links

| Package Name | Official Website Link |
| :--- | :--- |
| **WinMerge** | [winmerge.org](https://winmerge.org/) |
| **GitKraken** | [gitkraken.com](https://www.gitkraken.com/) |
| **Steam** | [store.steampowered.com](https://store.steampowered.com/) |
| **Postman** | [postman.com](https://www.postman.com/) |
| **Auto Dark Mode** | [Microsoft Store](https://apps.microsoft.com/detail/xp8jk4hzbvf435?hl=en-US&gl=US) |
| **Docker Desktop** | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **f.lux** | [justgetflux.com](https://justgetflux.com/) |
| **Git** | [git-scm.com](https://git-scm.com/) |
| **NanaZip** | [GitHub Repository](https://github.com/M2Team/NanaZip) |
| **SumatraPDF** | [sumatrapdfreader.org](https://www.sumatrapdfreader.org/free-pdf-reader) |
| **Epic Games Launcher** | [epicgames.com](https://www.epicgames.com/site/en-US/home) |
| **Microsoft PowerToys** | [learn.microsoft.com/windows/powertoys](https://learn.microsoft.com/en-us/windows/powertoys/) |
| **VLC media player** | [videolan.org/vlc](https://www.videolan.org/vlc) |
| **Notepad++** | [notepad-plus-plus.org](https://notepad-plus-plus.org/) |
| **Visual Studio Code** | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Mozilla Firefox** | [firefox.com](https://www.firefox.com/) |
| **Google Chrome** | [google.com/chrome](https://www.google.com/chrome/what-you-make-of-it/) |
| **NVM for Windows** | [nvmnode.com](https://www.nvmnode.com/) |
| **Oh My Posh** | [ohmyposh.dev](https://ohmyposh.dev/) |

### Setting Up True Auto-Updates (Optional)

The greatest benefit of using Winget is the `upgrade --all` command. To make it truly "set and forget," we need to schedule it.

1.  Open the **Task Scheduler** app.
2.  In the Actions pane, select **Create Basic Task...**
3.  **Name:** `Winget Auto Update`
4.  **Trigger:** `Weekly` (or `Daily`).
5.  **Action:** `Start a program`
6.  **Program/script:** `powershell.exe`
7.  **Add arguments:** `-ExecutionPolicy Bypass -Command "winget upgrade --all --silent --accept-package-agreements --accept-source-agreements"`

---

## Phase 4: The Annoyance & Privacy Lockdown

This phase disables the features that compromise privacy or simply clutter the interface.

### 1. CLI Privacy (Killing Telemetry)

To stop Windows from sending optional usage and diagnostic data, we disable the core service via the command line.

Open **Windows Terminal as Administrator** and run these two commands:

{{< highlight bash >}}
# Disable the service from starting at boot
sc config diagtrack start= disabled
# Stop the service immediately
sc stop diagtrack
# Registry edit to set Telemetry to 0 (lowest possible)
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d "0" /f
{{< /highlight >}}
***Note: A system reboot is required for this service change to take full effect.***

### 2. GUI De-bloat and Clutter Reduction

Use the Settings app (press `Win` + `I`) to eliminate visual noise and "suggestions" (aka ads).

| Annoying Feature | Settings Path | Action to Take |
| :--- | :--- | :--- |
| **Ads/Tips in Settings** | *Privacy & security* > *General* | **Turn OFF all toggles** (e.g., "Show me suggested content"). |
| **System Tips/Suggestions** | *System* > *Notifications* | Scroll to **Additional settings** and **Uncheck all three boxes** (e.g., "Get tips and suggestions"). |
| **Taskbar Clutter** | *Personalization* > *Taskbar* | **Toggle OFF** `Widgets`, `Chat`, `Task View`, and **Hide** the `Search` button. |
| **Start Menu Junk** | *Personalization* > *Start* | **Turn OFF all toggles** under "Layout" to eliminate recent files, most used apps, and account notifications. |
| **Startup Apps** | *Apps* > *Startup* | Review and **Toggle OFF** any non-essential apps to maximize boot speed and performance. (Look for High Impact items). |

Anything else I forgot? Leave a comment below.
