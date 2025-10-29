# Security notes and key management (demo)

This project contains a `sec/` helper folder with scripts to generate demo keypairs for development and testing.

Important guidelines:

- Never commit private keys to the repository. The provided `.gitignore` in `sec/` will ignore common key filenames but always double-check.
- For production, use secure, audited key management services (KMS) such as AWS KMS, Azure Key Vault, or Google Cloud KMS.
- For demo encryption flows, prefer asymmetric encryption where the client uses the server's public key to encrypt ballots and the server uses its private key to decrypt.

Demo workflow suggested:
1. Generate an RSA keypair locally using `node sec/generate_keys_node.js`.
2. Keep `sec/private.pem` private and never push it to git. Use `sec/public.pem` for client-side encryption or to embed in a server configuration.
3. For local testing, the Express demo server can read `sec/private.pem` and decrypt incoming payloads. If you want that implemented, ask and I will wire it up.

If you want, I can:
- Wire the server to decrypt encrypted votes using the generated private key (demo only).
- Convert the client encryption flow to use the server's public key (asymmetric) instead of deriving a symmetric key from a passphrase.
- Add a small README with recommended processes for production (KMS, HSM, audit logging).
