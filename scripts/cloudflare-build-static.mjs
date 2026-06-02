import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// --- ギャラリー一覧を自動生成 ---
// assets/gallery/ に入っている画像を走査して gallery.json を作り直す。
// これにより「画像をフォルダに入れて push するだけ」で反映される。
const galleryDir = join(root, "assets", "gallery");
const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
if (existsSync(galleryDir)) {
  const images = readdirSync(galleryDir)
    .filter((name) => {
      const lower = name.toLowerCase();
      if (lower === "gallery.json") return false;
      if (lower.endsWith("_thumb.jpg")) return false;
      const dot = lower.lastIndexOf(".");
      return dot >= 0 && allowedExt.has(lower.slice(dot));
    })
    .sort((a, b) => a.localeCompare(b, "ja", { numeric: true }));
  writeFileSync(join(galleryDir, "gallery.json"), JSON.stringify(images), "utf8");
  console.log(`gallery.json generated: ${images.length} image(s)`);
}

const requiredPaths = ["index.html", "manifest.webmanifest", "sw.js", "assets"];
const copyPaths = ["index.html", "manifest.webmanifest", "sw.js", "README.md", "assets"];

const copyRecursive = (source, destination) => {
  const stat = statSync(source);
  if (stat.isDirectory()) {
    mkdirSync(destination, { recursive: true });
    for (const child of readdirSync(source)) {
      copyRecursive(join(source, child), join(destination, child));
    }
    return;
  }
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
};

for (const entry of requiredPaths) {
  if (!existsSync(join(root, entry))) {
    throw new Error(`Missing required deploy file: ${entry}`);
  }
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const entry of copyPaths) {
  const source = join(root, entry);
  if (!existsSync(source)) continue;
  copyRecursive(source, join(dist, entry));
}

console.log("Static Cloudflare Pages dist created.");
