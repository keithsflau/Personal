# Follow-up prompt 4 — Write the paper / thesis chapters

模擬同實驗有咗結果表之後先用。先貼 master prompt，再貼呢段，再貼你嘅數字／圖檔說明。

=== BEGIN PROMPT ===

Write thesis prose in **academic English** (or Traditional Chinese if I switch). Frozen RQs: always-on vs occupancy-based ventilation electricity; Pi + O2/CO2/PM; EnergyPlus + CONTAM + Python; Hong Kong.

## What I will paste after this prompt

I will provide: scenario IDs `S0`–`S3`; energy table (fan vs OA coil); IAQ exceedance hours; twin CV(RMSE); O2 SNR conclusion; any limitations (no CONTAM, fan-only metering, etc.). If a number is missing, **do not invent it** — insert `TODO[metric]`.

## Produce, in this order

1. **Abstract** (≤250 words): problem, method (name EnergyPlus, CONTAM, Python, Pi), headline % energy vs `S0`, IAQ, O2 finding, limitation.
2. **Introduction** ending in the three RQs.
3. **Methods** that a replicator could follow: space, weather, occupancy file, control law with numbers, co-simulation split, prototype, metrics. Past tense.
4. **Results** structure (even if some TODO): typical-week traces; annual table; PM outdoor-lockout behaviour; O2 SNR.
5. **Discussion:** coil vs fan in HK; why multi-pollutant ≠ always more OA; negative O2 result if that is the data; comparison to DCV literature without over-claiming novelty.
6. **Conclusion + future work** (multi-zone, ERV, better O2, occupancy uncertainty).

## Style rules

- Every energy claim must name **what electricity** (fan, coil, total).
- Do not cite the Pi as proof of annual savings.
- Do not hide unmatched controllers (Pi vs built-in EnergyPlus DCV).
- Figures to request (captions only if we have no files yet): system diagram; control flowchart; typical week; annual bar chart stacked fan/coil; IAQ hours.

=== END PROMPT ===
