+++
date = 2022-04-25T20:19:44-04:00
title = "Customizing my CLI using Oh My Posh"
categories = ['Programming']
+++

![My Customized VS Code](/images/2022/vscode.png)

## Why Customize?

For years I have used [Cmder](https://cmder.net/) terminal emulator for a fancy CLI while developing in Windows. Now that Microsoft has finally released a modern terminal it is finally time to put Cmder to rest. In this article I am documenting my opinionated manner of customizing my CLI.

The terminals I will be customizing are:

- [Windows Terminal](https://aka.ms/terminal) is my new terminal emulator of choice.
- [VS Code](https://code.visualstudio.com/download) also has a built in terminal that I often use.
- [Powershell Core](https://github.com/PowerShell/PowerShell#get-powershell) is actually the newest version of Powershell that we rebuilt from the ground up to be multi-platform.

The customization is done using:

- [posh-git](https://github.com/dahlbyk/posh-git) is used to integrate powershell and git.
- [Oh My Posh](https://ohmyposh.dev/) is a theme engine that will be used to make it look good. I am using the [Paradox](https://ohmyposh.dev/docs/themes#paradox) theme. This project has very detailed documentation (including per shell, per OS instructions) so be sure to check it out.
- [Caskaydia Code Nerd Font](https://www.nerdfonts.com/font-downloads) is basically the default font used by Windows Terminal with added ligatures to make your CLI look awesome. If you are using a non-minimal theme like I am then you will need a font from here.

Oh My Posh is portable and actually works on any shell but I will concentrate on setting it up with Powershell in this write-up.

![Windows Terminal](/images/2022/windowsterminal.png)

## Installation Steps

1. Install required powershell modules [PowerShell Gallery](https://github.com/dahlbyk/posh-git#installing-posh-git-via-powershellget-on-linux-macos-and-windows) by running this command in Windows Terminal

    {{< highlight powershell >}}
    Install-Module posh-git -Scope CurrentUser
    Install-Module oh-my-posh -Scope CurrentUser{{< /highlight >}}

2. Download and install the [Caskaydia Code Nerd Font](https://www.nerdfonts.com/font-downloads). Set the font as your default in your terminal:

    In VS Code go to settings and set your terminal font family `"terminal.integrated.fontFamily": "CaskaydiaCove NF"`

    In Windows Terminal go to Settings > Profiles > Powershell > Additional settings > Appearance > Font face.

3. Update your PowerShell Profiles. Open your profile using the command `code $PROFILE`. My profile looks like this:

    {{< highlight powershell >}}
    Import-Module oh-my-posh
    Import-Module posh-git
    Set-PoshPrompt -Theme paradox{{< /highlight >}}

Make sure to restart VS Code/Windows Terminal/Powershell after installing the fonts and updating your profiles.
