# Release & Deployment Guide

This document defines the lifecycle, versioning rules, and workflows for **Staging** (isolated pre-release testing) and **Production** (general availability) deployments of `@dartfx/n8n-nodes-qsv`.

---

## 🧭 Staging vs. Production at a Glance

| Feature / Step | 🧪 Staging Deployment | 🚢 Production Deployment |
| :--- | :--- | :--- |
| **Target Channel (dist-tag)** | `--tag staging` (or `beta`) | `latest` (default npm channel) |
| **SemVer Format** | `0.1.0-staging.0` (pre-release) | `0.1.0` (stable release) |
| **Git Tag Created?** | **No** (`--no-git-tag-version`) | **Yes** (`v0.1.0` annotated tag) |
| **Triggers CI/CD?** | No (manual CLI push) | **Yes** (GitHub Actions triggers on `v*` tag) |
| **Who Receives It?** | Only test instances specifying `@staging` | All users installing `@dartfx/n8n-nodes-qsv` |
| **Git Hygiene Check** | Bypassed (`--no-git-checks`) | Enforced (clean working tree on `main`) |
| **npm Provenance** | Optional | **Enforced** (`--provenance` via OIDC) |

---

## 🏷️ Versioning Principles (SemVer)

Follow [Semantic Versioning 2.0.0](https://semver.org/):

| Type | Format | When to use |
| :--- | :--- | :--- |
| **Staging / Pre-release** | `0.1.0-staging.0` | Feature validation, sandbox testing, CI smoke tests. |
| **Patch** | `0.1.0` $\rightarrow$ `0.1.1` | Bug fixes, doc updates, dependency upgrades, internal refactors. |
| **Minor** | `0.1.0` $\rightarrow$ `0.2.0` | Backward-compatible features, new node commands or properties. |
| **Major** | `0.1.0` $\rightarrow$ `1.0.0` | Breaking changes to node properties, schemas, or engine requirements. |

### Upstream QSV Version Alignment vs. Decoupled SemVer

A common question when maintaining wrappers and community nodes is: **How should the npm package version reflect QSV's version (currently `26.0.0`)?**

#### 🌟 Recommended Middle Ground: Align on Minor Version (`0.<QSV_MAJOR>.<PATCH>`, e.g. `0.26.0`)
Aligning the **minor version** to QSV's major version is an elegant, highly effective strategy:
- **Instant Recognition**: Users and developers immediately see that `@dartfx/n8n-nodes-qsv@0.26.0` corresponds to **QSV 26**.
- **Reserved Patch Channel for Node Fixes**: The patch number (`0.26.1`, `0.26.2`, etc.) remains available for independent node bug fixes, UI improvements, or dependency patches without colliding with QSV releases.
- **Natural Cadence**: When QSV releases `27.0.0`, the package transitions to `0.27.0`.

#### Comparison of Versioning Strategies:
| Strategy | Example | Pros | Considerations |
| :--- | :--- | :--- | :--- |
| **Minor Alignment (Recommended)** | `0.26.0` $\rightarrow$ `0.26.1` | Instant visual match with QSV 26; preserves patch digit for independent node maintenance. | Operates in SemVer `0.x` pre-1.0 series. |
| **Strict Upstream Mirror** | `26.0.0` | Exact 1:1 match with upstream CLI. | Skips 25 major versions; node-only bug fixes risk colliding with upstream patch numbers. |
| **Fully Decoupled SemVer** | `0.3.0` | Pure independent SemVer tracking. | Requires checking README / metadata to know which QSV version is targeted. |

---

## ⚡ Automated QSV Synchronization & Release Script

The project provides an automated tool (`scripts/sync-qsv-release.ts` / `pnpm run sync:qsv`) to synchronize node definitions with QSV, compile, test, and release.

### Workflow 1: Using your Locally Compiled QSV Binary (Default)
If you clone QSV from GitHub and build the binary locally on your machine (`cargo build --release`):

```bash
# 1. Preview changes and build in dry-run mode (zero risk):
pnpm run sync:qsv --dry-run

# 2. Publish to npm staging channel for live n8n testing (requires OTP):
pnpm run release:staging --otp 123456

# 3. Production Release (Single Unified Path via GitHub Actions):
# Regenerates, runs QA, commits, creates tag v0.26.0, and pushes to GitHub:
pnpm run release:prod
# -> GitHub Actions triggers on the tag, builds on a clean runner, and publishes
#    to npm with cryptographic provenance attestation via OIDC (zero duplicate attempts).
```

> [!TIP]
> **Why `--otp <code>` is recommended:**
> Modern npm accounts enforce Two-Factor Authentication (2FA) for write operations. When publishing from a terminal script, web-based authentication (`https://www.npmjs.com/auth/cli/...`) can get stuck waiting for TTY carriage returns.
> Passing `--otp 123456` with your 6-digit authenticator code (from 1Password, Google Authenticator, etc.) directly satisfies npm's 2FA and publishes in seconds without opening a browser.

### Workflow 2: Synchronizing from Upstream GitHub Releases
If you want the tool to automatically check and fetch pre-built release assets from GitHub:

```bash
# Check if a newer upstream release exists:
pnpm run sync:qsv:check

# Synchronize against upstream release:
pnpm run sync:qsv:upstream --dry-run
```

---

## 🧪 Staging Deployment Workflow (Pre-Release Testing)

Use staging to test node bundling, npm resolution, and live n8n community node installation without affecting production users:

### 1. Local Dry-Run Verification (Zero Risk)
Simulate packaging to verify TypeScript compilation and icon bundling:
```bash
pnpm pack --dry-run
pnpm publish --dry-run --no-git-checks
```

### 2. Set Pre-Release Version (No Git Commit / Tag)
Update `package.json` without cluttering Git history:
```bash
pnpm version 0.2.0-staging.0 --no-git-tag-version
```

### 3. Publish to npm

#### Option 1: Publish to the Isolated `staging` Channel (Recommended for pre-releases)
This publishes the package without changing the default `latest` version that standard users install:
```bash
pnpm publish --tag staging --access public --no-git-checks
```

#### Option 2: Publish Directly as the Default (`latest`) Channel
If you want the version to immediately become the default `latest` upon publish, simply omit `--tag staging` (or explicitly specify `--tag latest`):
```bash
pnpm publish --tag latest --access public --no-git-checks
```

### 4. Promote / Re-point Dist-Tags (Make Any Version `latest`)
If a version was already published under the `staging` tag and you now want to make it the default `latest` without republishing:
```bash
npm dist-tag add @dartfx/n8n-nodes-qsv@0.2.0-staging.0 latest
```

To list all active distribution tags:
```bash
npm dist-tag ls @dartfx/n8n-nodes-qsv
```

### 5. Verify in a Live n8n Instance
In n8n (**Settings > Community Nodes > Install**), specify:
- Default `latest` channel:
  ```text
  @dartfx/n8n-nodes-qsv
  ```
- Specific `staging` channel:
  ```text
  @dartfx/n8n-nodes-qsv@staging
  ```
- Specific exact version:
  ```text
  @dartfx/n8n-nodes-qsv@0.2.0-staging.0
  ```

---

## 🚢 Production Deployment Workflow (General Availability)

### Option A: Automated via Git Tag & GitHub Actions (Recommended)

Production releases are triggered only when an annotated version tag (e.g. `v0.2.0`) is pushed to GitHub:

1. **Ensure Working Tree is Clean & Validated:**
   ```bash
   git checkout main
   git pull origin main
   pnpm install --frozen-lockfile
   pnpm run lint
   pnpm run test
   pnpm run build
   ```

2. **Update [CHANGELOG.md](CHANGELOG.md):**
   Document release notes under `## [0.2.0] - YYYY-MM-DD`.

3. **Bump Production Version & Create Git Tag:**
   ```bash
   # Patch release (e.g., 0.1.0 -> 0.1.1)
   pnpm version patch -m "chore(release): %s"

   # Minor release (e.g., 0.1.0 -> 0.2.0)
   pnpm version minor -m "chore(release): %s"

   # Major release (e.g., 0.1.0 -> 1.0.0)
   pnpm version major -m "chore(release): %s"
   ```

4. **Push Commit and Tag to Trigger GitHub Actions CI/CD:**
   ```bash
   git push origin main --follow-tags
   # Or push tag individually:
   # git push origin v0.2.0
   ```
   *GitHub Actions will automatically run `.github/workflows/publish.yml`, building, testing, and publishing to npm with cryptographic provenance attestation via OIDC.*

---

### Option B: Promote Existing Staging Release to Production (`latest`)

If you have already thoroughly tested a staging build on npm and want to promote it to `latest` without rebuilding or creating a git tag:

```bash
npm dist-tag add @dartfx/n8n-nodes-qsv@0.2.0-staging.0 latest
```

---

### Option C: Manual CLI Production Publish (Fallback)

```bash
pnpm publish --tag latest --access public
```

---

## 🔍 Inspecting & Verifying Releases (Bypassing Browser CDN Cache)

Because `npmjs.com` web pages are cached behind a 2–5 minute CDN edge layer, use direct CLI queries to immediately verify live registry states and Git tags:

### 1. Query npm Registry Directly (Real-Time API)

- **View active distribution tags (`latest`, `staging`):**
  ```bash
  npm view @dartfx/n8n-nodes-qsv dist-tags
  ```
  *Example output: `{ staging: '0.2.0-staging.1', latest: '0.2.0' }`*

- **Check current version served as `latest`:**
  ```bash
  npm view @dartfx/n8n-nodes-qsv version
  ```

- **List all published versions across history:**
  ```bash
  npm view @dartfx/n8n-nodes-qsv versions
  ```

### 2. Query Local & Remote Git State

- **Check latest tag on current branch:**
  ```bash
  git describe --tags --abbrev=0
  ```

- **List all Git tags sorted by SemVer (newest first):**
  ```bash
  git tag -l --sort=-v:refname
  ```

- **Check live tags on GitHub remote:**
  ```bash
  git ls-remote --tags origin
  ```

- **Check local `package.json` version:**
  ```bash
  node -p "require('./package.json').version"
  ```

---

## 🔐 NPM Authentication & OIDC Trusted Publishers

### Modern Tokenless OIDC via Trusted Publishers (Recommended for CI/CD)

npm supports **Trusted Publishers** via OpenID Connect (OIDC), eliminating static tokens from GitHub Actions.

#### 1. Bootstrap: Initial First-Time Publish
Because `@dartfx/n8n-nodes-qsv` is a brand new package, it must be published **once** manually with your personal access token before npm exposes package settings:
```bash
pnpm publish --tag staging --access public --no-git-checks
```

#### 2. Configure Trusted Publisher on npmjs.com
Once the package exists on npm:
1. Log in to [npmjs.com](https://www.npmjs.com/) and open the package access page:
   `https://www.npmjs.com/package/@dartfx/n8n-nodes-qsv/access`
2. Under **Trusted Publishers**, click **Add Trusted Publisher**.
3. Choose **GitHub Actions** and fill in:
   - **GitHub Organization / Owner**: `DataArtifex`
   - **Repository**: `dartfx-n8n-nodes-qsv`
   - **Workflow filename**: `publish.yml`
   - **Environment**: *(Leave blank unless using GitHub Environments)*
4. Click **Add Publisher**.

Subsequent automated releases via [.github/workflows/publish.yml](.github/workflows/publish.yml) will execute **100% tokenless via OIDC** with verified provenance attestation (`id-token: write`).

---

### Traditional Static Token (Local CLI / Fallback)

For local CLI releases:
1. Generate an npm **Automation Token** on [npmjs.com](https://www.npmjs.com/).
2. Add your token to your user's global `~/.npmrc`:
   ```bash
   pnpm config set "//registry.npmjs.org/:_authToken" "$NODE_AUTH_TOKEN" --location=global
   ```
3. In GitHub Actions (as fallback), configure `DARTFX_NODE_AUTH_TOKEN` in **Settings > Secrets and variables > Actions**.
