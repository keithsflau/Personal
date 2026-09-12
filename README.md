# Indoor Ventilation Control Thesis Pack

Planning pack for a thesis that uses a **Raspberry Pi 5** with **O2, CO2, and PM sensors** to control indoor ventilation, then compares **always-on** vs **occupancy-based airflow** electricity use. Annual and paper-scale results come from **software simulation**; the Pi is the hardware prototype and validation node.

## Start here

| File | Use |
| --- | --- |
| [`prompts/00-master-prompt.md`](prompts/00-master-prompt.md) | Paste this into Cursor / ChatGPT / Claude as the project brief |
| [`docs/prompt-usage.md`](docs/prompt-usage.md) | 中文：prompt 順序同使用規則 |
| [`docs/research-plan.md`](docs/research-plan.md) | Supervisor-facing plan (RQ, methods, metrics, paper outline) |
| [`docs/supervisor-one-pager.md`](docs/supervisor-one-pager.md) | One page for the supervisor |
| [`docs/simulation-stack.md`](docs/simulation-stack.md) | Why EnergyPlus + CONTAM + Python, and what not to use as the main engine |
| [`docs/methods-box.md`](docs/methods-box.md) | Default classroom numbers, equations, setpoints (Chapter 4) |

Follow-up prompts (use after the master prompt, one job each):

- [`prompts/01-literature-review.md`](prompts/01-literature-review.md)
- [`prompts/02-simulation-setup.md`](prompts/02-simulation-setup.md)
- [`prompts/03-hardware-and-control.md`](prompts/03-hardware-and-control.md)
- [`prompts/04-write-paper.md`](prompts/04-write-paper.md)

## One-line answer (software sim)

**Primary (thesis-grade):** EnergyPlus (energy + HVAC) + CONTAM (CO2 / PM / optional O2) + Python (occupancy + the same control law as the Pi).

**Companion (hardware digital twin):** a well-mixed Python room model, so the Pi experiment and the annual sim share one control algorithm.

Do not use CFD (OpenFOAM / Fluent) as the main energy-comparison engine unless spatial concentration fields become a research question.

## Research question (working)

> Relative to always-on design ventilation, how much electricity does occupancy-modulated ventilation save in a Hong Kong indoor space, and does adding O2 and PM to a CO2/occupancy controller change energy use or IAQ compliance?
