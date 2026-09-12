# Security Policy

ALCOVE is a static documentation site published at
[alcove.grc.engineering](https://alcove.grc.engineering). It ships HTML, CSS,
one JavaScript file and self-hosted fonts. It has no backend, no database, no
user accounts and collects no data, so the realistic vulnerability surface is
the site's own client-side code, its build/publish pipeline, and this
repository's supply chain.

## Reporting a vulnerability

Report privately through
**[GitHub Security Advisories](https://github.com/grcengineering/alcove/security/advisories/new)**
on this repository. Please do not open a public issue for an undisclosed
vulnerability.

Include, where you can: what you found, the URL or file, the steps to
reproduce it, and what an attacker gets out of it.

**Response targets** — acknowledgement within 3 business days, an initial
assessment within 10 business days, and a fix or a documented decision not to
fix before public disclosure. We will credit you in the advisory unless you
ask us not to.

## Scope

In scope:

- Stored or reflected XSS, DOM clobbering, or prototype pollution in
  `assets/js/site.js` or `index.html`.
- Subresource / supply-chain issues: a compromised dependency, action, or
  font asset reaching the published site.
- Repository and pipeline weaknesses — workflow injection, token exposure,
  branch-protection or signing gaps.
- Anything that lets a third party alter what visitors see at
  alcove.grc.engineering.

Out of scope:

- Findings against GitHub Pages infrastructure itself — report those to GitHub.
- Missing hardening headers that GitHub Pages does not let this repository set.
- Automated scanner output with no demonstrated impact.
- Disagreement with the ALCOVE framework's content. That is a
  [discussion](https://github.com/grcengineering/alcove/issues), not a
  vulnerability.

## How this repository is secured

Supply-chain controls are bootstrapped and enforced by
[sscs-bootstrapper](https://github.com/p4gs/sscs-bootstrapper); the enabled set
is declared in `.sscsb/config.toml` and verifiable with `sscsb verify`.

- **Secret scanning** — TruffleHog at pre-commit, pre-push and in CI. It is the
  single credential-detection engine here on purpose: it verifies candidates
  against the issuing provider, so a finding is a live secret rather than a
  high-entropy string.
- **SAST** — OpenGrep against a committed ruleset, plus CodeQL on both
  `actions` and `javascript-typescript`.
- **Dependencies** — Syft SBOM, Trivy and OSV-Scanner, Renovate with digest
  pinning, and a package-trust gate covering typosquat and slopsquat risk.
- **Integrity** — commits on `main` are signed by an approved human signer
  listed in `.sscsb/policy/signers.toml`; GitHub Actions are pinned to full
  commit SHAs and run under Harden-Runner egress monitoring.
- **Posture** — OpenSSF Scorecard runs on every push to the default branch.

Machine-readable posture: [`security-insights.yml`](security-insights.yml).
