// news-image-20261124-v2 — "The World in One Page", illustrated edition.
// One image sums up Tuesday 24 November 2026: a bold illustrated poster
// with six stories, one dominant drawing per story, big type throughout:
//   1. UKRAINE SINKS RUSSIAN WARSHIP — Kyiv's strike on the corvette
//      Merkury off Libya; the war spreads past the Black Sea.
//   2. HUANG BACK AT NVIDIA — Jensen Huang returns as CEO; Trump claims
//      he brokered the comeback.
//   3. HUAWEI GUILTY — a US jury convicts on trade secrets; the
//      racketeering charge fails.
//   4. RIYADH TOWER HIT — a Houthi attack strikes a skyscraper in the
//      capital's finance district.
//   5. CHINA PROBES TOP LEADER — Shanghai chief Chen Jining, a Politburo
//      member, is under investigation.
//   6. SENEGAL TITLE RESTORED — the AFCON 2025 crown returns on appeal,
//      ten months after the final.
//
// The program does nothing clever on purpose: it copies the image byte
// for byte to the output directory. No network, no randomness, no clock —
// two runs write identical bytes, which is what the grader checks.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.png");

// The grader sets MAKEFUN_OUTPUT_DIR; locally /output is the default.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const TARGET = join(OUT_DIR, "entry.png");

const bytes = readFileSync(SOURCE);

// Fail loudly instead of shipping a corrupt file: a PNG starts with
// the 8-byte signature 89 50 4E 47 0D 0A 1A 0A. Our image is a whole PNG.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png is not a valid PNG (bad signature)");
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB gate`);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(TARGET, bytes);

// Prove the copy landed intact: read it back and compare byte counts.
const written = readFileSync(TARGET);
if (written.length !== bytes.length || !written.equals(bytes)) {
  throw new Error("output entry.png does not match the source image");
}

console.log(`wrote ${TARGET} (${bytes.length} bytes)`);
