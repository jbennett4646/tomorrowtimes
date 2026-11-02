# The Tomorrow Times

A satire site. Tomorrow's news, delivered today. Additional fees may apply.

Articles are plain markdown files. The site is built with [Eleventy](https://www.11ty.dev/) (free, open source), which turns each markdown file into a page using the site's design, and builds the homepage and section pages automatically.

## Adding articles

1. Copy `src/articles/_TEMPLATE.md.txt` to a new file in `src/articles/`, named after the article, ending in `.md` (for example `cereal-box-shrinks.md`). The file name becomes the web address: `/articles/cereal-box-shrinks/`.
2. Fill in the top block:
   - `title`: the headline, in quotes
   - `section`: one of `consumer`, `corporate`, `private-equity`, `technology`, `customer-service`, `home-front`
   - `date`: `YYYY-MM-DD`; newest articles appear first
   - `dateline`: e.g. `"MARIETTA, GA"`; it is added in front of the first paragraph automatically
   - `featured: true` (optional) makes it the cover story; give it a `summary:` line too
3. Write the article below the `---` line, with a blank line between paragraphs. Use `*asterisks*` for italics.
4. Commit and push. The site rebuilds and publishes on its own.

Bulk loading works the same way: drop in as many `.md` files as you like and push once.

Only one article should have `featured: true`. If none do, the newest article becomes the cover story.

## Project layout

```
src/
  articles/            One markdown file per article
  sections/            Generates /consumer/, /corporate/, etc.
  _data/sections.json  The list of sections (add or rename sections here)
  _includes/layouts/   Page templates (base.njk = shared shell, article.njk = article page)
  index.njk            Homepage
  css/style.css        All styling; the palette is in the :root variables
  icons/               Section icons (technology and customer-service are animated)
eleventy.config.js     Eleventy settings
vercel.json            Vercel build settings
.github/workflows/     GitHub Pages deployment
```

To add a section: add it to `src/_data/sections.json` and add an icon named `icons/<key>.svg`.

## Hosting

**Vercel (recommended).** Import the GitHub repository in Vercel. It reads `vercel.json` and runs the build itself; nothing to configure. Every push to `main` redeploys.

**GitHub Pages.** In the repository's Settings > Pages, set Source to **GitHub Actions**. The included workflow builds and publishes on every push to `main`, at `https://<username>.github.io/<repo>/`.

## Previewing locally (optional)

Requires Node.js 18 or newer.

```
npm install
npm start
```

Then open http://localhost:8080.

## Not wired up yet

- The "Sign Me Up!" form does nothing; connect a newsletter service later.
- Weather and Today's Mood are static text.
