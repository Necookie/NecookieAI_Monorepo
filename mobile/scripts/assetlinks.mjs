import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// Run from the repository root. Only public certificate fingerprints belong here.
const [fingerprint, output = 'public/.well-known/assetlinks.json'] = process.argv.slice(2);
if (!fingerprint || !/^(?:[A-Fa-f0-9]{2}:){31}[A-Fa-f0-9]{2}$/.test(fingerprint)) {
  console.error('Usage: node mobile/scripts/assetlinks.mjs <SHA-256 certificate fingerprint> [output-path]');
  process.exit(1);
}

const file = resolve(output);
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify([{
  relation: ['delegate_permission/common.handle_all_urls'],
  target: {
    namespace: 'android_app',
    package_name: 'dev.necookie.ai',
    sha256_cert_fingerprints: [fingerprint.toUpperCase()],
  },
}], null, 2) + '\n');
console.log(`Wrote ${file}`);
