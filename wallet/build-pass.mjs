// Buduje podpisany plik serce-mamy.pkpass (Apple Wallet).
// Wymaga w wallet/certs/: pass.key (klucz z CSR), pass.cer (certyfikat Pass Type ID z developer.apple.com), wwdr.pem (Apple WWDR G4).
// Uruchom:  node wallet/build-pass.mjs   (z katalogu serce-mamy). Wynik: serce-mamy.pkpass w katalogu strony.
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const certs = join(here, 'certs');
const need = ['pass.key', 'wwdr.pem'];
for (const f of need) if (!existsSync(join(certs, f))) { console.error('Brak pliku wallet/certs/' + f); process.exit(1); }
let certPem = join(certs, 'pass.pem');
if (!existsSync(certPem)) {
  if (!existsSync(join(certs, 'pass.cer'))) { console.error('Brak wallet/certs/pass.cer — pobierz certyfikat Pass Type ID z developer.apple.com (patrz wallet/README.md)'); process.exit(1); }
  execSync(`openssl x509 -inform DER -in "${join(certs, 'pass.cer')}" -out "${certPem}"`);
}
const pass = JSON.parse(readFileSync(join(here, 'pass.json'), 'utf8'));
if (pass.teamIdentifier.includes('DO_UZUPELNIENIA')) {
  const subj = execSync(`openssl x509 -in "${certPem}" -noout -subject`).toString();
  const m = /OU\s*=\s*([A-Z0-9]{10})/.exec(subj);
  if (m) { pass.teamIdentifier = m[1]; console.log('teamIdentifier z certyfikatu:', m[1]); }
  else { console.error('Uzupełnij teamIdentifier w wallet/pass.json'); process.exit(1); }
  const uid = /UID\s*=\s*(pass\.[^/,\n]+)/.exec(subj); if (uid) pass.passTypeIdentifier = uid[1].trim();
}
const work = mkdtempSync(join(tmpdir(), 'pkpass-'));
writeFileSync(join(work, 'pass.json'), JSON.stringify(pass, null, 2));
for (const f of readdirSync(join(here, 'assets'))) if (f.endsWith('.png')) copyFileSync(join(here, 'assets', f), join(work, f));
const manifest = {};
for (const f of readdirSync(work)) manifest[f] = createHash('sha1').update(readFileSync(join(work, f))).digest('hex');
writeFileSync(join(work, 'manifest.json'), JSON.stringify(manifest, null, 2));
execSync(`openssl smime -binary -sign -certfile "${join(certs, 'wwdr.pem')}" -signer "${certPem}" -inkey "${join(certs, 'pass.key')}" -in "${join(work, 'manifest.json')}" -out "${join(work, 'signature')}" -outform DER`);
const out = join(here, '..', 'serce-mamy.pkpass');
if (existsSync(out)) rmSync(out);
execSync(`cd "${work}" && zip -q -r "${out}" .`);
rmSync(work, { recursive: true, force: true });
console.log('Zbudowano:', out, '| passTypeIdentifier:', pass.passTypeIdentifier, '| team:', pass.teamIdentifier);
