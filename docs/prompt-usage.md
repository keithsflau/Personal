# 點用呢批 prompt

論文語言可以係英文；同 AI／supervisor 討論可以用粵語／中文。專有名詞（EnergyPlus、CONTAM、DCV、ASHRAE）保持英文。

## 模擬軟件（一句）

**年度用電比較：** EnergyPlus（風扇 + 新風冷負荷）+ CONTAM（CO2／PM／可選 O2）+ Python（人流 + 同 Pi 同一套 `control.py`）。

**實驗室驗證：** Python 單室完全混合模型，對住 Pi 數據校準。唔好用 CFD 做一年能耗。

詳情：[`simulation-stack.md`](simulation-stack.md)。

## Prompt 使用順序

| 順序 | 檔案 | 你要佢做咩 |
| --- | --- | --- |
| 0 | [`../prompts/00-master-prompt.md`](../prompts/00-master-prompt.md) | 開新 chat 必貼。鎖死 RQ、場景 ID、軟件棧、O2 要誠實。 |
| 1 | [`../prompts/01-literature-review.md`](../prompts/01-literature-review.md) | Chapter 2 文獻地圖，唔好寫成 IAQ 散文。 |
| 2 | [`../prompts/02-simulation-setup.md`](../prompts/02-simulation-setup.md) | 寫到 methods 可複現嘅模擬規格。 |
| 3 | [`../prompts/03-hardware-and-control.md`](../prompts/03-hardware-and-control.md) | BOM、接線、同 sim 共用嘅 `control.py`。 |
| 4 | [`../prompts/04-write-paper.md`](../prompts/04-write-paper.md) | 有表有數先用。缺數要寫 `TODO`，唔好估。 |

**每一個 follow-up 都要開新任務前再貼一次 master prompt**，或者同一個 thread 確認 AI 未偷換軟件棧（例如改用 CFD／只計風扇瓦數）。

## 複製時注意

- 由 `=== BEGIN PROMPT ===` 抄到 `=== END PROMPT ===`。
- 場景名唔好改：`S0_always_on`、`S1_occupancy_vrp`、`S2_co2_dcv`、`S3_multi_iaq`。
- 如果你嘅空間唔係香港，喺 master prompt 後面加一句城市 + EPW + 室外 PM 來源即可，方法唔好改。

## 交 supervisor

先交 [`research-plan.md`](research-plan.md) 同 [`supervisor-one-pager.md`](supervisor-one-pager.md)。AI 產出要你 overlay 學校格式（字數、citation style、ethical approval）。
