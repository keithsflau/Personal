# Methods box (default case study)

Use these numbers in Chapter 4 until the supervisor changes the space. They are **defaults**, not measurements. Replace any value that is later measured on site and keep a change log.

## Space (default: university lecture room)

| Parameter | Default | Source / note |
| --- | --- | --- |
| Use | Lecture classroom | High occupancy diversity → `S0` vs occupancy control actually differs |
| Floor area \(A\) | 64 m² (8 m × 8 m) | |
| Height | 3.2 m | |
| Volume \(V\) | 205 m³ | |
| Design occupancy \(N_\mathrm{des}\) | 30 | |
| Minimum (area) OA | 0.3 L/s·m² → **19.2 L/s** | ASHRAE 62.1-2022 Table 6-1 lecture classroom |
| People OA | 3.8 L/s·person | Same table |
| Design OA \(Q_\mathrm{des}\) | \(19.2 + 30\times 3.8 =\) **133.2 L/s** (0.133 m³/s) | ~2.3 h⁻¹ if OA only |
| Infiltration (unmeasured) | 0.3 h⁻¹ | Replace after decay test |
| HVAC | Dedicated outdoor air + room AC, or inline fan | Annual **coil** energy from EnergyPlus, not from the Pi PSU |

Lock **ASHRAE 62.1-2022** in the thesis unless the school requires another year. Do not mix 2010 and 2022 rates.

## Generation and outdoor boundary

| Species | Outdoor | Indoor source / sink |
| --- | --- | --- |
| CO2 | 420 ppm | 4.0×10⁻³ L/s·person at sedentary/classroom activity; scale with activity schedule |
| O2 | 20.95% vol | Consumption consistent with RQ ≈ 1 mol O2 per 1 mol CO2 (adjust if you cite a metabolic study) |
| PM2.5 | Hourly EPD CSV | Deposition ~0.19 h⁻¹ (state literature); indoor source off in base case; optional 10 min lecture/chalk or 10 min cooking sensitivity |
| Filter (CONTAM) | MERV 8 or 13 on OA/recirc | EnergyPlus-only fallback cannot match this; weaken the PM claim |

Outdoor PM2.5 file: `data/outdoor_pm25.csv` (timestamp, µg/m³), station name in methods (placeholder: “EPD Central / nearest to campus”).

Weather: EnergyPlus **Hong Kong** EPW (record the exact `*.epw` filename and year). Simulation timestep **6 minutes** (EnergyPlus/CONTAM); Pi logs 10–30 s, resampled to 6 min for twin comparison.

## Well-mixed twin (hardware chapter)

For each contaminant \(C\) (CO2, PM2.5; O2 analogous with a consumption term):

\[
V\frac{dC}{dt} = N(t)\,G + Q_{\mathrm{oa}}(C_{\mathrm{out}}-C) + Q_{\mathrm{inf}}(C_{\mathrm{out}}-C) - k_{\mathrm{dep}} V C + S_{\mathrm{in}}
\]

Fan (variable speed):

\[
P_{\mathrm{fan}} = P_{\mathrm{des}}\left(\frac{Q}{Q_{\mathrm{des}}}\right)^{3} + P_{\mathrm{standby}}
\]

Default \(P_\mathrm{des} = 80\,\mathrm{W}\) at \(Q_\mathrm{des}\) (replace with the fan nameplate). **Do not** use \(P_{\mathrm{fan}}\) as the Hong Kong annual HVAC result.

Calibration: (1) empty-room CO2/PM decay → \(Q_{\mathrm{inf}}\) or ACH; (2) occupied period with counted \(N\) → check \(G\); (3) report **CV(RMSE)** of CO2 and of commanded/measured fan power vs Pi.

## Control setpoints (`control.py`)

| Symbol | Default |
| --- | --- |
| CO2 target | 1000 ppm (1500 ppm sensitivity) |
| \(Q_\min\) | area OA 19.2 L/s (occupied); 0 or infiltration-only if the room is proven vacant **and** you justify it |
| \(Q_\max\) | \(Q_\mathrm{des}\) unless PM/O2 safety asks more (cap at 1.2 \(Q_\mathrm{des}\)) |
| O2 safety | increase OA if O2 < 19.5% vol |
| PM logic | if indoor PM2.5 > 15 µg/m³ (WHO 24 h) **and** outdoor < indoor, raise OA; if outdoor PM2.5 > indoor, hold \(Q_\min\) (filtration/recirc if modelled) |
| Hysteresis | ±50 ppm CO2; fan rate limit 10% of \(Q_\mathrm{des}\) per minute |
| `S0` hours | occupied timetable 08:00–22:00 at \(Q_\mathrm{des}\), else \(Q_\min\) **or** 24 h \(Q_\mathrm{des}\) — pick one, name it in the caption |

## EnergyPlus / CONTAM split

**EnergyPlus logs:** zone air temperature; fan electricity energy; outdoor air mass flow; cooling coil electricity or chilled-water energy attributed to OA (state how you isolate OA load); occupancy.

**CONTAM:** zone CO2, PM2.5, O2; filter load; interzone flows if a corridor is added.

**Python plugin:** each timestep read concentrations + \(N(t)\) + outdoor PM; call `control.py`; write OA/fan actuator.

## Occupancy file

`data/occupancy.csv`: `timestamp, N`. Build from a lecture timetable (e.g. 50 min classes, 10 min gaps, lunch empty) plus a stochastic ± occupancy for sensitivity. **Replay the same file** for `S0`–`S3`.

## Results tables the methods promise

1. Annual kWh: columns `S0`…`S3`; rows fan, OA coil, total, kWh/m², kWh/person-h, % vs `S0`.
2. IAQ: hours CO2 > 1000 ppm; occupant-hours; PM2.5 mean and hours > 15 µg/m³; min O2.
3. Validation: twin CV(RMSE); O2 SNR (occupied–empty Δ vs sensor noise).

## Versions to record when you install (do not invent)

EnergyPlus version; CONTAM version; Python 3.x; `control.py` git hash; EPW filename; EPD station and year.

If this box is copied into the thesis without those versions and without saying which defaults were replaced by measurements, the methods chapter is not finished.
