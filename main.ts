// News-image entry (Node 22, standard library only): the program's whole job
// is to place the front page it ships with into the grader's output
// directory, byte for byte. No network, no randomness: the same file is
// copied on every run, so two runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const source = new URL('./entry.png', import.meta.url);
const target = join(outDir, 'entry.png');
copyFileSync(source, target);
// The copy must be exact: refuse to report success if any byte went missing.
const digest = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
if (digest(source) !== digest(target)) {
  throw new Error('entry.png copy does not match the source');
}
