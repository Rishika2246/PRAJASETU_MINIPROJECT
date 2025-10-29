// Minimal Web Crypto helpers for demo encryption (AES-GCM)
export async function deriveKeyFromPassphrase(passphrase: string, salt?: Uint8Array) {
  const enc = new TextEncoder();
  const passKey = await window.crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  const usedSalt = salt || window.crypto.getRandomValues(new Uint8Array(16));
  const key = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: usedSalt, iterations: 100000, hash: 'SHA-256' },
    passKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  return { key, salt: usedSalt };
}

export async function encryptJSON(key: CryptoKey, data: any) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(JSON.stringify(data))
  );
  // return base64 chunks
  const ctArr = new Uint8Array(ciphertext);
  return { iv: arrayBufferToBase64(iv), ciphertext: arrayBufferToBase64(ctArr.buffer) };
}

export async function decryptJSON(key: CryptoKey, ivB64: string, ctB64: string) {
  const iv = base64ToArrayBuffer(ivB64);
  const ct = base64ToArrayBuffer(ctB64);
  const dec = new TextDecoder();
  const plain = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, key, ct);
  return JSON.parse(dec.decode(new Uint8Array(plain)));
}

function arrayBufferToBase64(buf: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
