// Simple Node.js script to generate an RSA keypair and write to sec/private.pem and sec/public.pem
const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname);
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});

fs.writeFileSync(path.join(outDir, 'private.pem'), privateKey, { mode: 0o600 });
fs.writeFileSync(path.join(outDir, 'public.pem'), publicKey);
console.log('Generated private.pem and public.pem in sec/ (private.pem is mode 600).');
