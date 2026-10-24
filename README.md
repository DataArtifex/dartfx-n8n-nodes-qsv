# n8n Community Node for datHere QSV (`@dartfx/n8n-nodes-qsv`)

[![npm version](https://img.shields.io/npm/v/@dartfx/n8n-nodes-qsv.svg)](https://www.npmjs.com/package/@dartfx/n8n-nodes-qsv)
[![CI](https://github.com/DataArtifex/dartfx-n8n-nodes-qsv/actions/workflows/ci.yml/badge.svg)](https://github.com/DataArtifex/dartfx-n8n-nodes-qsv/actions/workflows/ci.yml)
[![Docs](https://github.com/DataArtifex/dartfx-n8n-nodes-qsv/actions/workflows/sphinx.yaml/badge.svg)](https://dataartifex.github.io/dartfx-n8n-nodes-qsv/)
[![Ask DeepWiki](https://img.shields.io/badge/Ask-DeepWiki-6366f1.svg)](https://deepwiki.com/DataArtifex/dartfx-n8n-nodes-qsv)
[![n8n Community Node](https://img.shields.io/badge/n8n-community--node-ea4b71.svg)](https://docs.n8n.io/integrations/community-nodes/)
[![Powered by QSV](https://img.shields.io/badge/powered%20by-QSV-orange.svg)](https://github.com/dathere/qsv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> [!NOTE]
> Node APIs, parameters, and operation interfaces in `@dartfx/n8n-nodes-qsv` are actively expanding. Please report any issues or feature requests on [GitHub Issues](https://github.com/DataArtifex/dartfx-n8n-nodes-qsv/issues).

A custom [n8n](https://n8n.io/) community node for ultra-fast, zero-copy tabular data wrangling, transformation, validation, and analytics powered by [datHere QSV](https://github.com/dathere/qsv).

---

## ⚡ Key Features

- **File Path-First (Zero-Copy Architecture)**: Pass filesystem paths (`inputPath`, `outputPath`) between nodes to stream multi-gigabyte datasets directly through native Rust engines without overwhelming n8n memory. Downstream nodes can chain output directly with `{{ $json.outputPath }}`.
- **First-Class Positional & Typed Parameters**: Intuitive UI form fields for command-specific arguments (e.g. `selection` for `select`, `regex` for `search`, `sampleSize` for `sample`, `sql` for `sqlp`, `column`/`row`/`value` for `edit`) with precise docopt CLI argument ordering.
- **73+ Automated QSV Operations**: Full suite of high-performance tabular operations:
  - **Profiling & Analysis**: `stats`, `frequency`, `schema`, `sniff`, `count`, `moarstats`, `pragmastat`, `profile`
  - **Transformation & Cleaning**: `apply`, `behead`, `dedup`, `denull`, `fill`, `flatten`, `fmt`, `replace`, `safenames`, `rename`, `pseudo`, `edit`
  - **Slicing, Search & Sampling**: `index`, `slice`, `search`, `searchset`, `select`, `sample`, `split`, `partition`
  - **High-Speed SQL & Joins**: `sqlp` (Polars SQL engine), `join`, `joinp`, `pivotp`, `diff`, `explode`, `implode`
  - **Format Conversions**: `to` (Parquet, XLSX, SQLite, Postgres, ODS, DataPackage), `excel`, `json`, `jsonl`, `tojsonl`, `fixedwidth`, `geoconvert`
  - **AI & Web Services**: `describegpt` (LLM metadata/chat), `fetch`, `fetchpost`, `geocode`
  - **Advanced Scripting & Validation**: `luau` embedded scripting, `validate` (JSON Schema / RFC4180), `blake3` cryptographic hashing, `synthesize` (statistical test data generation)
- **Feature-Gated Command Diagnostics**: Tagged feature requirements in UI dropdowns (`[Feature: polars]`, `[Feature: synthesize]`, `[Feature: luau]`) with actionable `NodeOperationError` guidance if a host binary lacks a compiled feature.
- **Dynamic CLI Synchronizer**: `pnpm run generate:qsv` automatically queries `qsv --list` and keeps all node definitions and parameter forms synchronized with your installed QSV binary.

---

## 📦 Installation

### In self-hosted n8n instances:

Follow the [n8n Community Nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `@dartfx/n8n-nodes-qsv`.
4. Agree to the risks and select **Install**.

---

## 🛠 System Prerequisites

This community node executes the high-performance **[QSV CLI](https://github.com/dathere/qsv)** under the hood. The `qsv` binary **must be installed and accessible in the system `$PATH`** where n8n is running.

> [!IMPORTANT]
> **n8n 3.0+ Docker Deployment Requirement:**
> Starting with **n8n 3.0**, self-hosted n8n requires a **Docker-based deployment** (bare `npm` / `npx n8n` installations are deprecated/removed). Because the official n8n Docker image does not include the native `qsv` binary, you must either:
>
> 1. Use a **custom multi-stage Dockerfile** (recommended below) to bake `qsv` into your runtime container.
> 2. Mount a host-compiled `qsv` binary into `/usr/local/bin/qsv` in your container.

### 1. Host Installation (n8n v1 / v2 or Local Development)

- **macOS (Homebrew)**:
  ```bash
  brew install qsv
  ```
- **Debian / Ubuntu / Linux**:
  Download pre-compiled binaries from [QSV GitHub Releases](https://github.com/dathere/qsv/releases) or build via Cargo:
  ```bash
  cargo install qsv --locked --bin qsv --features all_features
  ```
- **Windows**:
  ```powershell
  scoop install qsv
  # or
  choco install qsv
  ```

### 2. Docker / Self-Hosted n8n Container (Required for n8n 3.0+)

If you run n8n using Docker (standard for n8n 3.0+), create a custom multi-stage Dockerfile that fetches the versioned `qsv` binary:

```dockerfile
# Stage 1: Fetch and unpack the QSV binary
FROM alpine:latest AS qsv-fetcher

# See https://github.com/dathere/qsv/releases for latest
ARG QSV_VERSION=23.0.1
RUN apk add --no-cache curl unzip \
    && ARCH=$(uname -m) \
    && if [ "$ARCH" = "x86_64" ]; then \
         QSV_ARCH="x86_64-unknown-linux-musl"; \
       elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then \
         QSV_ARCH="aarch64-unknown-linux-gnu"; \
       else \
         QSV_ARCH="x86_64-unknown-linux-musl"; \
       fi \
    && curl -fsSL "https://github.com/dathere/qsv/releases/download/${QSV_VERSION}/qsv-${QSV_VERSION}-${QSV_ARCH}.zip" -o /tmp/qsv.zip \
    && unzip -q -o /tmp/qsv.zip qsv -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/qsv

# Stage 2: n8n runtime image
FROM docker.n8n.io/n8nio/n8n:latest

USER root
COPY --from=qsv-fetcher /usr/local/bin/qsv /usr/local/bin/qsv
USER node
```

#### Docker Compose Example (`docker-compose.yml`)

```yaml
services:
  n8n:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_COMMUNITY_PACKAGES_ENABLED=true
      - DARTFX_QSV_BIN_PATH=/usr/local/bin/qsv
    volumes:
      - n8n_data:/home/node/.n8n
      - ./data:/data

volumes:
  n8n_data:
```

> [!TIP]
> **Pre-Baking `@dartfx/n8n-nodes-qsv` (Immutable Containers):**
> If you want the community node package pre-installed inside the image (no in-app installation step required), add this to the end of your `Dockerfile`:
> ```dockerfile
> USER node
> RUN cd ~/.n8n && npm install @dartfx/n8n-nodes-qsv
> ```

### 3. Environment Variables (Custom Binary Path)

If `qsv` is installed in a non-standard location or outside your default `$PATH`, configure one of the following environment variables on your n8n instance:

| Variable                    | Description                                                   | Default |
| :-------------------------- | :------------------------------------------------------------ | :------ |
| `DARTFX_QSV_BIN_PATH`       | Primary override for the QSV binary path used by DartFX nodes | —       |
| `QSV_BIN_PATH` / `QSV_PATH` | Generic fallback QSV binary path                              | —       |
| _(Fallback)_                | System `$PATH` resolution                                     | `qsv`   |

**Example in `.env` / Docker Compose:**

```env
DARTFX_QSV_BIN_PATH=/opt/custom/bin/qsv
```

- **Node.js**: v22+ (for local development & building)

---

## 📐 Versioning & Compatibility Strategy

This package follows a decoupled versioning model to support multiple independent node collections (e.g. QSV, Data Artifex FAIRification, Harvester):

### 1. Package Semantic Versioning (`@dartfx/n8n-nodes-qsv`)

- The package follows standard [Semantic Versioning](https://semver.org/) (starting at `0.1.0`).
- Package releases are **independent** of external CLI versioning numbers.
  - **Patch (`0.1.x`)**: Bug fixes, parameter corrections, and docs across any node collection.
  - **Minor (`0.x.0`)**: Adding new node collections, new operations, or non-breaking features.
  - **Major (`1.0.0`)**: Breaking changes in workflow node interfaces or execution contracts.

### 2. External Dependency Compatibility Matrix

Node collections that wrap host binaries declare and verify their target CLI versions:

| Node Collection               | Host Requirement        | Tested / Target CLI Version | Notes                                             |
| :---------------------------- | :---------------------- | :-------------------------- | :------------------------------------------------ |
| **QSV Data Wrangler** (`qsv`) | `qsv` binary in `$PATH` | `v23.0.1` (`>= 23.0.0`)     | Generated dynamically via `pnpm run generate:qsv` |
| **DartFx FAIR Nodes**         | None (pure JS/TS)       | N/A                         | Fully self-contained                              |

### 3. Workflow Upgrade Behavior in n8n

- **Non-breaking releases (Same `typeVersion: 1`)**: When an n8n instance installs a package update, existing workflows immediately execute the latest code without manual node re-configuration.
- **Breaking schema changes (`typeVersion: 2+`)**: If a node introduces breaking parameter schema changes, existing workflows remain safely pinned to `typeVersion: 1` until manually upgraded by the user in the n8n canvas.

---

## 💻 Development & Local Testing

### 1. Setup & Build

```bash
# Clone repository
git clone https://github.com/DataArtifex/dartfx-n8n-nodes-qsv.git
cd dartfx-n8n-nodes-qsv

# Use supported Node LTS (20/22)
nvm use

# Install dependencies
pnpm install

# Regenerate QSV node definitions from latest CLI help (if updating QSV commands)
pnpm run generate:qsv

# Or synchronize, test, and release against new QSV builds (with optional --otp):
pnpm run sync:qsv --dry-run
pnpm run sync:qsv --staging --publish --otp 123456

# Build package
pnpm run build

# Watch mode for active development
pnpm run dev
```

---

### 2. Testing with a Local n8n Instance

#### Method A: Docker Volume Mount (Standard & Required for n8n 3.0+)

For n8n 3.0+ or any Docker-based instance, mount your local built repository into the container's custom nodes folder:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd):/home/node/.n8n/custom/node_modules/@dartfx/n8n-nodes-qsv:ro \
  -v /path/to/local/qsv:/usr/local/bin/qsv:ro \
  docker.n8n.io/n8nio/n8n:latest
```

_(Note: `qsv` CLI must be mounted or baked into the Docker container's `$PATH` for QSV nodes to execute)._

#### Method B: Direct Local Link with `pnpm link <dir>` (n8n v1 / v2 Bare CLI)

If running an older n8n v1 or v2 instance directly via Node / npm on your host machine:

```bash
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
pnpm link /path/to/dartfx-n8n-nodes-qsv

# Start n8n
n8n start
```

> **🔄 Do changes auto-refresh?**
>
> - **Recompilation**: Running `pnpm run dev` automatically recompiles TypeScript into `dist/` on save.
> - **n8n Process**: **No**, n8n caches loaded node modules in memory on startup. You must **stop and restart n8n** (and reload your browser tab) whenever you update node code for changes to take effect.

#### Method C: Traditional 2-Step `npm link` (n8n v1 / v2 Bare CLI)

```bash
# Step 1: Register package globally
cd /path/to/dartfx-n8n-nodes-qsv
npm link

# Step 2: Link into n8n custom directory
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm link @dartfx/n8n-nodes-qsv

# Start n8n
n8n start
```

---

### 3. Troubleshooting & Permissions

#### macOS External Drive Permissions (`/Volumes/...` / `os error 2` / `os error 1`)

If you see errors like:

```text
Failed executing 'qsv count': io error: No such file or directory (os error 2)
# or
io error: Operation not permitted (os error 1)
```

when accessing files on external drives (under `/Volumes/<DriveName>/...`):

1. macOS restricts child processes spawned by Node from accessing external drives without user consent.
2. Go to **System Settings** > **Privacy & Security** > **Files and Folders** (or **Full Disk Access**).
3. Locate the application where you run `n8n` (e.g. **Terminal**, **iTerm2**, **VS Code**, or **Ghostty**).
4. Ensure **Removable Volumes** (and/or **Full Disk Access**) is toggled **ON**.
5. Restart your terminal / n8n session.

#### Docker Filesystem Paths

If n8n is running inside Docker, host filesystem paths like `/Volumes/...` or `/Users/...` are **not visible** inside the container by default. You must volume-mount the data directory into the container:

```bash
-v /Volumes/MyExternalDrive/data:/data:ro
```

and then reference the path inside n8n as `/data/myfile.csv`.

---

## 🚀 Deployment & Publishing (Staging & Production)

### 🔐 1. Authentication Setup

Publishing scoped packages under the `@dartfx` organization requires an npm access token:

- **In your local environment (user-level `~/.npmrc`):**
  ```bash
  pnpm config set "//registry.npmjs.org/:_authToken" "YOUR_NPM_TOKEN" --location=global
  ```
- **In GitHub Actions Secrets (CI/CD):**
  Set `DARTFX_NODE_AUTH_TOKEN` (or `NODE_AUTH_TOKEN` / `NPM_TOKEN`) in **Settings > Secrets and variables > Actions**.

---

### 🧪 2. Staging Deployment (Isolated Pre-Release)

To test the package in a live n8n instance without replacing or affecting the production `latest` release:

1. **Simulate package build & inspect tarball (Zero Risk):**
   ```bash
   pnpm publish --dry-run --no-git-checks
   ```

2. **Set a pre-release version without creating a Git tag:**
   ```bash
   pnpm version 0.2.0-staging.0 --no-git-tag-version
   ```

3. **Publish to npm with the `staging` dist-tag:**
   ```bash
   pnpm publish --tag staging --access public --no-git-checks
   ```

4. **Install and verify in n8n:**
   In n8n (**Settings > Community Nodes > Install**), specify:
   ```text
   @dartfx/n8n-nodes-qsv@staging
   ```
   *(or exact version `@dartfx/n8n-nodes-qsv@0.2.0-staging.0`)*

---

### 🚢 3. Production Deployment

#### Option A: Automated via Git Tag & GitHub Actions (Recommended)

Pushing an annotated version tag triggers the [.github/workflows/publish.yml](.github/workflows/publish.yml) workflow:

```bash
# 1. Clean working tree and run checks
pnpm run lint && pnpm run test && pnpm run build

# 2. Bump production version and create git tag
pnpm version patch -m "chore(release): %s"  # or minor / major

# 3. Push commit and tag to GitHub
git push origin main --follow-tags
```

#### Option B: Promote Existing Staged Version to Production

Promote a tested staging release to `latest` without rebuilding:

```bash
npm dist-tag add @dartfx/n8n-nodes-qsv@0.2.0-staging.0 latest
```

#### Option C: Manual CLI Production Publish

```bash
pnpm publish --tag latest --access public
```

---

See [AGENT.md](AGENT.md) for full architecture and development workflows, and [RELEASING.md](RELEASING.md) for detailed release policies and semver guide.
