# 紫微斗數排盤 (Zi Wei Dou Shu Chart)

純前端的紫微斗數排盤工具 — 單一 HTML 檔案，零後端依賴。

**線上使用：** 直接開啟 `index.html` 即可，無需安裝任何東西。

---

## 功能

### 十二宮全星顯示
- 14 主星 + 輔星 + 雜曜，每個宮位全顯（全顯模式）
- 星曜亮度標記（廟旺得利平陷）
- 四化（祿權科忌）彩色標示

### 四柱 + 基本資料（中心區）
- 年柱、月柱、日柱、時柱（庚午·壬午·辛亥·庚寅）
- 五行局、命主、身主、身宮位置
- 農曆生日、生肖、星座

### 預測目標時間
- 日期 + 時間（24小時下拉）輸入
- 變更後**自動**重新計算所有運限

### 七層可切換運限
| 運限 | 說明 |
|------|------|
| **大限** | 10 年運勢，顯示天干地支 + 年齡範圍 |
| **小限** | 1 年個人限制，顯示天干地支 + 虛歲 |
| **流年** | 當年運勢 |
| **流月** | 當月運勢 |
| **流日** | 當日運勢 |
| **流時** | 當辰運勢（依所選時間計算） |
| **四化** | 切換顯示/隱藏所有星曜四化標記 |

- 使用 Checkbox 切換（參考 myfate 行為）
- 勾選後在對應宮位顯示運限資訊

---

## 技術選型

### 計算引擎：[iztro](https://github.com/SylarLong/iztro) 2.4.7

MIT 開源 JavaScript 庫。

```js
import { astro } from 'iztro';

// 取得命盤
const astrolabe = astro.bySolar('1990-6-15', 2, '男', true, 'zh-TW');

// 計算運限
const horoscope = astrolabe.horoscope('2026-5-22 18:00');
// → { decadal, age, yearly, monthly, daily, hourly }
// 各層：{ index, name, heavenlyStem, earthlyBranch, palaceNames, mutagen }
```

### 前端
- **單一 HTML 檔案** — CSS + JS 全部在同一頁
- Bootstrap 5.3.3（CDN） — 排版與卡片樣式
- Bootstrap Icons（CDN）
- **無後端、無框架依賴**

---

## 資料結構對照

### iztro API → UI 對應

| iztro 屬性 | UI 顯示 | 說明 |
|------------|---------|------|
| `palaces[].name` | 宮名 | 已翻譯（zh-TW） |
| `palaces[].heavenlyStem` + `earthlyBranch` | 天干地支 | 如「戊寅」 |
| `palaces[].majorStars` | 主星 | bold |
| `palaces[].minorStars` | 輔星 | normal |
| `palaces[].adjectiveStars` | 雜曜 | lighter |
| `star.brightness` | 亮度 | 如「廟」「旺」 |
| `star.mutagen` | 四化 | 祿權科忌，彩色 |
| `astrolabe.fiveElementsClass` | 五行局 | 如「金四局」 |
| `astrolabe.soul` + `body` | 命主/身主 | |
| `astrolabe.chineseDate` | 四柱 | 如「庚午 壬午 辛亥 庚寅」 |
| `astrolabe.lunarDate` | 農曆生日 | |
| `astrolabe.sign` | 星座 | 如「雙子座」 |
| `astrolabe.zodiac` | 生肖 | 如「馬」 |

### 宮位分支 → 網格位置
```
巳(5)  午(6)  未(7)  申(8)
辰(4)  [中心] [中心]  酉(9)
卯(3)  [中心] [中心]  戌(10)
寅(2)  丑(1)  子(0)  亥(11)
```

---

## 檔案結構

```
zi-wei-pai-pan/
├── index.html                        # 排盤主頁面
├── README.md                         # 本文件
├── CONTEXT.md                        # 領域術語詞彙表
├── docs/
│   └── ui-ux-requirements.md         # UI/UX 需求規格書
```

---

## 參考資料

- [iztro GitHub](https://github.com/SylarLong/iztro)
- [iztro 開發文件](https://docs.iztro.com)
- [myfate 參考頁面](https://myfate.herokuapp.com/ziwei)
