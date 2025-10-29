# Security helpers

This folder contains small helper scripts and guidance for managing demo cryptographic keys and other security artifacts for development and testing only.

Important:
- Never commit private keys or secrets to the repository.
- Use the provided scripts to generate keys locally and store them outside version control.

Files:
- `generate_keys.ps1` - PowerShell script that calls `openssl` to create an RSA keypair (if you have OpenSSL installed).
- `generate_keys_node.js` - Node.js script that generates an RSA keypair using Node's crypto API.
- `.gitignore` - prevents private keys from being accidentally committed.

Usage examples (PowerShell):
1. Open PowerShell in the project root.
2. Run: `.\in\sec\generate_keys.ps1 -OutDir .\\sec` (or run the Node script)

Or via Node (cross-platform):
```powershell
node sec/generate_keys_node.js
```

After generating keys, keep the private key (`private.pem`) safe and do not commit it. Use the public key (`public.pem`) for distributing to clients/servers as needed.
