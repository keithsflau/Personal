# Simulation stack: what to use, and why

This file answers the thesis question **「用乜 software sim？」** with a stack that is citeable, reproducible, and aligned with Raspberry Pi control logic.

## Recommendation

| Layer | Tool | Role in the paper |
| --- | --- | --- |
| Building energy + HVAC | **EnergyPlus** (OpenStudio or DesignBuilder as GUI if the department has it) | Fan electricity, outdoor-air cooling/heating, annual kWh. Native DCV (ASHRAE 62.1 VRP / IAQP). |
| Airflow + contaminants | **CONTAM** (NIST) | CO2, PM2.5, optional O2 as a contaminant; infiltration, filters, multi-zone flow. |
| Occupancy + Pi control replica | **Python 3** (EnergyPlus Python Plugin / EMS actuators) | Same control law as the Raspberry Pi 5 firmware. Stochastic or measured occupancy. |
| Hardware digital twin | **Python well-mixed ODE** (`scipy`) | Fast calibration against Pi + sensor logs. Not the annual energy engine. |
| Analysis / figures | Python (`pandas`, `matplotlib`) or R | kWh, IAQ exceedance hours, occupancy-weighted exposure. |

**One sentence for the methods chapter:**  
The annual comparison is a co-simulation of EnergyPlus (thermal/HVAC energy) and CONTAM (contaminant transport), with the Raspberry Pi control algorithm re-implemented as a Python plugin so hardware and simulation share one controller.

This coupling is already used in peer-reviewed DCV papers, e.g. EnergyPlus–CONTAM co-simulation for CO2/PM2.5 demand-controlled ventilation (Justo Alonso et al., *Building and Environment*, 2021; Dols et al., *Building Simulation*, 2016). A recent CO2+PM2.5 predictive-control study uses **EnergyPlus + CONTAM + Python** explicitly (Indoor Air, 2025).

## Why this stack (not a single program)

No one tool does all four jobs well:

1. **Electricity of ventilation in Hong Kong** is not only fan watts. Conditioning outdoor air (cooling + dehumidification) often dominates. EnergyPlus is the academic default for that.
2. **PM2.5** needs deposition, outdoor time series, and filters. EnergyPlus contaminant objects are weaker here than CONTAM.
3. **O2** is not a built-in EnergyPlus zone gas. CONTAM can treat it as a contaminant with a generation/consumption rate; the Python twin can do the same mass balance.
4. **The Pi controller** is custom (O2 + CO2 + PM + occupancy). EnergyPlus’s built-in DCV is occupancy/CO2 only. You must inject the same logic via Python, or the sim is not a test of *your* system.

## Decision by thesis level

| If the thesis is… | Use |
| --- | --- |
| Final-year / limited lab time | Python digital twin + EnergyPlus (single zone, CO2 + fan + OA cooling). Mention CONTAM as future work if PM physics is thin. |
| MPhil / paper-grade IAQ + energy | **EnergyPlus + CONTAM + Python** as primary. Pi experiment validates the controller and the twin. |
| Spatial concentration / “where to put the sensor” | Add a **short CFD case** (OpenFOAM or DesignBuilder CFD) as a *chapter*, not the annual energy engine. |

## Tools you should not pick as the main engine

| Tool | Why not as primary |
| --- | --- |
| Home Assistant / MATLAB-only | Fine for the Pi dashboard, not an annual building-energy result. |
| CFD only (OpenFOAM, Fluent, FDS) | Hours-to-days per case; cannot run a year of occupancy scenarios honestly. |
| CONTAM alone | Strong IAQ, weak HVAC electricity and coil loads. |
| EnergyPlus alone | Acceptable if PM/O2 are secondary; weaker filters and multi-zone airflow than CONTAM. |
| IES VE / IDA ICE / TRNSYS | Valid if the school already trains you on them. Do not buy a licence just for this topic. TRNSYS+CONTAM (Type 98) is a documented alternative, not simpler. |

## Two-layer architecture (required)

```
Occupancy ──► Control law (one Python module) ──► Ventilation rate Q(t)
                      │                                    │
                      │ used on                            │
                      ▼                                    ▼
              Raspberry Pi 5                    EnergyPlus + CONTAM (annual)
              + O2/CO2/PM + meter               + Hong Kong EPW weather
                      │
                      ▼
              Short lab / room trial  ──validate──►  Python well-mixed twin
```

The **same** `control.py` (setpoints, hysteresis, min OA, PM override) must run on the Pi and in the sim. If the sim uses EnergyPlus’s built-in DCV and the Pi uses a different rule, the paper cannot claim they are the same system.

## What EnergyPlus is responsible for

- Geometry / constructions / internal gains (or a DOE prototype office / classroom).
- Weather: Hong Kong EPW (e.g. Hong Kong Observatory / EnergyPlus weather).
- HVAC: fan power, coil energy from outdoor-air enthalpy, optional ERV.
- Native objects useful as *baselines*: `Controller:MechanicalVentilation` DCV = Yes (occupancy VRP). Your multi-pollutant law still goes through Python.
- Outputs: `Fan:Electricity`, `Heating Coil Energy`, `Cooling Coil Energy`, zone CO2 if enabled.

Use the **EnergyPlus Python Plugin** (or EMS schedule actuators) so each timestep:

1. Read zone CO2, PM (from CONTAM or generic contaminant), occupancy, outdoor PM.
2. Call `control.py`.
3. Write outdoor-air / fan flow actuators.

## What CONTAM is responsible for

- Multi-zone airflow from fan, wind, buoyancy.
- CO2 from occupants (generation ~ typical 0.3–0.5 L/min·person, activity-dependent).
- PM2.5: outdoor file, indoor sources (optional cooking), deposition, **filters** (EnergyPlus cannot model filter paths as well).
- O2 as a bulk contaminant: consumption proportional to occupancy, outdoor 20.95%.
- Co-simulation with EnergyPlus via FMI / ContamFMU (NIST documented path).

CONTAM is Windows-centred. If the working OS is Linux-only, either run CONTAM on a Windows VM, or run EnergyPlus+Python as the annual engine and keep CONTAM as a methods-chapter sensitivity (state this limitation).

## Python digital twin (hardware chapter)

Well-mixed single zone is enough to match a small room experiment:

\[
V \frac{dC}{dt} = N(t)\,G + Q_{\mathrm{oa}}(C_{\mathrm{out}} - C) + Q_{\mathrm{inf}}(C_{\mathrm{out}} - C) - k_{\mathrm{dep}} V C + S_{\mathrm{in}}
\]

- \(C\): CO2, PM2.5, or O2 (O2 uses a consumption term \(N G_{O2}\)).
- Fan electricity (variable-speed): \(P = P_{\mathrm{des}} (Q/Q_{\mathrm{des}})^3\) plus standby.
- Hong Kong cooling of OA can be estimated from weather enthalpy, but **do not** use only fan kWh in the annual claim — use EnergyPlus for that number.

Calibrate \(V\), \(Q_{\mathrm{inf}}\), \(G\) against Pi logs (empty room decay + occupied rise). Report NRMSE / CV(RMSE) like ASHRAE Guideline 14 style, even if the model is simple.

## Occupancy (“人流”) in software

Do not only use a flat 9:00–18:00 schedule if the claim is occupancy-based.

Options, from simple to strong:

1. **Deterministic schedule** (classroom timetable / office diversity) — minimum acceptable baseline.
2. **Stochastic occupancy** (Markov arrival/departure, or agent counts) written to an EnergyPlus People schedule each timestep.
3. **Measured occupancy** from the Pi (PIR, mmWave people count, or CO2-inferred \(N\)) replayed into the sim.

For the paper, run the same weather and the same occupancy trace through every control scenario.

## Scenarios the sim must run

Keep names stable in code, plots, and the thesis:

| ID | Policy | What it models |
| --- | --- | --- |
| `S0_always_on` | Design outdoor air 24/7 or occupied-hours full design OA | “長開” |
| `S1_occupancy_vrp` | ASHRAE 62.1 people+area, real \(N(t)\) | Perfect occupancy metering |
| `S2_co2_dcv` | CO2 setpoint / proportional | Common DCV |
| `S3_multi_iaq` | CO2 + PM2.5 (+ O2 safety floor) | **Your Pi algorithm** |
| `S4_schedule` | Fixed timetable OA | Extra baseline if reviewers ask |

Hong Kong-specific: add an **outdoor PM2.5 lockout or filter-aware OA cap** inside `S3_multi_iaq`. Occupancy-only DCV can raise indoor PM when outdoor air is dirty; that is a publishable result, not a bug.

## Metrics (must appear in results)

**Energy**

- Fan kWh
- Outdoor-air coil kWh (cooling + heating)
- Total HVAC kWh and kWh / m² · year
- kWh per occupied person-hour

**IAQ**

- Hours and occupant-hours with CO2 > 1000 ppm (and 1500 ppm sensitivity)
- PM2.5 vs WHO 2021 (5 µg/m³ annual / 15 µg/m³ 24 h) and a local IAQ scheme if required (e.g. HK IAQ Certification)
- O2: treat as a **safety constraint** (e.g. never below 19.5% vol). Do not treat O2 as the main occupancy signal unless the experiment proves SNR.

**Control quality**

- Mean ventilation rate vs occupancy
- Sensor-to-actuator delay
- Time below minimum OA (ASHRAE area component)

## Weather, standards, and timestep

- Weather: Hong Kong EPW; report station and year.
- Outdoor PM2.5: EPD Air Quality Health Index station nearest the assumed site, hourly, same period if possible.
- Ventilation: ASHRAE 62.1 (state year) and/or local building regs; do not mix versions silently.
- Typical timestep: 1–6 min in EnergyPlus/CONTAM; Pi logs at 10–30 s, downsample to the sim step for validation.

## Practical install path

1. Install EnergyPlus + (optional) OpenStudio.
2. Write `control.py` first; unit-test it with fake sensor time series.
3. Wrap the Python well-mixed twin; fit it to a one-day Pi experiment.
4. Build a single-zone EnergyPlus model; Python plugin calls `control.py`.
5. If PM/O2 physics must be in the annual paper: add CONTAM co-simulation.
6. Run `S0`–`S3` for a year; then typical week zoom-in figures for the thesis.

## Sentence you can paste into the proposal

> Indoor air quality and ventilation airflow will be simulated with NIST CONTAM; HVAC electricity (fan and outdoor-air conditioning) will be simulated with EnergyPlus using Hong Kong weather. The Raspberry Pi 5 control law will be executed inside the co-simulation via a Python plugin so that always-on and occupancy/IAQ-based strategies are compared under identical occupancy and climate. A well-mixed Python model will be calibrated to the physical prototype for controller validation.
