# Docker Setup

## Quick Start

**Note:** The docker files of this project are not compatible with Podman.
In order to run the services of this project, you must use Docker.

### Option 1: Regular Users (No Proxy)

```bash
cp ./docker/.env.example ./docker/.env
./docker/scripts/wallet-ecosystem-http.sh
```

### Option 2: Corporate Users (Behind Proxy)

```bash
cp ./docker/.env.proxy ./docker/.env

# Edit .env to add your proxy URL:
# HTTP_PROXY=http://your-proxy:8080
# HTTPS_PROXY=http://your-proxy:8080

# Export your proxy's certificate chain (must include all intermediate certificates):
# From Chrome: Settings > Privacy > Security > Manage certificates > Export (choose "Base64-encoded certificate chain")
# From Firefox: Settings > Privacy & Security > View Certificates > Export (include certificate chain)
# From command line: openssl s_client -connect proxy.company.com:8080 -showcerts < /dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > proxy-cert.crt
cp /path/to/your/proxy-certificate.crt ./docker/proxy-cert.crt
cp /path/to/your/proxy-certificate.crt ./docker/config/eudi-verifier/proxy-cert.crt

./docker/scripts/wallet-ecosystem-http.sh
```

The `.env` file configures both wallet-ecosystem and EUDI verifier services.

**Note**: The EUDI verifier uses the official gradle Docker image which includes gradle pre-installed, avoiding wrapper download issues.

### Option 3: Building Custom EUDI Verifier (Corporate Nexus)

If you need to build a custom EUDI verifier with modifications:

```bash
cd ./docker/config/eudi-verifier
cp .env.example .env

# Edit .env to add:
# - Proxy settings (if needed)
# - Corporate Nexus repository URLs
# NEXUS_BASE_URL=https://your-nexus/repository
# NEXUS_MAVEN_CENTRAL=${NEXUS_BASE_URL}/maven-central
# NEXUS_GRADLE=${NEXUS_BASE_URL}/gradle

# If using proxy with self-signed cert:
cp /path/to/proxy-cert.crt proxy-cert.crt

cd ../..
./build-eudi-verifier-nexus.sh
```

This builds a custom EUDI verifier that:

- Uses your corporate Nexus repository (avoids external SSL issues)
- Automatically excludes Nexus domains from proxy
- Includes modified `SdJwtVcValidator` for HTTP issuer support

### Option 4. Running in WLS on a Digg computer

1. First follow all instructions for [option 2](#option-2-corporate-users-behind-proxy).

2. Update wallet frontend to access backend on localhost:

    ```bash
    cp ./docker/wallet-ecosystem/wallet-frontend/.env{.template,}
    sed --in-place 's/wallet-backend-server/localhost/' ./docker/wallet-ecosystem/wallet-frontend/.env
    docker compose -f docker/wallet-ecosystem/docker-compose.yml restart wallet-frontend
    ```

## Access URLs

- Wallet: <http://localhost:3000/>
- Custom Verifier: <http://localhost:3002/>
- EUDI Backend: <http://localhost:8080/>

## Troubleshooting

### WSL Permission Error

If wallet-frontend fails with permission denied:

```bash
chmod -R 777 ./docker/wallet-ecosystem/wallet-frontend/public
```

### Environment Variables

- `NODE_TLS_REJECT_UNAUTHORIZED=0` - Disables SSL verification for Node.js (proxies)
