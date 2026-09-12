# Thesis research plan

Occupancy- and IAQ-based ventilation control on Raspberry Pi 5, with software simulation of electricity vs always-on operation.

Use this with the supervisor. The paste-ready AI brief is [`../prompts/00-master-prompt.md`](../prompts/00-master-prompt.md). Simulation justification is [`simulation-stack.md`](simulation-stack.md).

## 1. Title (working)

**English:** Occupancy- and Multi-Pollutant-Based Ventilation Control on a Raspberry Pi 5: Experimental Prototype and Simulation of Electricity Use versus Always-On Operation  

**中文（工作標題）：** 以樹莓派 5 結合氧氣、二氧化碳與懸浮粒子感測之室內通風控制：長開與按人流調風量之用電模擬比較

## 2. Problem

Mechanical ventilation is often left at a **fixed high rate** (“長開”). That wastes fan electricity and, in Hong Kong, a larger share of energy used to **cool and dehumidify outdoor air**. Demand-controlled ventilation (DCV) reduces outdoor air when occupancy is low, but:

- CO2-only DCV ignores **PM2.5** (indoor sources and dirty outdoor air).
- Indoor **O2** is scientifically linked to occupancy (people consume O2) but the signal is small and cheap sensors are noisy — it is a novelty *and* a risk, not a drop-in occupancy meter.
- Hardware on a **Raspberry Pi 5** can close the loop in a real room; **annual electricity** still needs **software simulation** (you cannot wait a year in a lab for every scenario).

## 3. Aim and research questions

**Aim:** Design a Pi-based controller that modulates ventilation from occupancy and IAQ sensors, then quantify electricity and IAQ versus always-on ventilation using a citeable building simulation workflow.

| ID | Question |
| --- | --- |
| RQ1 | How much HVAC electricity (fan + outdoor-air conditioning) does occupancy-modulated ventilation save versus always-on design OA in a Hong Kong indoor space, at equal or better IAQ compliance? |
| RQ2 | Does a multi-signal law (occupancy and/or CO2 + PM2.5 + O2 safety) change energy or IAQ relative to occupancy-only or CO2-only DCV? |
| RQ3 | Can a well-mixed / EnergyPlus–CONTAM model, running the **same** control code as the Pi, reproduce prototype behaviour closely enough for the annual comparison to be trusted? |

**Working hypotheses**

- H1: Occupancy-based OA cuts annual HVAC kWh vs always-on, mainly by cutting vacant-hour outdoor-air cooling.
- H2: Adding PM2.5 to the law reduces high indoor PM hours, with a small energy penalty or a gain if it avoids dumping dirty outdoor air.
- H3: O2 is a weak occupancy estimator at room scale with low-cost sensors; it is useful as a **fail-safe**, not as the primary “人流” signal.

## 4. Contribution (what is new enough for a paper)

DCV itself is not new (ASHRAE 62.1, many EnergyPlus papers). A defensible contribution is the **combination**:

1. **Same controller** on Pi hardware and in EnergyPlus/CONTAM (digital twin), so the energy gap is not an abstract DCV object.
2. **Hong Kong** climate: cooling- and humidity-dominated outdoor-air load, plus outdoor PM.
3. Honest evaluation of **O2** (limit of detection vs occupancy), not a gadget list.
4. Explicit comparison table: always-on vs occupancy VRP vs CO2 DCV vs multi-IAQ.

If the examiner says “DCV is already known”, the answer is: the paper measures **this** low-cost multi-sensor controller’s energy–IAQ trade-off under **local weather and occupancy**, with a reproducible sim.

## 5. Scope and non-goals

**In scope**

- One representative indoor space first (classroom, small office, or lab). Multi-zone only if time allows.
- Mechanical supply/exhaust or a single ERV / inline fan with measurable flow or a calibrated PWM–flow curve.
- Electricity of **ventilation-related HVAC** (fan + OA coils). Lighting/plug loads only if they are measured as confounders.

**Out of scope (unless supervisor insists)**

- Whole-building central plant optimisation.
- CFD as the annual engine.
- Thermal comfort as the primary KPI (report temperature/RH, but do not turn the thesis into a PMV study).
- Medical claims about O2 therapy or “fresh air health”.

## 6. Methods overview

Two layers, one control law.

### 6.1 Hardware prototype (validation, not the annual kWh)

**Controller:** Raspberry Pi 5 (Bookworm, Python).

**Sensing (minimum)**

| Quantity | Suggested class | Notes for the thesis |
| --- | --- | --- |
| CO2 | NDIR, e.g. SCD41 or equivalent | Primary IAQ / occupancy proxy. Calibrate / ABC vs outdoor. |
| PM2.5 (and PM10 if available) | Optical, e.g. Plantower PMS5003 / Sensirion SPS30 | Indoor + optional outdoor or a second node. |
| O2 | Electrochemical or optical (LuminOx-class if budget) | Report resolution vs expected ΔO2. See §8. |
| Occupancy / 人流 | mmWave people count **or** PIR + door, **or** CO2 inverse model | Need an independent \(N(t)\) if you claim occupancy control. |
| T, RH | On CO2 board or BME280 | For enthalpy discussion and sensor compensation. |
| Electricity | Plug meter / INA219 / clamp on fan + (if possible) the AHU circuit | Separate **fan** from **room AC** in the write-up. |

**Actuation:** EC fan PWM, 0–10 V damper, or a small ERV. Log commanded \(Q\) and, if possible, measure flow (pitot, flow hood, or manufacturer curve).

**Ethics / privacy:** if using cameras for headcount, get ethics approval; mmWave or CO2-inferred occupancy is easier.

**Field protocol (short)**

1. Empty-room tracer-style decay (CO2 or PM) → estimate ACH / \(Q_{\mathrm{inf}}\).
2. Occupied sessions with known headcount (ground truth).
3. A/B days or interleaved hours: `S0_always_on` vs `S3_multi_iaq` (and `S2` if time).
4. Sync all clocks; 10–30 s logging; keep raw CSV.

This dataset **validates** `control.py` and the well-mixed twin. It does **not** replace the annual sim.

### 6.2 Software simulation (paper’s energy comparison)

See [`simulation-stack.md`](simulation-stack.md). Numeric defaults for the methods chapter (64 m² classroom, ASHRAE 62.1-2022 rates, equations, setpoints) are in [`methods-box.md`](methods-box.md).

- **EnergyPlus:** geometry, weather (Hong Kong EPW), fan and coil electricity.
- **CONTAM:** CO2, PM2.5, optional O2, filters, infiltration.
- **Python plugin:** identical `control.py` as the Pi.
- **Twin:** well-mixed ODE calibrated to the prototype (CV(RMSE) reported).

**Space model (methods must state)**

- Volume \(V\), floor area, envelope tightness (ACH50 or assumed infiltration).
- Design OA from ASHRAE 62.1 (people + area) for the space type.
- Occupancy traces: timetable + stochastic variation; same file for all scenarios.
- Outdoor CO2 ~ 420 ppm (state value); outdoor PM from EPD; outdoor O2 20.95%.
- Generation: CO2 ~ activity-specific L/s·person; O2 consumption consistent with RQ (respiratory quotient); PM indoor source optional (one cooking/lecture-chalk scenario).

### 6.3 Control law (specify numerically in the thesis)

Write this as pseudocode in Chapter 3; implement once in `control.py`.

```
every timestep:
  N_hat = people_count or invert_CO2(C_CO2)
  Q_occ = Q_area + N_hat * Q_person          # ASHRAE-style floor
  Q_co2 = proportional or PI to keep C_CO2 <= 1000 ppm
  Q_pm  = increase OA if indoor PM high AND outdoor PM is cleaner
          else recirculate / keep min OA if outdoor PM is worse
  Q_o2  = increase OA if O2 < 19.5% (safety; expect rare)
  Q = max(Q_min, min(Q_max, max(Q_occ, Q_co2, Q_pm, Q_o2)))
  apply hysteresis / rate limit to avoid fan chatter
```

`S0_always_on` sets \(Q = Q_{\mathrm{design}}\) (occupied-hours or 24 h — **pick one and justify**).  
`S1` uses true \(N(t)\) only.  
`S2` uses CO2 only (plus \(Q_{\min}\)).  
`S3` is the Pi law.

## 7. Metrics and success criteria

| Family | Metric | Success / reporting rule |
| --- | --- | --- |
| Energy | Fan kWh, OA coil kWh, total HVAC kWh, kWh/m²·y, kWh/person-h | Report % vs `S0` with the same occupancy and weather |
| IAQ | Hours CO2 > 1000 ppm; PM2.5 vs WHO 2021; O2 min | `S3` must not be worse on IAQ *and* save energy without a stated trade-off |
| Twin | CV(RMSE) of CO2 (and fan power) vs Pi | State the value; do not claim “validated” without it |
| Robustness | Sensor bias ±(spec) on CO2/PM/O2 | Sensitivity appendix |

## 8. O2: how to write it so the examiner does not sink the thesis

Indoor O2 at sea level is about **20.95%**. Occupants consume O2 on the same order as they produce CO2 (molar), but **background is ~209,500 ppm vs CO2’s 400–2000 ppm**. A 500 ppm metabolic swing is huge on the CO2 scale and **tiny** on the O2 scale (~0.05 percentage points). Many electrochemical cells have uncertainty larger than that.

**Therefore the thesis should:**

- Use O2 as a **safety / exploratory** channel.
- Quantify SNR: measured ΔO2 vs sensor noise and drift in an empty vs occupied room.
- If SNR is poor, that is a **result** (negative result is publishable), and `S3` can drop O2 from the energy comparison while keeping it in the hardware chapter.
- Do not advertise “O2 sensor detects 人流” in the title unless the data support it.

## 9. Hong Kong specifics

- **Energy:** outdoor air is hot and wet; savings are mostly **coil energy**, not the Pi’s 5 V rail. Always split fan vs coil in tables.
- **PM:** roadside vs suburban EPD stations can change `S3` behaviour. Name the station.
- **Standards:** ASHRAE 62.1 for OA calculation; WHO 2021 PM2.5; mention HK IAQ Certification Scheme / BEAM Plus only if the programme expects local codes.
- **Space:** a university classroom (high occupancy diversity) makes occupancy-based savings larger than an always-busy open office — choose and justify.

## 10. Paper / thesis skeleton

1. **Introduction** — energy of over-ventilation; IAQ (CO2, PM); gap: low-cost multi-sensor controller + local climate sim.
2. **Literature** — DCV; CO2 vs occupancy sensors; PM-aware ventilation; EnergyPlus–CONTAM; Pi IAQ systems; O2 indoor studies (sparse — say so).
3. **System design** — hardware, `control.py`, safety.
4. **Simulation methods** — EnergyPlus, CONTAM, occupancy, weather, scenarios `S0`–`S3`, metrics.
5. **Prototype experiments** — setup, calibration, twin fit.
6. **Results** — annual energy table; typical week IAQ; O2 SNR; sensitivity.
7. **Discussion** — coil vs fan; PM outdoor lockout; limits of O2; ethics.
8. **Conclusion** — % kWh vs `S0`; recommendations for classrooms.

Target venues (if publishing): *Building and Environment*, *Energy and Buildings*, *Indoor Air*, or a regional HVAC/IAQ conference. Match length to degree (FYP vs MPhil).

## 11. Work packages (execution order)

1. Freeze `control.py` interfaces and scenario IDs (`S0`–`S3`).
2. Literature map (DCV, EnergyPlus–CONTAM, Pi IAQ, O2 limits).
3. Pi bench: sensors talking, CSV log, PWM fan, power meter.
4. One-room experiment + twin calibration.
5. EnergyPlus single zone + Python plugin; `S0` vs `S1` first.
6. Add PM (CONTAM or generic contaminant) and `S2`/`S3`.
7. Annual run + sensitivity; write methods in parallel with plots.
8. Supervisor draft: energy table + IAQ hours + limitations.

## 12. Risks

| Risk | Mitigation |
| --- | --- |
| O2 sensor cannot see occupancy | Pre-study SNR; demote O2 to safety; keep CO2 + occupancy + PM |
| No CONTAM/Windows | EnergyPlus + Python annual; CONTAM as optional; state limitation |
| Cannot meter the real AHU | Measure fan only in lab; **simulate** coil energy; never present fan-only as “HVAC energy” |
| Privacy (cameras) | mmWave / PIR / manual headcount |
| Confounding AC thermostat | Same setpoint all scenarios; log zone T |

## 13. What “done” means for the methods chapter

The methods chapter is complete only if a reader can reproduce:

- Room volume, OA design rates, occupancy file, EPW, outdoor PM file
- Full control law with numbers (setpoints, \(Q_{\min}\), hysteresis)
- Scenario definitions `S0`–`S3`
- EnergyPlus version, CONTAM version, Python version
- Electricity breakdown (fan vs OA coils)
- Twin calibration error

If any of those are missing, the energy “gap” is not a thesis result yet.
