# Supervisor one-pager

**Working title:** Occupancy- and multi-pollutant-based ventilation control on a Raspberry Pi 5: prototype and simulated electricity use versus always-on operation.

## Question

In a Hong Kong indoor space, how much **HVAC electricity** (fan **and** outdoor-air conditioning) can be saved by modulating ventilation with occupancy / IAQ sensors, compared with **always-on design outdoor air**, without worsening CO2 and PM2.5 compliance? A Raspberry Pi 5 with **O2, CO2, and PM** sensors implements the controller in a real room; **annual results are simulated**.

## Method

| Layer | Tool | Role |
| --- | --- | --- |
| Annual energy | EnergyPlus + HK EPW | Fan kWh and outdoor-air coil kWh |
| Contaminants | NIST CONTAM | CO2, PM2.5, optional O2, infiltration, filters |
| Controller | One Python module | Same law on the Pi and in the co-simulation |
| Validation | Pi + well-mixed twin | Short experiment; CV(RMSE) vs logs |

**Scenarios (identical occupancy and weather):** always-on design OA (`S0`); ASHRAE 62.1 occupancy VRP (`S1`); CO2 DCV (`S2`); Pi multi-signal law with PM-aware outdoor-air logic and O2 safety floor (`S3`).

## O2 (scope control)

Indoor O2 is ~20.95% vol; occupancy-driven changes are often below low-cost sensor noise. O2 is a **safety / SNR study**, not assumed occupancy metering. A negative result is acceptable.

## What the student will deliver

- Reproducible co-simulation (versions, EPW, occupancy file, outdoor PM, setpoints).
- Prototype logs and twin calibration error.
- Annual table: fan vs coil kWh, kWh/m²·y, IAQ exceedance hours, % vs `S0`.
- Thesis chapters: design, methods, results, limitations (especially if CONTAM or AHU metering is incomplete).

## Not in scope

CFD as the annual engine; claiming USB-meter or fan-only energy as whole-HVAC savings; medical claims.
