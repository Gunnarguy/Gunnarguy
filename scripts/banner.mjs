// Profile banner (assets/banner-dark.png, assets/banner-light.png).
// Needs satori, @resvg/resvg-js and the fontsource fonts, which live in the
// portfolio checkout, so run it from there:
//   cp scripts/banner.mjs ../Gunnarguy-Portfolio/.banner-tmp.mjs && (cd ../Gunnarguy-Portfolio && node .banner-tmp.mjs && rm .banner-tmp.mjs)
// Icons come from assets/*-icon.png, made by scripts/icons.py.

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const font = (pkg, file) => readFile(require.resolve(`${pkg}/files/${file}`));
const fonts = [
  { name: "Outfit", data: await font("@fontsource/outfit", "outfit-latin-800-normal.woff"), weight: 800, style: "normal" },
  { name: "Outfit", data: await font("@fontsource/outfit", "outfit-latin-700-normal.woff"), weight: 700, style: "normal" },
  { name: "Inter", data: await font("@fontsource/inter", "inter-latin-500-normal.woff"), weight: 500, style: "normal" },
  { name: "Inter", data: await font("@fontsource/inter", "inter-latin-400-normal.woff"), weight: 400, style: "normal" },
];
const ICONS = "/Users/gunnarhostetler/Documents/GitHub/Gunnarguy/assets";
const slugs = ["openintelligence", "openmanual", "openresponses", "opencone", "openassistant", "openclinic"];
const icons = await Promise.all(slugs.map(async (s) => `data:image/png;base64,${(await readFile(`${ICONS}/${s}-icon.png`)).toString("base64")}`));
const h = (type, style, children, extra = {}) => ({ type, props: { style, children, ...extra } });
const themes = {
  dark: { bg: "#080b11", glow: "rgba(0,242,254,0.16)", glow2: "rgba(0,184,212,0.10)", ink: "#f3f4f6", muted: "#9ca3af", accent: "#00f2fe", rule: "rgba(255,255,255,0.10)", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { bg: "#fbfcfd", glow: "rgba(0,184,212,0.16)", glow2: "rgba(0,242,254,0.12)", ink: "#0b1220", muted: "#4b5563", accent: "#0e7490", rule: "rgba(11,18,32,0.10)", shadow: "0 24px 50px rgba(11,18,32,0.16)" },
};
for (const [name, t] of Object.entries(themes)) {
  const tree = h("div", { width: 1200, height: 400, display: "flex", background: t.bg, position: "relative", fontFamily: "Inter" }, [
    h("div", { position: "absolute", top: -260, right: -140, width: 720, height: 720, borderRadius: 360, background: `radial-gradient(circle at center, ${t.glow} 0%, rgba(0,0,0,0) 62%)` }),
    h("div", { position: "absolute", bottom: -300, left: -120, width: 620, height: 620, borderRadius: 310, background: `radial-gradient(circle at center, ${t.glow2} 0%, rgba(0,0,0,0) 62%)` }),
    h("div", { display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 72px", width: 660, height: 400 }, [
      h("div", { fontFamily: "Outfit", fontWeight: 700, fontSize: 15, letterSpacing: 1.6, color: t.accent, textTransform: "uppercase", marginBottom: 18 }, "AI-Native iOS Developer + Surgical Technology Support"),
      h("div", { fontFamily: "Outfit", fontWeight: 800, fontSize: 74, lineHeight: 1.02, letterSpacing: -2.5, color: t.ink }, "Gunnar Hostetler"),
      h("div", { fontSize: 22, lineHeight: 1.4, color: t.muted, marginTop: 20, fontWeight: 400, maxWidth: 540 }, "AI-native apps for iPhone, iPad, and Mac, built around on-device AI, retrieval, and agentic reasoning loops."),
      h("div", { display: "flex", alignItems: "center", gap: 10, marginTop: 30, fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: t.ink }, [
        h("div", { width: 10, height: 10, borderRadius: 5, background: t.accent }),
        h("div", {}, "gunnarguy.me"),
        h("div", { width: 1, height: 16, background: t.rule, margin: "0 6px" }),
        h("div", { fontWeight: 500, fontFamily: "Inter", color: t.muted, fontSize: 17 }, "gunzino.me · fascinaiting.me"),
      ]),
    ]),
    h("div", { position: "absolute", right: 72, top: 0, height: 400, display: "flex", alignItems: "center" },
      h("div", { display: "flex", flexWrap: "wrap", width: 3 * 132 + 2 * 18, gap: 18 }, icons.map((src) => h("img", { width: 132, height: 132, boxShadow: t.shadow, borderRadius: 30 }, undefined, { src, width: 132, height: 132 })))),
  ]);
  const svg = await satori(tree, { width: 1200, height: 400, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  await writeFile(`${ICONS}/banner-${name}.png`, png);
  console.log(`banner-${name}.png`, png.length);
}
