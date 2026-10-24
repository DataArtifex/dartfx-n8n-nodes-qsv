#!/usr/bin/env tsx

import { execSync, spawnSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

interface SyncOptions {
  qsvVersion?: string;
  pkgVersion?: string;
  bumpType?: "patch" | "minor" | "major";
  alignVersion?: boolean;
  alignMinor?: boolean;
  checkOnly?: boolean;
  downloadBin?: boolean;
  updateWorkflows?: boolean;
  updateChangelog?: boolean;
  dryRun?: boolean;
  publish?: boolean;
  tag?: string;
  gitTag?: boolean;
  skipTests?: boolean;
  skipBuild?: boolean;
  qsvBin?: string;
  local?: boolean;
  otp?: string;
  push?: boolean;
}

const ROOT_DIR = path.resolve(__dirname, "..");
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, "package.json");
const CHANGELOG_PATH = path.join(ROOT_DIR, "CHANGELOG.md");
const CI_WORKFLOW_PATH = path.join(ROOT_DIR, ".github", "workflows", "ci.yml");
const PUBLISH_WORKFLOW_PATH = path.join(
  ROOT_DIR,
  ".github",
  "workflows",
  "publish.yml",
);

function log(msg: string) {
  console.log(`[sync-qsv] ${msg}`);
}

function logSuccess(msg: string) {
  console.log(`[sync-qsv] \x1b[32m✓\x1b[0m ${msg}`);
}

function logWarn(msg: string) {
  console.warn(`[sync-qsv] \x1b[33m⚠\x1b[0m ${msg}`);
}

function logError(msg: string) {
  console.error(`[sync-qsv] \x1b[31m✗\x1b[0m ${msg}`);
}

function parseCliArgs(): SyncOptions {
  const args = process.argv.slice(2);
  const options: SyncOptions = {
    dryRun: false,
    publish: false,
    alignVersion: false,
    alignMinor: false,
    checkOnly: false,
    downloadBin: false,
    updateWorkflows: true,
    updateChangelog: true,
    gitTag: false,
    tag: "latest",
    local: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (arg === "--qsv-version" && args[i + 1]) {
      options.qsvVersion = args[++i].replace(/^v/, "");
    } else if (arg === "--pkg-version" && args[i + 1]) {
      options.pkgVersion = args[++i].replace(/^v/, "");
    } else if (arg === "--bump" && args[i + 1]) {
      const b = args[++i] as "patch" | "minor" | "major";
      if (["patch", "minor", "major"].includes(b)) {
        options.bumpType = b;
      } else {
        logError(`Invalid bump type: ${b}. Choose patch, minor, or major.`);
        process.exit(1);
      }
    } else if (arg === "--align-version") {
      options.alignVersion = true;
    } else if (arg === "--align-minor") {
      options.alignMinor = true;
    } else if (arg === "--local") {
      options.local = true;
    } else if (arg === "--qsv-bin" && args[i + 1]) {
      options.qsvBin = args[++i];
    } else if (arg === "--check-only") {
      options.checkOnly = true;
    } else if (arg === "--download-bin") {
      options.downloadBin = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--publish") {
      options.publish = true;
    } else if (arg === "--staging") {
      options.tag = "staging";
    } else if (arg === "--tag" && args[i + 1]) {
      options.tag = args[++i];
    } else if (arg === "--git-tag") {
      options.gitTag = true;
    } else if (arg === "--push") {
      options.push = true;
      options.gitTag = true; // --push implies --git-tag
    } else if (arg === "--no-workflows") {
      options.updateWorkflows = false;
    } else if (arg === "--no-changelog") {
      options.updateChangelog = false;
    } else if (arg === "--otp" && args[i + 1]) {
      options.otp = args[++i];
    } else if (arg.startsWith("--otp=")) {
      options.otp = arg.slice(6);
    } else if (arg === "--skip-tests") {
      options.skipTests = true;
    } else if (arg === "--skip-build") {
      options.skipBuild = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Sync & Release Tool for @dartfx/n8n-nodes-qsv
=====================================================

Synchronizes the n8n community node definitions with datHere QSV releases,
regenerating TypeScript descriptions, action handlers, tests, workflows,
and orchestrating staging/production npm package releases.

USAGE:
  pnpm run sync:qsv [OPTIONS]
  tsx scripts/sync-qsv-release.ts [OPTIONS]

LOCAL COMPILATION & BINARY SELECTION:
  --local                Use locally compiled host QSV binary without querying GitHub.
  --qsv-bin <path>       Specify path to custom/compiled QSV binary (or $DARTFX_QSV_BIN_PATH).
  --download-bin         Download & extract the target QSV binary if not present locally.

VERSIONING & DISCOVERY:
  --align-minor          Align package minor version to QSV major (e.g. QSV 26.0.0 -> 0.26.0).
  --align-version        Align package version directly with QSV's version (e.g. 26.0.0).
  --qsv-version <ver>    Target QSV version (e.g. 26.0.0). Defaults to latest GitHub release.
  --bump <type>          SemVer bump for the package: 'patch', 'minor', 'major'.
  --pkg-version <ver>    Explicit package version to set in package.json (e.g. 0.26.0).
  --check-only           Check for upstream QSV releases without generating or publishing.

WORKFLOWS & CHANGELOG:
  --no-workflows         Do not update QSV download URLs in GitHub Actions workflows.
  --no-changelog         Do not append a new section to CHANGELOG.md.

PUBLISHING & QUALITY GATES:
  --dry-run              Run full generation, compilation, tests, and npm dry-run without publishing.
  --publish              Publish the package to npm.
  --otp <code>           (Recommended) 6-digit npm 2FA authenticator code for seamless publishing without web auth.
  --staging              Publish with dist-tag 'staging' (pre-release testing).
  --tag <name>           Specify custom npm dist-tag (default: 'latest').
  --git-tag              Create an annotated git commit and tag (e.g. v0.26.0).
  --skip-tests           Skip running linter and Jest tests.
  --skip-build           Skip TypeScript/gulp compilation.
  -h, --help             Show this help guide.

EXAMPLES:
  # 1. Synchronize using your locally compiled QSV binary with minor alignment (e.g. 0.26.0):
  pnpm run sync:qsv --dry-run

  # 2. Point to a specific compiled release binary:
  pnpm run sync:qsv --qsv-bin ../qsv/target/release/qsv --dry-run

  # 3. Publish to npm staging channel with 2FA OTP (Recommended):
  pnpm run sync:qsv --staging --publish --otp 123456

  # 4. Create git tag and publish production release with OTP:
  pnpm run sync:qsv --git-tag --publish --otp 123456
`);
}

async function fetchLatestQsvRelease(): Promise<string | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/dathere/qsv/releases/latest",
      {
        headers: {
          "User-Agent": "dartfx-n8n-nodes-qsv-sync",
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) {
      logWarn(
        `GitHub API responded with status ${res.status}: ${res.statusText}`,
      );
      return null;
    }
    const data: any = await res.json();
    if (data && data.tag_name) {
      return data.tag_name.replace(/^v/, "");
    }
  } catch (err: any) {
    logWarn(`Could not reach GitHub API: ${err.message}`);
  }
  return null;
}

function getHostQsvVersion(binPath: string = "qsv"): string | null {
  try {
    const out = execSync(`${binPath} --version`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const match = out.match(/^qsv\s+([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function getTargetAssetArchiveName(qsvVersion: string): {
  url: string;
  binName: string;
} {
  const platform = os.platform();
  const arch = os.arch();
  let archTarget = "";

  if (platform === "darwin") {
    archTarget =
      arch === "arm64" ? "aarch64-apple-darwin" : "x86_64-apple-darwin";
  } else if (platform === "linux") {
    archTarget =
      arch === "arm64"
        ? "aarch64-unknown-linux-gnu"
        : "x86_64-unknown-linux-musl";
  } else if (platform === "win32") {
    archTarget = "x86_64-pc-windows-msvc";
  } else {
    throw new Error(`Unsupported platform: ${platform} (${arch})`);
  }

  const ext = platform === "win32" ? ".zip" : ".zip";
  const binName = platform === "win32" ? "qsv.exe" : "qsv";
  const url = `https://github.com/dathere/qsv/releases/download/${qsvVersion}/qsv-${qsvVersion}-${archTarget}${ext}`;

  return { url, binName };
}

async function downloadAndExtractQsv(
  qsvVersion: string,
  destDir: string,
): Promise<string> {
  fs.mkdirSync(destDir, { recursive: true });
  const { url, binName } = getTargetAssetArchiveName(qsvVersion);
  const zipPath = path.join(destDir, `qsv-${qsvVersion}.zip`);
  const binPath = path.join(destDir, binName);

  if (fs.existsSync(binPath)) {
    const installedVer = getHostQsvVersion(binPath);
    if (installedVer === qsvVersion) {
      logSuccess(`Found cached QSV v${qsvVersion} at ${binPath}`);
      return binPath;
    }
  }

  log(`Downloading QSV v${qsvVersion} from ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to download QSV release asset from ${url}: ${res.statusText}`,
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(zipPath, Buffer.from(arrayBuffer));

  log(`Extracting ${zipPath}...`);
  execSync(`unzip -o "${zipPath}" "${binName}" -d "${destDir}"`, {
    stdio: "inherit",
  });
  fs.chmodSync(binPath, 0o755);
  fs.unlinkSync(zipPath);

  logSuccess(`Extracted QSV v${qsvVersion} binary to ${binPath}`);
  return binPath;
}

function bumpSemver(
  version: string,
  type: "patch" | "minor" | "major",
): string {
  const clean = version.split("-")[0];
  const parts = clean.split(".").map((n) => parseInt(n, 10));
  if (parts.length < 3 || parts.some(isNaN)) {
    return `${version}.1`;
  }
  if (type === "major") {
    return `${parts[0] + 1}.0.0`;
  } else if (type === "minor") {
    return `${parts[0]}.${parts[1] + 1}.0`;
  } else {
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }
}

function isGitTagExisting(tagName: string): boolean {
  try {
    const tags = execSync(`git tag -l "${tagName}"`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    return tags.split("\n").includes(tagName);
  } catch {
    return false;
  }
}

/**
 * Maps QSV Major to package Minor (e.g. QSV 26.0.0 -> 0.26.0).
 * If the release has not yet been tagged in Git, it remains on 0.26.0.
 * If v0.26.0 is already tagged, it increments the patch (0.26.1).
 * For staging channels, it formats as a pre-release (e.g. 0.26.0-staging.0).
 */
function getAlignedMinorVersion(
  currentPkgVersion: string,
  qsvVersion: string,
  isStaging: boolean = false,
): string {
  const qsvMajor = qsvVersion.split(".")[0];
  const baseTarget = `0.${qsvMajor}.0`;

  let baseVersion = baseTarget;
  if (isGitTagExisting(`v${baseTarget}`)) {
    const pkgParts = currentPkgVersion.split("-")[0].split(".");
    const currentMinor = pkgParts[1];
    if (currentMinor === qsvMajor) {
      const patch = parseInt(pkgParts[2] || "0", 10) + 1;
      baseVersion = `0.${qsvMajor}.${patch}`;
    }
  }

  if (isStaging) {
    return `${baseVersion}-staging.0`;
  }
  return baseVersion;
}

function updateWorkflowFiles(qsvVersion: string) {
  if (fs.existsSync(PUBLISH_WORKFLOW_PATH)) {
    let content = fs.readFileSync(PUBLISH_WORKFLOW_PATH, "utf8");
    const updated = content.replace(
      /https:\/\/github\.com\/dathere\/qsv\/releases\/download\/[0-9.]+\/qsv-[0-9.]+-x86_64-unknown-linux-musl\.zip/g,
      `https://github.com/dathere/qsv/releases/download/${qsvVersion}/qsv-${qsvVersion}-x86_64-unknown-linux-musl.zip`,
    );
    if (content !== updated) {
      fs.writeFileSync(PUBLISH_WORKFLOW_PATH, updated, "utf8");
      logSuccess(`Updated .github/workflows/publish.yml to QSV v${qsvVersion}`);
    }
  }

  if (fs.existsSync(CI_WORKFLOW_PATH)) {
    let content = fs.readFileSync(CI_WORKFLOW_PATH, "utf8");
    let updated = content.replace(/v[0-9]+\.[0-9]+\.[0-9]+/g, (match) => {
      return match.startsWith("v") ? `v${qsvVersion}` : match;
    });
    updated = updated.replace(
      /download\/[0-9.]+\/qsv-[0-9.]+-/g,
      `download/${qsvVersion}/qsv-${qsvVersion}-`,
    );
    if (content !== updated) {
      fs.writeFileSync(CI_WORKFLOW_PATH, updated, "utf8");
      logSuccess(
        `Updated .github/workflows/ci.yml cache and download URLs to QSV v${qsvVersion}`,
      );
    }
  }
}

function appendChangelog(pkgVersion: string, qsvVersion: string) {
  if (!fs.existsSync(CHANGELOG_PATH)) return;

  const content = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const today = new Date().toISOString().split("T")[0];
  const versionHeader = `## [${pkgVersion}] - ${today}`;

  if (content.includes(versionHeader)) {
    return;
  }

  const newEntry = `
${versionHeader}

### Changed

- **Synchronized with datHere QSV v${qsvVersion}**:
  - Regenerated all non-interactive QSV operations with updated CLI parameter definitions and tool schemas.
  - Updated operational descriptions, category hints, and command options.
`;

  const marker = "## [";
  const firstSectionIndex = content.indexOf(marker);

  if (firstSectionIndex !== -1) {
    const updatedContent =
      content.slice(0, firstSectionIndex) +
      newEntry.trim() +
      "\n\n" +
      content.slice(firstSectionIndex);
    fs.writeFileSync(CHANGELOG_PATH, updatedContent, "utf8");
    logSuccess(
      `Added release entry to CHANGELOG.md for v${pkgVersion} (QSV v${qsvVersion})`,
    );
  }
}

async function main() {
  const options = parseCliArgs();

  console.log("=====================================================");
  console.log(" 🚀 @dartfx/n8n-nodes-qsv Release & Sync Synchronizer");
  console.log("=====================================================\n");

  // Determine QSV binary path to use
  let qsvBinPath =
    options.qsvBin ||
    process.env.DARTFX_QSV_BIN_PATH ||
    process.env.QSV_BIN_PATH ||
    "qsv";

  // Read current package.json
  const pkgRaw = fs.readFileSync(PACKAGE_JSON_PATH, "utf8");
  const pkg = JSON.parse(pkgRaw);
  const currentPkgVersion: string = pkg.version || "0.2.1";
  const currentQsvTarget: string = pkg.qsvVersion || "24.0.0";

  log(`Current package version: \x1b[36mv${currentPkgVersion}\x1b[0m`);
  log(`Current target QSV version: \x1b[36mv${currentQsvTarget}\x1b[0m`);

  // Determine target QSV version
  let targetQsvVersion = options.qsvVersion;

  if (options.local) {
    log(`Using local QSV binary at: ${qsvBinPath}`);
    const localVer = getHostQsvVersion(qsvBinPath);
    if (!localVer) {
      logError(
        `Could not determine QSV version from local binary '${qsvBinPath}'.`,
      );
      process.exit(1);
    }
    targetQsvVersion = localVer;
    logSuccess(`Detected local QSV binary version: v${targetQsvVersion}`);
  } else if (!targetQsvVersion) {
    log("Checking GitHub API for latest QSV release...");
    const latestUpstream = await fetchLatestQsvRelease();
    if (latestUpstream) {
      targetQsvVersion = latestUpstream;
      logSuccess(
        `Discovered latest upstream QSV release: v${targetQsvVersion}`,
      );
    } else {
      const hostVer = getHostQsvVersion(qsvBinPath);
      if (hostVer) {
        targetQsvVersion = hostVer;
        log(`Using local host QSV version: v${targetQsvVersion}`);
      } else {
        targetQsvVersion = currentQsvTarget;
        logWarn(
          `Could not discover latest QSV version; falling back to current: v${targetQsvVersion}`,
        );
      }
    }
  } else {
    log(`Specified target QSV version: v${targetQsvVersion}`);
  }

  if (options.checkOnly) {
    console.log("\n--- Version Status ---");
    console.log(`Package SemVer:          v${currentPkgVersion}`);
    console.log(`Target QSV in repo:      v${currentQsvTarget}`);
    console.log(`Target QSV discovered:   v${targetQsvVersion}`);
    if (currentQsvTarget === targetQsvVersion) {
      logSuccess(
        "The repository is currently synchronized with target QSV release.",
      );
    } else {
      logWarn(
        `A newer QSV version is available (v${currentQsvTarget} -> v${targetQsvVersion})! Run 'pnpm run sync:qsv' to regenerate.`,
      );
    }
    process.exit(0);
  }

  const currentBinVersion = getHostQsvVersion(qsvBinPath);

  if (currentBinVersion !== targetQsvVersion && !options.local) {
    logWarn(
      `Host binary at '${qsvBinPath}' is v${currentBinVersion || "unknown"}, but target is v${targetQsvVersion}.`,
    );
    if (options.downloadBin) {
      const tempBinDir = path.join(ROOT_DIR, ".temp-qsv");
      qsvBinPath = await downloadAndExtractQsv(targetQsvVersion, tempBinDir);
    } else {
      logWarn(
        `Proceeding with '${qsvBinPath}'. To auto-download target binary, supply --download-bin.`,
      );
    }
  } else {
    logSuccess(
      `Host binary at '${qsvBinPath}' matches target QSV v${targetQsvVersion}`,
    );
  }

  // Determine new package version
  let newPkgVersion = currentPkgVersion;
  if (options.alignMinor) {
    newPkgVersion = getAlignedMinorVersion(
      currentPkgVersion,
      targetQsvVersion,
      options.tag === "staging",
    );
    log(
      `Aligning package minor version (0.<QSV_MAJOR>.<PATCH>): \x1b[32mv${newPkgVersion}\x1b[0m`,
    );
  } else if (options.alignVersion) {
    newPkgVersion = targetQsvVersion;
    log(
      `Aligning package version directly to QSV version: \x1b[32mv${newPkgVersion}\x1b[0m`,
    );
  } else if (options.pkgVersion) {
    newPkgVersion = options.pkgVersion;
    log(`Setting explicit package version: \x1b[32mv${newPkgVersion}\x1b[0m`);
  } else {
    const bumpType = options.bumpType || "minor";
    newPkgVersion = bumpSemver(currentPkgVersion, bumpType);
    log(
      `Bumping package version (${bumpType}): \x1b[32mv${currentPkgVersion} -> v${newPkgVersion}\x1b[0m`,
    );
  }

  // Step 1: Regenerate nodes
  log("\n--- Step 1: Regenerating Node Definitions ---");
  const generatorEnv = {
    ...process.env,
    DARTFX_QSV_BIN_PATH: qsvBinPath,
    QSV_BIN_PATH: qsvBinPath,
  };

  const tsxBin = path.join(ROOT_DIR, "node_modules", ".bin", "tsx");
  const runTsxCmd = fs.existsSync(tsxBin) ? tsxBin : "tsx";

  execSync(`${runTsxCmd} scripts/generate-qsv-nodes.ts`, {
    cwd: ROOT_DIR,
    env: generatorEnv,
    stdio: "inherit",
  });
  logSuccess("Node definitions regenerated successfully.");

  // Step 2: Update package.json
  log("\n--- Step 2: Updating package.json Manifest ---");
  pkg.version = newPkgVersion;
  pkg.qsvVersion = targetQsvVersion;
  fs.writeFileSync(
    PACKAGE_JSON_PATH,
    JSON.stringify(pkg, null, 2) + "\n",
    "utf8",
  );
  logSuccess(
    `Updated package.json (version: ${newPkgVersion}, qsvVersion: ${targetQsvVersion})`,
  );

  // Step 3: Update Workflows & Changelog
  if (options.updateWorkflows) {
    log("\n--- Step 3: Synchronizing CI & Publish Workflows ---");
    updateWorkflowFiles(targetQsvVersion);
  }

  if (options.updateChangelog) {
    log("\n--- Step 4: Updating Changelog ---");
    appendChangelog(newPkgVersion, targetQsvVersion);
  }

  // Step 5: Verification Gates (Lint & Test)
  if (!options.skipTests) {
    log("\n--- Step 5: Running Quality Assurance Gates (Lint & Test) ---");
    const eslintBin = path.join(ROOT_DIR, "node_modules", ".bin", "eslint");
    const jestBin = path.join(ROOT_DIR, "node_modules", ".bin", "jest");

    const lintCmd = fs.existsSync(eslintBin)
      ? `${eslintBin} "**/*.ts"`
      : "pnpm run lint";
    log(`Running linter: ${lintCmd}`);
    execSync(lintCmd, { cwd: ROOT_DIR, stdio: "inherit" });
    logSuccess("Linter checks passed.");

    const testCmd = fs.existsSync(jestBin)
      ? `${jestBin} --passWithNoTests`
      : "pnpm run test";
    log(`Running test suite: ${testCmd}`);
    execSync(testCmd, { cwd: ROOT_DIR, stdio: "inherit" });
    logSuccess("All tests passed.");
  }

  // Step 6: Build Package
  if (!options.skipBuild) {
    log("\n--- Step 6: Compiling TypeScript & Building Assets ---");
    const tscBin = path.join(ROOT_DIR, "node_modules", ".bin", "tsc");
    const buildCmd = fs.existsSync(tscBin)
      ? `${tscBin} && node gulpfile.js`
      : "pnpm run build";
    execSync(buildCmd, { cwd: ROOT_DIR, stdio: "inherit" });
    logSuccess("Package build completed (dist/ output generated).");
  }

  // Step 7: Publishing & Git Tagging
  log("\n--- Step 7: Release Orchestration ---");
  const publishTag = options.tag || "latest";

  if (options.dryRun) {
    log(
      "\x1b[33mRunning in --dry-run mode: Verifying packaging without publishing\x1b[0m",
    );
    execSync("pnpm pack --dry-run", { cwd: ROOT_DIR, stdio: "inherit" });
    execSync(`pnpm publish --dry-run --no-git-checks --tag ${publishTag}`, {
      cwd: ROOT_DIR,
      stdio: "inherit",
    });
    logSuccess(
      "Dry-run verification completed successfully. Package is ready for release!",
    );
    return;
  }

  if (options.gitTag && options.publish && options.tag !== "staging") {
    logError(
      "Conflict detected: Do not mix --publish with --git-tag for production releases!\n" +
        "Pushing the git tag triggers GitHub Actions to publish to npm with cryptographic provenance.\n" +
        "Publishing locally via CLI would cause GitHub Actions to fail with a duplicate version error.\n\n" +
        "-> To release to production (single unified path), run:\n" +
        "     pnpm run release:prod\n" +
        "   (or: pnpm run sync:qsv --git-tag --push)\n" +
        "-> To publish a staging pre-release, run:\n" +
        "     pnpm run release:staging --otp <code>",
    );
    process.exit(1);
  }

  if (options.gitTag) {
    log("Creating Git commit and annotated tag...");
    try {
      execSync(`git add -A`, { cwd: ROOT_DIR });
      execSync(
        `git commit -m "chore(release): v${newPkgVersion} (sync with QSV v${targetQsvVersion})"`,
        {
          cwd: ROOT_DIR,
          stdio: "inherit",
        },
      );
      execSync(
        `git tag -a "v${newPkgVersion}" -m "Release v${newPkgVersion} (QSV v${targetQsvVersion})"`,
        {
          cwd: ROOT_DIR,
          stdio: "inherit",
        },
      );
      logSuccess(`Created git commit and tag v${newPkgVersion}`);

      if (options.push) {
        log("Pushing commit and tags to GitHub (origin main --follow-tags)...");
        execSync("git push origin main --follow-tags", {
          cwd: ROOT_DIR,
          stdio: "inherit",
        });
        logSuccess(
          "Pushed to GitHub! GitHub Actions will now build, test, and publish to npm with OIDC provenance.",
        );
      } else {
        log(
          "To push changes to GitHub and trigger CI/CD:\n  git push origin main --follow-tags",
        );
      }
    } catch (e: any) {
      logWarn(`Git tagging encountered an issue: ${e.message}`);
    }
  }

  if (options.publish) {
    log(`Publishing package to npm (channel: ${publishTag})...`);
    const publishArgs = [
      "publish",
      "--tag",
      publishTag,
      "--access",
      "public",
      "--no-git-checks",
    ];
    if (options.otp) {
      publishArgs.push(`--otp=${options.otp}`);
    }
    const res = spawnSync("pnpm", publishArgs, {
      cwd: ROOT_DIR,
      stdio: "inherit",
    });
    if (res.status !== 0) {
      throw new Error(`pnpm publish exited with code ${res.status}`);
    }
    logSuccess(
      `Successfully published @dartfx/n8n-nodes-qsv@${newPkgVersion} under tag '${publishTag}'!`,
    );
  } else if (options.push) {
    console.log(`
\x1b[32m✔ Release v${newPkgVersion} dispatched successfully!\x1b[0m

GitHub Actions has been triggered by tag v${newPkgVersion}:
  Track progress at: https://github.com/DataArtifex/dartfx-n8n-nodes-qsv/actions
`);
  } else {
    log("\n\x1b[32m✔ Release preparation complete!\x1b[0m");
    console.log(`
Next steps:
  1. Review changes:        git status && git diff
  2. To publish to staging: pnpm run release:staging --otp <code>
  3. To release to GitHub:  git push origin main --follow-tags
`);
  }
}

main().catch((err) => {
  logError(`Sync failed: ${err.message}`);
  process.exit(1);
});
