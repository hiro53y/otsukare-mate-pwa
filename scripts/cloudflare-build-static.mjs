import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

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
