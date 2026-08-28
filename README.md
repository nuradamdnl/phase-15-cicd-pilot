# Phase 15 CI/CD Pilot

A synthetic TypeScript repository for verifying secure, reproducible GitHub Actions practices without production data, credentials, external services, or a deployment target.

## Local requirements

- Node.js 24.20.0, pinned by `mise.toml`
- npm 11.19.0, declared by `package.json`
- Project dependencies reproduced from `package-lock.json`

No workstation-global quality tools are required.

## Local verification

**Run on: MacBook**

```zsh
npm ci --ignore-scripts
npm run check
```

The canonical `npm run check` workflow performs:

1. Strict TypeScript checking without emitting files.
2. ESLint analysis.
3. Prettier validation.
4. TypeScript compilation.
5. The complete native Node.js test suite.

Every required gate returns a non-zero status when it fails.

## Continuous integration

The `CI` workflow runs for:

- Pull requests targeting `main`
- Pushes to `main`
- Manual troubleshooting runs

Its `Quality` job uses Ubuntu 24.04 and Node.js 24.20.0. It restores the npm download cache from the lockfile, installs dependencies with `npm ci --ignore-scripts`, and invokes the same `npm run check` command used locally.

Official GitHub actions are pinned to full commit SHAs. Workflow token permissions are limited to read-only repository contents, checkout credentials are not persisted, superseded branch runs are cancelled, and the job has a ten-minute timeout.

## Build artifact

A successful job uploads the compiled `dist` directory as a build artifact with seven-day retention. The artifact includes `SHA256SUMS.txt`, containing SHA-256 checksums relative to the artifact root.

After downloading and extracting an artifact, verify it locally:

**Run on: MacBook**

```zsh
cd <downloaded-artifact-directory>
shasum -a 256 -c SHA256SUMS.txt
```

All listed files must report `OK`. GitHub also records a SHA-256 digest for the uploaded artifact archive.

## Security boundary

This repository contains synthetic source only. The workflow uses no repository secrets, deployment credentials, production data, external services, privileged events, or write-capable token permissions.

Dependency lifecycle scripts are disabled because the reviewed toolchain does not require them. Any future dependency that requires a lifecycle script must be reviewed explicitly before this policy changes.

## Delivery and rollback

The verified build artifact is this pilot’s delivery boundary. No deployment is configured because there is no real deployment target.

Workflow and branch-policy changes proceed through normal pull-request review. Rollback consists of reverting the relevant workflow or configuration commit through a pull request. If a provider-side failure prevents all required checks from running, temporarily disabling the affected required check must be narrowly scoped, documented, and restored after the corrective workflow is verified.
