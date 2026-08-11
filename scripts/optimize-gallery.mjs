// ギャラリー画像を自動最適化するスクリプト（Cloudflare ビルド時に実行）。
//
// assets/gallery/ に入れた画像を、長辺1280px・JPEG(品質80)へ圧縮して上書きする。
// すでに十分小さい画像（長辺<=1400 かつ 200KB未満）はスキップする。
// PNG/WebP/GIF を入れた場合も JPEG(.jpg) に変換し、元ファイルは削除する。
//
// これにより、利用者は「重いイラストでも assets/gallery/ に入れて push するだけ」でよい。
// sharp が使えない環境では何もせず（無加工のまま）ビルドを続行する。

import { readdirSync, renameSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const galleryDir = join(root, "assets", "gallery");

const MAX_EDGE = 1280;
const QUALITY = 80;
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.log("[optimize-gallery] sharp 未導入のため最適化をスキップします。");
  process.exit(0);
}

if (!existsSync(galleryDir)) {
  console.log("[optimize-gallery] gallery フォルダが無いためスキップします。");
  process.exit(0);
}

const files = readdirSync(galleryDir).filter((name) => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".json")) return false;
  return SOURCE_EXT.has(extname(lower));
});

let optimized = 0;
let skipped = 0;

for (const name of files) {
  const srcPath = join(galleryDir, name);
  const ext = extname(name).toLowerCase();
  try {
    // 癒し情景はアプリが固定の .webp パスで参照するため、拡張子を変えない。
    if (/^healing-(comfort|encourage|practical)-\d{2}\.webp$/i.test(name)) {
      skipped++;
      continue;
    }
    const meta = await sharp(srcPath).metadata();
    const longEdge = Math.max(meta.width || 0, meta.height || 0);
    const isJpeg = ext === ".jpg" || ext === ".jpeg";

    // すでに適正サイズの JPEG は再圧縮しない（二重圧縮による劣化を防ぐ）。
    // 長辺が MAX_EDGE 以下の .jpg は最適化済みとみなしてスキップ。
    if (isJpeg && longEdge > 0 && longEdge <= MAX_EDGE) {
      skipped++;
      continue;
    }

    const tmpPath = join(galleryDir, `__tmp__${basename(name, ext)}.jpg`);
    await sharp(srcPath)
      .rotate() // EXIF の回転を反映
      .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmpPath);

    const finalPath = join(galleryDir, `${basename(name, ext)}.jpg`);
    // 元が .jpg 以外なら元ファイルを削除（.jpg に統一）
    if (!isJpeg) rmSync(srcPath, { force: true });
    rmSync(finalPath, { force: true });
    renameSync(tmpPath, finalPath);
    optimized++;
  } catch (err) {
    console.warn(`[optimize-gallery] ${name} の最適化に失敗（無加工のまま）:`, err?.message || err);
  }
}

console.log(`[optimize-gallery] 最適化 ${optimized} 件 / スキップ ${skipped} 件`);
