import { renderCards } from "./og/render.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/icons");

  // Plain-text teaser from rendered HTML, for link-preview descriptions
  eleventyConfig.addFilter("excerpt", (html, max = 160) => {
    let src = String(html || "");
    const firstPara = src.indexOf("<p");
    if (firstPara > -1) src = src.slice(firstPara); // skip the kicker and headline, start at the dateline
    const back = src.indexOf('class="back"');
    if (back > -1) src = src.slice(0, src.lastIndexOf("<a", back)); // drop the "Back to the front page" link
    const text = src
      .replace(/<\/?(p|br|h\d|li|div)\b[^>]*>/g, " ") // block tags become spaces
      .replace(/<[^>]+>/g, "") // inline tags (italics, bold, links) vanish without a gap
      .replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim(); // plain text; the template escapes it once when writing the tag
    if (text.length <= max) return text;
    return text.slice(0, text.lastIndexOf(" ", max)).replace(/[,;:.\s]+$/, "") + "…";
  });

  // All articles, newest first
  let previewCards = [];
  eleventyConfig.addCollection("articles", (api) => {
    const articles = api.getFilteredByGlob("src/articles/*.md").sort((a, b) => b.date - a.date);
    previewCards = articles.map((a) => ({ file: `${a.page.fileSlug}.png`, headline: a.data.title }));
    return articles;
  });

  // Link-preview cards: one per article plus one for every other page, written to _site/og/
  eleventyConfig.on("eleventy.after", async ({ dir, directories }) => {
    const domain = new URL(process.env.SITE_URL || "https://tomorrow-times.news").host;
    await renderCards(
      [{ file: "home.png", headline: "Tomorrow’s news, delivered today. Additional fees may apply." }, ...previewCards],
      `${(directories && directories.output) || dir.output}/og`,
      domain
    );
  });

  eleventyConfig.addFilter("bySection", (articles, key) =>
    articles.filter((a) => a.data.section === key)
  );
  eleventyConfig.addFilter("cover", (articles) =>
    articles.find((a) => a.data.featured) || articles[0]
  );
  eleventyConfig.addFilter("without", (articles, item) =>
    articles.filter((a) => a !== item)
  );
  eleventyConfig.addFilter("first", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("sectionName", (key, sections) =>
    (sections.find((s) => s.key === key) || {}).name || key
  );

  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: false
  };
}
