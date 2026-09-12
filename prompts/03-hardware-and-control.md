# Follow-up prompt 3 — Hardware and control firmware

先貼 master prompt，再貼呢段。只處理 Pi 原型同 `control.py`，唔好走去改年度模擬引擎。

=== BEGIN PROMPT ===

Design the **Raspberry Pi 5 prototype** so it can validate the same `control.py` used in EnergyPlus/CONTAM. Hong Kong indoor space; sensors: **O2, CO2, PM**; actuation: ventilation airflow; occupancy / 人流 must be logged.

## Deliverables

1. **BOM table:** part, quantity, interface (I2C/UART/PWM/USB), why it exists, accuracy vs the quantity we need (especially O2 Δ vs sensor error). Prefer parts a student can buy; mark optional (mmWave vs camera; optical O2 vs electrochemical).
2. **Wiring / safety:** 3.3 V vs 5 V, common ground, fan MOSFET/PWM, not driving mains on GPIO. How to **meter fan electricity** separately from room AC.
3. **Software architecture:** one Python package:
   - `sensors/` poll → SI units
   - `occupancy/` people count or CO2 inversion (label which)
   - `control.py` **identical API** to the sim (inputs: CO2 ppm, PM2.5 µg/m³, O2 %vol, N, outdoor PM if available; output: Q_cmd or 0–1 fan fraction)
   - `log/` CSV columns and clock sync
   - no Home Assistant required (optional later for dashboard only)
4. **O2 SNR protocol:** empty room overnight vs occupied N known; how to conclude “O2 cannot drive DCV” with a plot the examiner accepts.
5. **Calibration / experiment days:** decay ACH; A/B `S0` vs `S3`; headcount ground truth; what to export so the twin can be fitted.
6. **Ethics:** camera vs mmWave; data retention.

## Rules

- Do not claim the lab week replaces annual EnergyPlus kWh.
- If a sensor cannot support the RQ, say **drop or demote** it (likely O2) rather than adding more breakout boards.
- Keep `S0`–`S3` mode switch in firmware so the room trial uses the same names as the sim.

=== END PROMPT ===
