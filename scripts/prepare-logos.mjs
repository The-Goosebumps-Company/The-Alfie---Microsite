// Turns the shared-folder logo files into web-ready PNGs in public/ for the dark green.
// Re-run after swapping in final files:  node scripts/prepare-logos.mjs
// Sources stay untouched; outputs are white (Alfie keeps its red star), trimmed and resized.
import sharp from "sharp";

const ALFIE = "/Users/kelvinurwin/Desktop/THE ALFIE";
const SRC = {
  alfie: `${ALFIE}/The Alfie/Alfie Graphic Design FIles/Logo/png/The Alfie_Logo_WIP_Artboard 1 copy 2.png`,
  heineken: `${ALFIE}/NEW ALFIE SHARED FOLDER/Partner Logos/logo-heineken-red.png`,
  marble: `${ALFIE}/NEW ALFIE SHARED FOLDER/Partner Logos/logo-marble-red.png`,
  gg: `${ALFIE}/NEW ALFIE SHARED FOLDER/Partner Logos/G+G_Primary Logo_Horizontal_White.png`,
};

async function raw(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

const toPng = ({ data, w, h }) => sharp(data, { raw: { width: w, height: h, channels: 4 } });

/** Every visible pixel becomes white; the shape lives in the alpha channel. */
function whiten(img) {
  for (let i = 0; i < img.data.length; i += 4) img.data.fill(255, i, i + 3);
  return img;
}

function crop(img, x0, y0, x1, y1) {
  const w = x1 - x0, h = y1 - y0, out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) img.data.copy(out, y * w * 4, ((y0 + y) * img.w + x0) * 4, ((y0 + y) * img.w + x1) * 4);
  return { data: out, w, h };
}

async function save(img, file, height) {
  await toPng(img).trim({ threshold: 1 }).resize({ height, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(file);
  const m = await sharp(file).metadata();
  console.log(file, `${m.width}x${m.height}`);
}

// The Alfie: Grid's stacked lockup, white with the red star.
await save(await raw(SRC.alfie), "public/alfie-lockup.png", 520);

// Heineken: the confirmed lockup is the wordmark with the star to its right, no "EST. 1873".
const hk = whiten(await raw(SRC.heineken));
const wordmark = crop(hk, 0, 560, hk.w, hk.h);
const star = crop(hk, 500, 0, 1085, 540);
for (let y = 0; y < star.h; y++) {
  for (let x = 0; x < star.w; x++) {
    const ax = x + 500;
    if (y > 420 && (ax < 600 || ax > 985)) star.data[(y * star.w + x) * 4 + 3] = 0; // drop EST. / 1873
  }
}
const wm = await toPng(wordmark).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
const wmH = wm.info.height;
const starH = Math.round(wmH * 1.55); // star stands taller than the wordmark, as on the lockup
const st = await toPng(star).trim({ threshold: 1 }).resize({ height: starH }).png().toBuffer({ resolveWithObject: true });
const gap = Math.round(wmH * 0.28);
const H = Math.max(starH, wmH);
const heineken = await sharp({ create: { width: wm.info.width + gap + st.info.width, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([
    { input: wm.data, left: 0, top: Math.round((H - wmH) / 2) + Math.round(wmH * 0.04) },
    { input: st.data, left: wm.info.width + gap, top: 0 },
  ])
  .png()
  .toBuffer();
await save(await raw(heineken), "public/partners/heineken.png", 160);

// Marble Hospitality: white.
await save(whiten(await raw(SRC.marble)), "public/partners/marble.png", 160);

// G&G: already white, just far too big.
const gg = await sharp(SRC.gg, { limitInputPixels: false }).resize({ width: 2400 }).png().toBuffer();
await save(await raw(gg), "public/partners/gg.png", 160);

// Forest-green versions for the white page. The Alfie keeps its red star.
const FOREST = [0x00, 0x3a, 0x2a];
function tint(img, keepRed = false) {
  for (let i = 0; i < img.data.length; i += 4) {
    const [r, g, b] = img.data.subarray(i, i + 3);
    if (keepRed && r > 150 && g < 90 && b < 90) continue;
    img.data.set(FOREST, i);
  }
  return img;
}
await save(tint(await raw("public/alfie-lockup.png"), true), "public/alfie-lockup-green.png", 520);
for (const name of ["heineken", "marble", "gg"]) {
  await save(tint(await raw(`public/partners/${name}.png`)), `public/partners/${name}-green.png`, 160);
}
