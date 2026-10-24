# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.26.0] - 2026-10-24

### Changed

- **Synchronized with datHere QSV v26.0.0**:
  - Regenerated all non-interactive QSV operations with updated CLI parameter definitions and tool schemas.
  - Updated operational descriptions, category hints, and command options.

## [0.2.1] - 2026-10-09

### Added

- **QSV v24 JSON Tool Definitions Ingestion**: Generator (`scripts/generate-qsv-nodes.ts`) directly ingests machine-readable tool definitions and help documentation via `qsv --export-tool-definitions` (with fallback to `qsv <cmd> --help --format json`).
- **Dynamic Positional Argument Mapping**: Automatically extracts positional parameters, types, and sequence from `command.args`, eliminating manual configuration dictionaries.
- **Subcommand Enum Dropdowns**: Native n8n `options` dropdown selection for subcommands and fixed format modes (e.g., `to` formats, `cat` modes, `luau` subcommands, `viz` plot types).
- **Category & Resource Hints Integration**: Integrated 11 standard QSV categories and memory/indexing hints (`hints.memory`, `hints.indexed`) into UI descriptions and tooltips.
- **73 Generated Command Nodes**: Expanded generated operations across all supported non-interactive QSV commands.
- **Release-Agnostic Documentation**: Standardized package notices, README badges (Shields.io), and release guides.
- **Tokenless OIDC Publishing & Provenance**: GitHub Actions workflow (`publish.yml`) configured for npm Trusted Publishers with cryptographic provenance attestation.

## [0.1.0] - 2026-09-02

### Added

- **Initial Release** of `@dartfx/n8n-nodes-qsv` community node package for high-performance tabular data wrangling.
- **71+ High-Performance QSV Operations**: Streamlined suite of tabular data profiling, transformation, slicing, joining, SQL querying, format conversion, synthetic test data generation, and validation tools powered by [datHere QSV](https://github.com/dathere/qsv).
- **First-Class Positional Argument Engine**: Fully typed UI parameters for command-specific arguments (e.g. `selection` in `select`, `regex` in `search`, `sampleSize` in `sample`, `sql` in `sqlp`, `column`/`row`/`value` in `edit`), with precise docopt positional argv ordering.
- **Zero-Copy File-Path Architecture**: Pass filesystem paths (`inputPath`, `outputPath`) directly to native Rust engines for multi-gigabyte dataset processing without memory overhead.
- **Zero-Copy Downstream Node Chaining**: Action handlers emit `outputPath` in the returned JSON result, enabling downstream n8n nodes to reference `{{ $json.outputPath }}` directly.
- **CLI Warnings in Output Payload**: Captured non-fatal stderr from CLI executions and exposed under `warnings` in the JSON result.
- **Quote-Aware Arguments**: Added quote-aware tokenizer for `additionalArgs` allowing flags containing spaces and quotes (e.g., `--select "col A, col B"`).
- **Dynamic CLI Synchronizer**: `scripts/generate-qsv-nodes.ts` (`pnpm run generate:qsv`) to auto-generate and synchronize typed node definitions, UI property descriptions, and action handlers directly from `qsv --list` and CLI help.
- **Feature-Gated Command Diagnostics & Tagging**: Operation dropdown options clearly indicate required Cargo feature gates (e.g., `[Feature: polars]`, `[Feature: synthesize]`, `[Feature: luau]`).
- **Flexible Binary Resolution**: Support for `DARTFX_QSV_BIN_PATH`, `QSV_BIN_PATH`, and `QSV_PATH` environment variables for custom binary locations on Docker and self-hosted environments.
- **Granular Diagnostics & Error Handling**: Actionable `NodeOperationError` guidance for missing host binaries (`ENOENT`), platform permissions / macOS full disk access, missing input files, missing QSV feature-build subcommands (`Could not match '<cmd>' with any of the allowed variants`), and `maxBuffer` limit overflows (50 MB) recommending direct file output via `outputPath`.
- **Automated Quality Assurance**: Comprehensive Jest test suite testing node structure, operation metadata, boolean flags, `outputPath` propagation, quote-aware CLI arguments, positional parameters, and error handling against test fixtures.
- **Sphinx Documentation**: Complete MyST documentation suite covering installation, multi-stage Docker deployment, platform & feature availability matrix, local testing workflows, architecture, and node operation guides.
- **CI & Build Tooling**: GitHub Actions CI workflow for linting, type-checking, building, and automated Jest test execution with QSV binary caching, pinned pnpm `11.15.1`, and Node.js 22 LTS engine support.

### Fixed & Hardened

- **Cargo Feature Build Error Interception**: Fixed detection branch to intercept `Could not match '<cmd>' with any of the allowed variants`, preventing confusing docopt text dumps and guiding users to the required Cargo feature / build.
- **Positional Output Handling for `extsort` & `extdedup`**: Fixed `extsort` and `extdedup` by passing `outputPath` as a positional argument rather than an unsupported `--output` flag.
- **Terminal & Interactive Operation Exclusion**: Excluded terminal-only / interactive utilities (`color`, `lens`, `prompt`, `clipboard`, `log`, `clean`) to prevent headless hanging or automated data truncation.
- **Full Description & Option Help Extraction**: Removed arbitrary character slice limits on command descriptions, and captured indented continuation lines for CLI options.
- **Boolean Flag Execution**: Fixed regex tokenization in CLI help generator so sentence-cased descriptions no longer convert boolean flags to string options; boolean options correctly emit standalone flags (e.g., `--no-headers`) instead of invalid string values (`--no-headers true`).
- **Options Collection Rendering**: Removed redundant child `displayOptions` in generated descriptions that prevented options from rendering in the n8n canvas UI.
- **Duplicate `--output` Prevention**: Excluded `output` from the dynamic options collection to avoid duplicate `--output` arguments alongside top-level `outputPath`.
- **Subprocess Execution**: Standardized all node actions on native Node.js `child_process.execFile` (promisified) with zero external runtime dependencies.
- **Multi-Stage Docker Installation**: Updated documentation with a working multi-stage Dockerfile and versioned asset URLs for reliable deployment.
