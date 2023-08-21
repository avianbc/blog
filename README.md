# [bradleycarey.com](https://bradleycarey.com/)

The site is built using [Hugo](https://gohugo.io/) static HTML and CSS website generator. Many of the old blog posts were exported from an ancient wordpress site.

## Getting Started

1. [Install Hugo](https://gohugo.io/installation/): `choco install hugo-extended -confirm`
1. Run the site locally: `hugo server`
1. Create a new post: `hugo new posts/post-title.md`

Posts are actually Markdown files. A `*.md` reference can be found at [markdownguide.org](https://www.markdownguide.org/tools/hugo/).

## Updating syntax highlighting classes

Code syntax highlighting is now light vs dark theme aware using the [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query. I am using [solarized-dark256](https://xyproto.github.io/splash/docs/solarized-dark256.html) for dark mode and [solarized-light](https://xyproto.github.io/splash/docs/solarized-light.html) for light mode.

1. To re-generate the classes, run these commands:

    ```shell
    hugo gen chromastyles --style=solarized-dark256 > .\assets\syntax-dark.scss
    hugo gen chromastyles --style=solarized-light > .\assets\syntax-light.scss
    ```

2. Create a file `assets\custom.scss` and enter this into it so it can import the generated classes:

    ```scss
    @import "syntax-light";
    @media screen and (prefers-color-scheme: dark) {
        @import "syntax-dark256";
    }
    ```

3. Make sure your hugo `config.toml` knows about the `custom.scss` file and that markup highlighting classes are enabled:

    ```toml
    [params]
    customSCSS = ["custom.scss"]

    [markup.highlight]
    noClasses = false
    ```

## Contributing

See a typo? Submit a PR and I will be your friend forever.

CI/CD pipeline provided by Netlify: [![Netlify Status](https://api.netlify.com/api/v1/badges/bde75bf8-d2a2-4f5a-8bfe-4e3513b5cea8/deploy-status)](https://app.netlify.com/sites/bradleycarey/deploys)
