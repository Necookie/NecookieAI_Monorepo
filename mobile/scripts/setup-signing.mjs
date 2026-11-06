import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const folder = resolve('.android-release');
const key = resolve(folder, 'necookie-release.p12');
const credentials = resolve(folder, 'signing.json');
mkdirSync(folder, { recursive: true });
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.error || 'unknown error'}`);
  return result.stdout;
}
if (existsSync(key) !== existsSync(credentials)) throw new Error('Incomplete signing backup. Restore it before continuing.');
if (!existsSync(key)) {
  const password = randomBytes(36).toString('base64url');
  run(process.platform === 'win32' ? 'keytool.exe' : 'keytool', [
    '-genkeypair', '-noprompt', '-storetype', 'PKCS12', '-keystore', key,
    '-alias', 'necookie', '-keyalg', 'RSA', '-keysize', '4096', '-validity', '10000',
    '-dname', 'CN=Necookie AI, O=Necookie',
    '-storepass:env', 'NECOOKIE_SIGNING_PASSWORD', '-keypass:env', 'NECOOKIE_SIGNING_PASSWORD',
  ], { env: { ...process.env, NECOOKIE_SIGNING_PASSWORD: password } });
  writeFileSync(credentials, JSON.stringify({ storePassword: password, keyPassword: password }, null, 2), { mode: 0o600 });
  console.log('Created release signing key in the git-ignored .android-release directory. Back up this directory securely.');
}
const secrets = JSON.parse(readFileSync(credentials, 'utf8'));
const certificate = run(process.platform === 'win32' ? 'keytool.exe' : 'keytool', [
  '-list', '-v', '-keystore', key, '-alias', 'necookie', '-storepass:env', 'NECOOKIE_SIGNING_PASSWORD',
], { env: { ...process.env, NECOOKIE_SIGNING_PASSWORD: secrets.storePassword } });
const fingerprint = certificate.match(/SHA256:\s*([A-F0-9:]+)/i)?.[1];
if (!fingerprint) throw new Error('Unable to read signing certificate fingerprint');
writeFileSync(resolve(folder, 'certificate-sha256.txt'), fingerprint + '\n');
console.log(`Public certificate SHA-256: ${fingerprint}`);
if (process.argv.includes('--upload')) {
  for (const [name, value] of Object.entries({
    ANDROID_KEYSTORE_BASE64: readFileSync(key).toString('base64'),
    ANDROID_STORE_PASSWORD: secrets.storePassword,
    ANDROID_KEY_PASSWORD: secrets.keyPassword,
  })) {
    run(process.platform === 'win32' ? 'gh.exe' : 'gh', [
      'secret', 'set', name, '--repo', 'Necookie/NecookieAI_Monorepo',
    ], { input: value });
    console.log(`Stored ${name} in GitHub Actions secrets.`);
  }
}
