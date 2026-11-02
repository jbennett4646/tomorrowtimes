export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/icons");
  eleventyConfig.addPassthroughCopy("src/share.png");

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
