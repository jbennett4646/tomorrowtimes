export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/icons");

  // All articles, newest first
  eleventyConfig.addCollection("articles", (api) =>
    api.getFilteredByGlob("src/articles/*.md").sort((a, b) => b.date - a.date)
  );

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
