+++
date = 2023-08-19T17:31:54-04:00
title = "Customizing my PowerShell CLI using Oh My Posh"
categories = ['Programming']
featuredImage = "/images/2023/windowsterminal.png"
+++

For years, I relied on [Cmder](https://cmder.net/) as my terminal emulator of choise. With the release of Microsoft's modern terminal, it's time to transition away from Cmder. In this article, I'll outline my approach to customizing my CLI for improved productivity:

## Prerequisites

I recommend installing as much as you can using MS Store that way auto updates are enabled. I will provide links to the various ways to install each package:

- [Oh My Posh](https://ohmyposh.dev/) is a theme engine that will be used to make it look good
  - `winget install XP8K0HKJFRXGCK`
  - <ms-windows-store://pdp/?productid=XP8K0HKJFRXGCK>
  - <https://www.microsoft.com/store/apps/XP8K0HKJFRXGCK>
- [Windows Terminal](ms-windows-store://pdp/?productid=9N0DX20HK701) is my new terminal emulator of choice
  - Winget: `winget install 9N0DX20HK701`
  - Uri: <ms-windows-store://pdp/?productid=9N0DX20HK701>
  - Url: <https://www.microsoft.com/store/apps/9N0DX20HK701>
- [PowerShell](ms-windows-store://pdp/?productid=9MZ1SNWT0N5D) the rebuilt, cross-platform version of Powershell
  - Winget: `winget install 9MZ1SNWT0N5D`
  - Uri: <ms-windows-store://pdp/?productid=9MZ1SNWT0N5D>
  - Url: <https://www.microsoft.com/store/apps/9MZ1SNWT0N5D>

## Installation

1. Download and install the [Caskaydia Code Nerd Font](https://www.nerdfonts.com/font-downloads). Set the font as your default in your terminal:

    In VS Code go to settings and set your terminal font family `"terminal.integrated.fontFamily": "CaskaydiaCove NF"`

    In Windows Terminal go to `Settings > Profiles > Defaults > Additional settings > Appearance > Font face`

2. Type `Get-PoshThemes` in the terminal or go to <https://ohmyposh.dev/docs/themes> to see a preview of all the available themes. Pick your favorite.

3. [Update your PowerShell Profile](https://ohmyposh.dev/docs/installation/prompt) so it launches oh-my-posh with your selected theme. Open your profile using the command `code $PROFILE`. My profile looks like this: `oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\avian.omp.json" | Invoke-Expression`

You may need to restart VS Code/Windows Terminal/Powershell after installing the fonts and updating your profiles.

Here is the theme I use, `avian.omp.json`, which is a customized version of the default [powerline](https://ohmyposh.dev/docs/themes#powerline) + [paradox](https://ohmyposh.dev/docs/themes#paradox) themes:

![avian.omp.json](/images/2023/avian.png)

{{< gist avianbc fc7f8a79633a0e1ca3961e344bbc5f2d >}}
