export default {
  layout: "layouts/article.njk",
  permalink: (data) => `/articles/${data.page.fileSlug}/`
};
