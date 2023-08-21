+++
date = 2023-08-20T23:26:07-04:00
title = "Theme-aware syntax highlighting for Hugo"
categories = ['Programming']
+++

[Hugo static site generator](https://gohugo.io/) has built in [syntax highlighting](https://gohugo.io/content-management/syntax-highlighting/) for code blocks. The newer CLI, known as [hugo-extended](https://gohugo.io/installation/windows/#editions), finally supports SASS transpilation.

Using the power of SASS [@import](https://sass-lang.com/documentation/at-rules/import/) statements + [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media queries, we can apply separate themes for light vs dark modes.

I am using [solarized-dark256](https://xyproto.github.io/splash/docs/solarized-dark256.html) for dark mode and [solarized-light](https://xyproto.github.io/splash/docs/solarized-light.html) for light mode.

1. Install hugo-extended: `choco install hugo-extended` or `winget install Hugo.Hugo.Extended`

1. To generate the required classes, run these commands:

    ```shell
    hugo gen chromastyles --style=solarized-dark256 > .\assets\syntax-dark.scss
    hugo gen chromastyles --style=solarized-light > .\assets\syntax-light.scss
    ```

1. Create a file `assets\custom.scss` and enter this into it so it can import the generated classes:

    ```scss
    @import "syntax-light";
    @media screen and (prefers-color-scheme: dark) {
        @import "syntax-dark";
    }
    ```

1. Make sure your hugo `config.toml` knows about the `custom.scss` file and that markup highlighting classes are enabled:

    ```toml
    [params]
    customSCSS = ["custom.scss"]

    [markup.highlight]
    noClasses = false
    ```
