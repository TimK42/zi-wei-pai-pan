# 工具腳本 (tools/)

此目錄收納獨立的 Node.js 工具腳本，與前端 `index.html` 主應用分離。

## lucky_hours.js — 流日/流時財帛四化掃描

掃描指定年份香港公眾假期中，流日或流時的財帛宮是否同時滿足特定星曜且至少一顆為化祿或化權。目的是找出財氣較旺的時間區段。

### 條件

- **目標星曜**：貪狼、武曲、破軍、太陽、太陰
- **Scope**：流日或流時（任一符合即算）
- **財帛宮**：逆時針 offset 8（`physical_palace[(scope.index + 8) % 12]`）
- **四化**：`mutagen[0]=化祿` 或 `mutagen[1]=化權`
- **日期範圍**：香港公眾假期（GovHK 公告節日 + 每個星期日）

### 執行

```bash
cd zi-wei-pai-pan/
node tools/lucky_hours.js
```

### 修改參數

打開 `lucky_hours.js`：

```js
// 修改年份（第 1 步：改年份和月份）
// 程式中的日期迴圈和 HOLIDAYS 都寫死 2026 年
// 如果要改年份，請更新 HOLIDAYS 陣列和 Sundays 迴圈

// 修改目標星曜
const TARGET_STARS = ['貪狼', '武曲', '破軍', '太陽', '太陰'];
```
