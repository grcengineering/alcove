# ALCOVE

**Assurance Levels for Control Operating Viability & Effectiveness**

The home page for ALCOVE, a proposed assurance framework for security compliance — live at
**[alcove.grc.engineering](https://alcove.grc.engineering)**.

ALCOVE is a **proposal**, not an adopted standard. There is no registry, no accreditation body, and
nothing to buy. It was introduced in
[*SOC 2 is dead, long live SOC 2*](https://blog.grc.engineering/p/soc-2-is-dead-long-live-soc-2) on the
GRC Engineering blog, and this site renders that proposal as a real page for the first time.

## The idea in one paragraph

Every security compliance framework is built from three parts — requirements, an audit methodology, and a
reporting artifact — and each is failing in a way that caps how much assurance the whole thing can provide.
Requirements are written without reference to the threats they guard against. Audits test stateful technical
controls only for their current state, never historically. And the result is a static PDF describing a system
that changes hundreds of times a day. ALCOVE proposes four cumulative levels of assurance that close those
gaps, and a way to express them through extended SOC 2 report types.

## The levels

| Level | Requirements | Intended for |
|---|---|---|
| **1** | Control designs assessed for viability | Demonstrating commitment to pursuing independent third-party assessment of control operating effectiveness |
| **2** | Level 1 + samples of control evidence assessed for *historical transactions* or *current state* | Providing basic, short-lived assurance about control operating effectiveness |
| **3** | Level 2 + full populations of control evidence assessed for historical transactions **and** state | Providing strong, long-lived assurance about control operating effectiveness |
| **4** | Level 3 + control implementations based on Common Threat Mitigations (CTM) to guard against Common Threat Criteria (CTC) | Providing strong, long-lived, threat-informed assurance about control operating effectiveness |

## Contributing

The framework has more open questions than answers, and that is the point. The largest gaps:

- **The CTC and CTM catalogue.** One worked example exists (SOC 2 CC6.6). A usable Level 4 needs a real corpus.
- **A testable definition of population completeness** for Level 3.
- **Naming.** The mitigation half of the threat model appears in the source as both *Common Threat Mitigations
  (CTM)* and *Common Mitigation Criteria (CMC)*. One name should win.

Open an issue, or bring it to the [GRC Engineering Discord](https://discord.gg/CG6EDDbG4B).

## Building

There is no build step. This is a static site: `index.html` plus `assets/`. Serve the directory and open it.

```bash
python3 -m http.server 8752
```

The design comes from the [GRC Engineering Design System](https://github.com/grcengineering/grce-design-system);
its token layer is vendored verbatim into `assets/css/tokens.css` and its brand fonts are self-hosted under
`assets/fonts/`. Re-sync from the design system rather than hand-editing tokens.

## Related

- [GRC Engineering Manifesto](https://grc.engineering) — ALCOVE is one attempt at core value #5, *in-depth continuous assurance over shallow periodic monitoring*
- [Corsair](https://grcorsair.com) — an open protocol for cryptographically verifiable compliance attestations, whose evidence-chain and history primitives can carry Level 3 evidence
- [Threat-Informed Control Modeling](https://github.com/grcengineering/threat-informed-control-modeling) — a method for the control-to-threat reasoning Level 4 implies
