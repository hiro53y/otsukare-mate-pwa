import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// --- ギャラリー一覧を自動生成（画像 + 音声）---
// 対象フォルダを走査して一覧JSONを作り直す。
// これにより「画像・音声をフォルダに入れて push するだけ」で反映される。
const buildList = (relDir, jsonName, exts, exclude) => {
  const dir = join(root, ...relDir);
  if (!existsSync(dir)) return;
  const files = readdirSync(dir)
    .filter((name) => {
      const lower = name.toLowerCase();
      if (lower.endsWith(".json")) return false;
      if (exclude && exclude(lower)) return false;
      const dot = lower.lastIndexOf(".");
      return dot >= 0 && exts.has(lower.slice(dot));
    })
    .sort((a, b) => a.localeCompare(b, "ja", { numeric: true }));
  writeFileSync(join(dir, jsonName), JSON.stringify(files), "utf8");
  console.log(`${jsonName} generated: ${files.length} file(s)`);
};

buildList(
  ["assets", "gallery"],
  "gallery.json",
  new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]),
  (lower) => lower.endsWith("_thumb.jpg")
);
buildList(
  ["assets", "voice", "gallery"],
  "voice-gallery.json",
  new Set([".wav", ".mp3", ".m4a", ".ogg"])
);

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
