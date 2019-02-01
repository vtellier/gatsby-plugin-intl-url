# gatsby-remark-i18n

This is a [Gatsby][1] plugin that enables you to internationalize the urls of your website.

- [x] Support the [BCP47](https://tools.ietf.org/html/bcp47) tags for identifying languages
- [x] Defines a non canonical duplicate page for the main index pages
  - [x] This is done at all level of your arborescence
  - [ ] The canonical link in the header is injected to signal the search engines crawlers register the right address
- [x] Include the locale tag in the path of untranslated pages with the default language
- [x] Configurable default language
- [x] Translation of the slugs

## What it does

It injects the [locale code][3] of your pages in the base path of the URL, your tree will look like that:

> www.example.com**/en**/hello  
> www.example.com**/en-US**/hello  
> www.example.com**/fr**/hello  
> www.example.com/ _deliver the same content as the **default language**_

The language code is provided in the path of the pages.  
The paths are translated in the language of the page using the translations files you edit.

## API

1. The plugin takes as input all the pages of the project  
   _Nb: The pages might have been tranformed before with a markup transformer like [gatsby-transformer-remark][2]_
1. The language code of each page by extracted from the path: `/path/to/my/file.html.en` provides the `en` code.  
   If the pattern does not maches, the page will be treated as written in the **default language**.
1. As output, it transforms the path of the pages and inject context variables as the next table describes:
| Path        | New path        | context.locale   | context.canonical    | context.slug     | context.pathRegex    |
| ----------- | --------------- | ---------------- | -------------------- | ---------------- | -------------------- |
| /a/b.fr     | /fr/a/b         | fr               | null                 | /a/b             | /a/b/                |
| /a.html     | /en/a.html      | en (default)     | null                 | /a.html          | /a.html/             |
| /a.html.es  | /es/a.html      | es               | null                 | /a.html          | /a.html/             |
| /index.no   | /no             | no               | null                 | /                | //                   |
| /index.en   | / **and** /en   | en (default)     | en **and** null      | /                | //                   |
1. Each item of the path is translated using the `src/locale.[lang].json` file  
   _Ex: `/my/path.html` is exploded as `['my','path.html']`, and every string of this array will be translated
   in french using `src/locale.fr.json` file_

### locale.[lang].json

This file is located at `src/locale.[lang].json` and must be structured as follows:
```.json
{
    "slugs": {
        "boats": "bateaux",
        "mono-hull": "mono-coque",
        "multi-hull": "multi-coque",
        "sailboat": "voilier",
        "motorboat": "bateau-a-moteur",
    }
}
```

This file would enable to translate the following paths:
| Path                       | Translated                   |
| -------------------------- | ---------------------------- |
| /boats/motorboat           | /bateaux/bateau-a-moteur     |
| /boats/sailboat/mono-hull  | /bateaux/voilier/mono-coque  |
| /boats/sailboat/multi-hull | /bateaux/voilier/multi-coque |


### Workflow

The plugin is listening to the page creation events **[onCreatePage](https://www.gatsbyjs.org/docs/node-apis/#onCreatePage)**

### Context property injection

After handled by the plugin, the page's context have been injected with the following properties:
- **locale:** The language tag indentifying the language of the page.
- **canonical:** The canonical link to the page, if the current one has not the canonical path itself, null otherwise.
  This is usefull to indicate the search engines which link should be
  registered for the index pages.
- **slug:** This is the relative path of your page without any indication of the language. It should be written in the
  default language ~~so that you can translate it~~ (feature not implemented yet).
- **pathRegex:** A regular expression containing your the slug for you to filter easily in GraphQL.

### Handling the index pages

A website _www.example.com_ will have an index page translated in several languages availables at their specific URLs.
for instance _www.example.com/pt_, _www.example.com/fi_, _www.example.com/no_... If the default language is norwegian, the
main home page should be translated in norwegian, which means the URL _www.example.com/_ should deliver the same content as
_www.example.com/no_.

To handle this case, the plugin will general two pages with two different URLs, one will be the preferred one
ie. the **canonical**, and the other the non canonical.  
As of today, this choice isn't configurable and it behaves like so:
- _www.example.com/no_ is canonical
- _www.example.com/_ is **not** canonical

## Contribution

Please help me improve this project, feel free to ask, suggest or send your pull requests. You can directly 
[contact me on Twitter](https://twitter.com/vtellier).


[1]: gatsbyjs.org
[2]: https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark
[3]: https://formatjs.io/guides/basic-i18n/#locales

