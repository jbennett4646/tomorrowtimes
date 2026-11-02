// Draws the link-preview cards (1200x630 PNG) that Signal, iMessage and social apps show when a link is shared.
// Each card looks like a social post from the paper: the Concerned Cloud avatar, the paper's name, and the headline.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const here = path.dirname(fileURLToPath(import.meta.url));
const font = (file) => fs.readFileSync(path.join(here, "fonts", file));
const FONTS = [
  { name: "Arimo", data: font("Arimo-Regular.ttf"), weight: 400, style: "normal" },
  { name: "Arimo", data: font("Arimo-Bold.ttf"), weight: 700, style: "normal" },
];

const INK = "#2B2320";
const AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="460" height="460">
<circle cx="50" cy="50" r="50" fill="#3E9A9C"/>
<g transform="translate(14 26.5) scale(0.9)">
<path d="M20 48a14 14 0 010-28 18 18 0 0134-6 13 13 0 0116 18 10 10 0 01-4 16z" fill="#D7D2E8" stroke="${INK}" stroke-width="3.4"/>
<circle cx="38" cy="32" r="2.8" fill="${INK}"/><circle cx="52" cy="32" r="2.8" fill="${INK}"/>
<path d="M38 42q7-5 14 0" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/></g></svg>`;
const AVATAR = "data:image/svg+xml;base64," + Buffer.from(AVATAR_SVG).toString("base64");

const el = (type, style, children) => ({ type, props: { style, children } });

function headlineSize(text) {
  const n = text.length;
  if (n <= 60) return 66;
  if (n <= 95) return 58;
  if (n <= 130) return 50;
  return 44;
}

// Satori adds a stray gap after some words when it measures a plain space. A non-breaking space measures
// correctly, and the zero-width space after it still lets long headlines wrap between words.
const tidy = (text) => String(text).replace(/ +/g, "\u00a0\u200b");

export async function renderCard(headline, domain) {
  const size = headlineSize(String(headline));
  headline = tidy(headline);
  const tree = el("div", {
    width: 1200, height: 630, display: "flex", alignItems: "center", gap: 48,
    padding: "0 70px", background: "#FBF3DF", border: "10px solid #C9B48A", fontFamily: "Arimo", color: INK,
  }, [
    { type: "img", props: { src: AVATAR, width: 230, height: 230, style: { flexShrink: 0 } } },
    el("div", { display: "flex", flexDirection: "column", gap: 22, flex: 1, minWidth: 0 }, [
      el("div", { display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: 16, rowGap: 4 }, [
        el("span", { fontSize: 46, fontWeight: 700 }, tidy("The Tomorrow Times")),
        el("span", { fontSize: 34, color: "#6B5E58" }, domain),
      ]),
      el("div", { fontSize: size, lineHeight: 1.25 }, headline),
    ]),
  ]);
  const svg = await satori(tree, { width: 1200, height: 630, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

// cards: [{ file, headline }]. Writes each PNG into outDir.
export async function renderCards(cards, outDir, domain) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const { file, headline } of cards) {
    fs.writeFileSync(path.join(outDir, file), await renderCard(headline, domain));
  }
}
