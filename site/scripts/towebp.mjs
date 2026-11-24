// Converte as fotos JPEG de public/img para WebP (rodar: node scripts/towebp.mjs)
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
const dir = process.argv[2] ?? "public/img";
for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".jpg"))) {
  const out = path.join(dir, f.replace(/\.jpg$/, ".webp"));
  await sharp(path.join(dir, f)).webp({ quality: 74 }).toFile(out);
  const m = await sharp(path.join(dir,f)).metadata();
  console.log(f, m.width+"x"+m.height, Math.round(fs.statSync(path.join(dir, f)).size/1024)+"KB ->", Math.round(fs.statSync(out).size/1024)+"KB");
}
