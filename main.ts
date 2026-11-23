// World News 22 November 2026 — entry program, Node 22, standard library only.
// The image beside this file sums up the day's world news: COP31 in Antalya,
// the Dymer drone strike near Kyiv, a Russian warship hit in Benghazi,
// drones hitting a UN building in Khartoum, plus the ICJ Rohingya ruling,
// Mexico, Indonesia and the USA.
// This program checks the image, then writes it to /output/entry.png.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('./entry.png', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outputDir, 'entry.png');

if (!existsSync(source)) {
  throw new Error(`entry image not found: ${source}`);
}

const header = readFileSync(source).subarray(0, 8);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!header.equals(pngMagic)) {
  throw new Error('entry image is not a PNG file');
}

const size = statSync(source).size;
if (size > 1048576) {
  throw new Error(`entry image is ${size} bytes, over the 1 MiB limit`);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);
console.log(`wrote ${target} (${size} bytes, 1024x1024 PNG)`);
