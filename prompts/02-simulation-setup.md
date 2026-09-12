# Follow-up prompt 2 — Simulation setup

先貼 master prompt，再貼呢段。用來起 methods 同之後嘅 EnergyPlus/Python 實作。

=== BEGIN PROMPT ===

Turn the frozen thesis brief into a **simulation methods specification** that I can paste into Chapter 4. Primary stack remains **EnergyPlus + CONTAM + Python plugin**, plus a **well-mixed Python twin** for the Pi.

## You must specify (numbers + filenames, not slogans)

1. **Space:** pick one default: university classroom *or* small office. Give floor area, volume, design occupancy, ASHRAE 62.1 \(Q_\mathrm{person}\) and \(Q_\mathrm{area}\) (lock a standard year). Justify why occupancy diversity is large enough for `S0` vs `S1` to matter.
2. **Weather / outdoor files:** Hong Kong EPW source; outdoor CO2 value; outdoor O2; **hourly PM2.5** from a named EPD-style station (placeholder name + how I replace it with a CSV).
3. **Occupancy:** how to build \(N(t)\) — timetable + stochastic occupancy; timestep; the **same file** reused for `S0`–`S3`.
4. **Physics split**
   - EnergyPlus: what it computes (list output variables I should log).
   - CONTAM: CO2, PM2.5, O2 generation/consumption, deposition, filters, infiltration.
   - Python: `control.py` I/O (inputs, outputs, units).
5. **Well-mixed twin equations** for CO2, PM2.5, O2, and fan power (affinity law). State calibration experiments (decay, occupied rise) and the error metric (CV(RMSE)).
6. **Scenario matrix** `S0_always_on`, `S1_occupancy_vrp`, `S2_co2_dcv`, `S3_multi_iaq`: for each, what is actuated, what is ignored, \(Q_\min\), \(Q_\max\).
7. **Run protocol:** warmup, annual vs typical-week plots, sensitivity (CO2 sensor ±50 ppm, PM bias, occupancy ±1 person, infiltration ×0.5/×2).
8. **If no CONTAM:** exact fallback (EnergyPlus ZoneAirContaminantBalance + generic contaminant) and which **claims I must weaken** in the paper.
9. **Repo layout** for later code: `control.py`, `occupancy.csv`, `weather.epw`, `idf/`, `contam/`, `analysis/`.

## Rules

- Do not replace EnergyPlus OA-coil energy with “fan kWh × hours”.
- Do not recommend CFD as the yearly engine.
- Include a **supervisor one-pager** paragraph describing the co-simulation in past-tense methods style.
- After the spec, list **first three implementation tasks** in order (still no full IDF dump unless I ask).

=== END PROMPT ===
