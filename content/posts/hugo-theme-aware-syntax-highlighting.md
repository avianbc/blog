+++
date = 2023-08-23T17:59:17.716Z
title = "Theme-aware syntax highlighting for Hugo using SCSS + Chroma"
categories = ['Programming']
tags = ['Hugo', 'SCSS', 'Tailwind CSS', 'CSS', 'SASS']
+++

[Hugo static site generator](https://gohugo.io/) has built in [syntax highlighting](https://gohugo.io/content-management/syntax-highlighting/) for code blocks that uses [Chroma](https://github.com/alecthomas/chroma) udner the hood. The newer CLI, known as [hugo-extended](https://gohugo.io/installation/windows/#editions), finally supports SASS transpilation.

Using the power of SASS [@import](https://sass-lang.com/documentation/at-rules/import/) statements + [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) `media` queries or CSS `class` name toggles, we can apply separate themes for light vs dark modes. **Tailwind CSS** refers to these strategies as [media](https://tailwindcss.com/docs/dark-mode#basic-usage) vs [class](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually).

I am using [solarized-dark256](https://xyproto.github.io/splash/docs/solarized-dark256.html) for dark mode and [solarized-light](https://xyproto.github.io/splash/docs/solarized-light.html) for light mode.

1. Install hugo-extended: `choco install hugo-extended` or `winget install Hugo.Hugo.Extended`

2. To generate the required classes, run these commands:

    ```text
    hugo gen chromastyles --style=solarized-dark256 > .\assets\syntax-dark.scss
    hugo gen chromastyles --style=solarized-light > .\assets\syntax-light.scss
    ```

3. Create a file `assets\custom.scss` and `@import` the generated CSS files:

    If you are using the `prefers-color-scheme` CSS `media` query to toggle light/dark modes:

    ```scss
    @import "syntax-light";
    @media screen and (prefers-color-scheme: dark) {
        @import "syntax-dark";
    }
    ```

    If your page is using a CSS `class` to indicate dark vs light mode, you can also wire these up using `@import` statements. This site has a theme toggle button on the bottom right that toggles the CSS class `colorscheme-light` or `colorscheme-dark` on the HTML `body` tag. To use these instead of the media queries, I do this:

    ```scss
    .colorscheme-light {
        @import "syntax-light";
    }
    .colorscheme-dark {
        @import "syntax-dark";
    }
    ```

4. Make sure your hugo `config.toml` knows about the `custom.scss` file and that markup highlighting classes are enabled:

    ```toml
    [params]
    customSCSS = ["custom.scss"]

    [markup.highlight]
    noClasses = false
    ```
