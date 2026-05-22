# CONTEXT.md — 紫微斗數排盤專案

## Domain Glossary

### 命盤 / Astrolabe
紫微斗數排出的完整星盤，包含十二宮位與所有星曜。

### 十二宮 / Twelve Palaces
命盤上的十二個生活面向區域，依序為：
- 命宮（Destiny Palace）
- 兄弟宮（Siblings Palace）
- 夫妻宮（Partner Palace）
- 子女宮（Children Palace）
- 財帛宮（Wealth Palace）
- 疾厄宮（Health Palace）
- 遷移宮（Travel Palace）
- 僕役宮（Friends/Subordinates Palace）
- 官祿宮（Career Palace）
- 田宅宮（Property Palace）
- 福德宮（Fortune/Mental Palace）
- 父母宮（Parents Palace）

### 十四主星 / Fourteen Major Stars
紫微、天機、太陽、武曲、天同、廉貞、天府、太陰、貪狼、巨門、天相、天梁、七殺、破軍。

### 輔星 / Assistant Stars
左輔、右弼、文昌、文曲、天魁、天鉞。

### 煞星 / Malefic Stars
地空、地劫、祿存、擎羊、陀羅、火星、鈴星、天馬。

### 四化 / Four Transformations
祿（Prosperity）、權（Power）、科（Fame/Reputation）、忌（Obstacle）。

### 自化 / Self-Transformation
依各宮天干對應的四化規則，將該宮星曜轉化為自化狀態（如自祿、自權）。自化與四化不同在於，四化由生年天干決定，自化由各宮天干決定。透視命盤的動態互動與環境牽動。

自化規則（天干 → 星曜 → 四化）：
- 甲：廉貞祿、破軍權、武曲科、太陽忌
- 乙：天機祿、天梁權、紫微科、太陰忌
- 丙：天同祿、天機權、文昌科、廉貞忌
- 丁：太陰祿、天同權、天機科、巨門忌
- 戊：貪狼祿、太陰權、右弼科、天機忌
- 己：武曲祿、貪狼權、天梁科、文曲忌
- 庚：太陽祿、武曲權、太陰科、天同忌
- 辛：巨門祿、太陽權、文曲科、文昌忌
- 壬：天梁祿、紫微權、左輔科、武曲忌
- 癸：破軍祿、巨門權、太陰科、貪狼忌

### 運限 / Fortune Limits
影響命盤的動態時間維度：大限（10年）、小限（1年）、流年（當年）、流月（当月）、流日（當日）、流時（當辰）。

### 運限方向 / Flow Direction
- **大限**：陽男陰女順行（順時針），陰男陽女逆行（逆時針）
- **小限**：男命順行，女命逆行
- **流年／流月／流日／流時**：均為順時針，**不分性別**
  - 流年起於太歲地支所在宮位
  - 流月起於當年正月（寅月）地支所在宮位
  - 流日起於當日地支所在宮位
  - 流時起於當日子時所在宮位（以日斗君定之）

### 小限算法 / Small Limit Algorithm
小限是每年一宮的個人運限，由起點宮位依性別方向逐年輪替：
- **起點規則**：依出生年地支的三合墓庫位決定 1 歲起點宮位。
  - 寅午戌年 → 辰位起 1 歲
  - 申子辰年 → 戌位起 1 歲
  - 巳酉丑年 → 未位起 1 歲
  - 亥卯未年 → 丑位起 1 歲
- **方向規則**：男命順行（順時針），女命逆行（逆時針）
- **週期**：一宮一年，12 年一循環。每個宮位的 `ages` 陣列為該宮位在 12 年循環中被小限造訪的歲數列表。
- **年齡計算**：今年 − 生年 + 1 = 虛歲（以生日為基準過期算加一歲）

### 五行局 / Five Element Categories
水二局、木三局、金四局、土五局、火六局。依生年天干與命宮地支查表確定，用於計算紫微星位置。

### 三方四正 / Three Directions and Four Parts
某宮位與其對宫、三合宮的組合，用於星曜互動分析。

### 空宮 / Empty Palace
沒有十四主星的宮位（但可能有輔煞星）。

---

### 時辰索引 / Hour Index
iztro `bySolar()` 的 `hour` 參數使用**時辰索引 (0~12)**，非起始小時。
- 0=早子(00:00~00:59), 1=丑, 2=寅, 3=卯, 4=辰, 5=巳, 6=午,
  7=未, 8=申, 9=酉, 10=戌, 11=亥, 12=夜子(23:00~23:59)

### 早子時 / 夜子時換日規則

App 採用 **子正換日（午夜 00:00 為界）** 規則：
- 23:00-23:59（夜子/晚子）→ **當天**日期
- 00:00-00:59（早子）→ **隔天**日期

iztro library 內部處理：
- 夜子時（timeIndex=12）：日柱計算自動 +1 天（dayFix），流日/流月不受日期調整影響
- 早子時（timeIndex=0）：正常計算

預測目標時間的傳遞方式：
```js
// runPrediction() 中轉換
const startHour = branchIdx === 0 ? 0 : branchIdx === 12 ? 23 : branchIdx * 2 - 1;
updateHoroscope(targetDate + ' ' + String(startHour).padStart(2,'0') + ':00');
```

*This file was updated during the grill-with-docs session.*

### 運限顯示格式 / Fortune Limit Display Format
- **流年／流月／流日／流時**：全部 12 宮順時針循環顯示
  - 起始宮位：顯示完整「流年 丙午」格式（含 label + value + 四化）
  - 其餘 11 宮：僅顯示角色名稱（起始宮位順時針往後偏移的角色名稱），顏色與對應運限一致
  - 各層有獨立識別色：流年(紫)、流月(青)、流日(橙)、流時(粉紅)
