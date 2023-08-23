# [bradleycarey.com](https://bradleycarey.com/)

The site is built using [Hugo](https://gohugo.io/) static HTML and CSS website generator. Many of the old blog posts were exported from an ancient wordpress site.

## Getting Started

1. [Install Hugo](https://gohugo.io/installation/): `choco install hugo-extended -confirm`
1. Run the site locally: `hugo server`
1. Create a new post: `hugo new posts/post-title.md`

Posts are actually Markdown files. A `*.md` reference can be found at [markdownguide.org](https://www.markdownguide.org/tools/hugo/).

## Updating syntax highlighting classes

Code syntax highlighting is now [light vs dark theme aware](/content/posts/hugo-theme-aware-syntax-highlighting.md). The snippets below use [solarized-dark256](https://xyproto.github.io/splash/docs/solarized-dark256.html) for dark mode and [solarized-light](https://xyproto.github.io/splash/docs/solarized-light.html) for light mode.

To re-generate the dark vs light mode code syntax highlighting CSS classes, run these commands:

```shell
hugo gen chromastyles --style=solarized-dark256 > .\assets\syntax-dark.scss
hugo gen chromastyles --style=solarized-light > .\assets\syntax-light.scss
```

These files are already `@import`ed into `assets\custom.scss` and served via the hugo `config.toml > [params]customSCSS + [markup.highlight]noClasses = false` params.

## Contributing

See a typo? Submit a PR and I will be your friend forever.

CI/CD pipeline provided by Netlify: [![Netlify Status](https://api.netlify.com/api/v1/badges/bde75bf8-d2a2-4f5a-8bfe-4e3513b5cea8/deploy-status)](https://app.netlify.com/sites/bradleycarey/deploys)
