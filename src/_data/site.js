// Full public address of the site, used for link previews (Signal, iMessage, social apps).
// The deploy sets SITE_URL from GitHub Pages; the fallback is the custom domain.
export default {
  name: "The Tomorrow Times",
  url: (process.env.SITE_URL || "https://tomorrow-times.news").replace(/\/$/, "")
};
