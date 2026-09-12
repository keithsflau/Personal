# Follow-up prompt 1 — Literature review

先貼 [`00-master-prompt.md`](00-master-prompt.md)，再貼呢段。

=== BEGIN PROMPT ===

Using the frozen thesis brief (Raspberry Pi 5; O2 + CO2 + PM; always-on vs occupancy-based ventilation electricity; EnergyPlus + CONTAM + Python; Hong Kong), produce a **literature map for Chapter 2**, not a generic IAQ essay.

## Output format

1. **Table of clusters** (rows): topic; 5–12 canonical / recent papers or standards; what each cluster settles; what is still open for *this* thesis.
2. **Gap statement** (≤200 words) that a supervisor can paste into a proposal: what is known about DCV energy savings; what is weak about PM-aware OA in cooling climates; why indoor O2-as-occupancy is poorly supported; why a Pi prototype + co-simulation is a legitimate methods contribution rather than a product demo.
3. **Standards checklist** I must cite in methods: ASHRAE 62.1 (state which year I should lock); WHO 2021 PM2.5; any HK IAQ / BEAM Plus items that are actually used in theses (do not invent local law).
4. **EnergyPlus–CONTAM–Python** citation spine: the coupling papers I should read first (Dols; Justo Alonso 2021; any CO2+PM2.5 predictive control co-sim papers).
5. **What not to over-cite:** consumer blogs, Home Assistant tutorials, CFD-only papers unless I later add a spatial-sensor chapter.

## Quality rules

- Prefer peer-reviewed building science / HVAC / IAQ venues (*Energy and Buildings*, *Building and Environment*, *Indoor Air*, NIST reports).
- For each cluster, mark **energy evidence** vs **IAQ-only** vs **hardware-only**.
- Explicit subsection: **indoor oxygen**. If literature is thin, say so and list physiological generation rates I can use in CONTAM, plus sensor-error papers if they exist.
- End with a **reading order for 2 weeks** (must-read first).

Do not write the full Chapter 2 prose yet unless I ask. Deliver the map, gap, and bibliography skeleton in a citeable form (authors, year, venue).

=== END PROMPT ===
