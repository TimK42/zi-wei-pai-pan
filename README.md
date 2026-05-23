# 紫微斗數排盤 (Zi Wei Dou Shu Chart)

純前端的紫微斗數排盤工具 — 單一 HTML 檔案，零後端依賴。

**線上使用：** 直接開啟 `index.html` 即可，無需安裝任何東西。

---

## 功能

### 十二宮全星顯示
- 14 主星 + 輔星 + 雜曜，每個宮位全顯（全顯模式）
- 星曜亮度標記（廟旺得利平陷）
- 四化（祿權科忌）彩色標示
- 輔星為主星 3/4 大小，雜星為主星 1/2 大小
- 支援深色主題（自動跟隨系統設定）

### 四柱 + 基本資料（中心區）
- 左上：農曆生日（含「日」）、實歲年齡、星座、生肖
- 右上：年柱 月柱（上行）、日柱 時柱（下行）
- 左下：五行局、命主、身主、身宮位置
- 右下：當前目標日期與時辰（如 2026/05/23 / 11:00 午）

### 預測目標時間
- 日期 + 時辰下拉輸入
- 時辰左右附有「上一個／下一個」按鈕：點選跳至相鄰時辰，跨日凌晨/午夜時自動更新日期
- **設定持久化**：所有設定（性別、出生、目標時間、運限開關）自動存入瀏覽器 localStorage，切換頁面或重新開啟後自動恢復
- 變更後**自動**重新計算所有運限
- 時辰選擇採「子正換日」（午夜 00:00 為界子午線）：早子(00:00-00:59)為隔天，夜子(23:00-23:59)為當天
- iztro 的夜子時日柱調整（dayFix）會自動補償

### 八層可切換運限
| 運限 | 說明 |
|------|------|
| **大限** | 10 年運勢，顯示天干地支 + 年齡範圍 |
| **小限** | 1 年個人限制，顯示天干地支 + 虛歲 |
| **流年** | 當年運勢 |
| **流月** | 當月運勢 |
| **流日** | 當日運勢 |
| **流時** | 當辰運勢（依所選時間計算） |
| **四化** | 切換顯示/隱藏所有星曜四化標記 |
| **自化** | 切換顯示/隱藏各宮天干對應的自化標記（如自祿、自權） |

- 使用 Checkbox 切換（參考 myfate 行為）
- 勾選後在對應宮位顯示運限資訊

### 運限顯示特性
- **大限**：全部 12 宮均顯示對應大限範圍（天干地支 + 年齡區間），當限宮粗體
- **小限**：全部 12 宮均顯示該宮小限年齡清單，當限宮粗體
- **流年／月／日／時**：全部 12 宮順時針循環顯示。流層角色名稱顯示在宮位標題列（緊貼在本命宮名之後，桌面版顯示全名、手機版自動縮為單字簡寫），起始宮位下方另顯示完整「流年 丙午 四化」格式，顏色區分各層
- **運限方向**：流年、流月、流日、流時均為順時針（不分性別）。僅大限、小限依陽男陰女順行／陰男陽女逆行
- 各層之間無分隔線，行距緊湊（margin-top:2px, padding-top:1px）

---

## 技術選型

### 計算引擎：[iztro](https://github.com/SylarLong/iztro) 2.4.7

MIT 開源 JavaScript 庫。

```js
import { astro } from 'iztro';

// 取得命盤 — hour 為時辰索引 (0=早子, 1=丑, ..., 12=夜子)
const astrolabe = astro.bySolar('1990-01-01', 6, '男', true, 'zh-TW');

// 計算運限 — hour 為實際 24h 小時
const horoscope = astrolabe.horoscope('2026-5-23 1:00');
// → { decadal, age, yearly, monthly, daily, hourly }
// 各層：{ index, name, heavenlyStem, earthlyBranch, palaceNames, mutagen }
```

> ⚠️ **注意**：`bySolar()` 的 `hour` 參數是**時辰索引 (0~12)**，不是起始小時！
> 對照：(0=00:00~00:59 早子, 1=01:00~02:59 丑, 2=03:00~04:59 寅, 3=05:00~06:59 卯,
> 4=07:00~08:59 辰, 5=09:00~10:59 巳, 6=11:00~12:59 午, 7=13:00~14:59 未,
> 8=15:00~16:59 申, 9=17:00~18:59 酉, 10=19:00~20:59 戌, 11=21:00~22:59 亥,
> 12=23:00~23:59 夜子)

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

## 測試

使用 **Playwright** 進行端到端測試，涵蓋 UI/UX 需求所有功能。

```bash
node tests/ziwei.spec.js
```

目前 52 項測試，全部通過。測試範圍：
- 出生預設值為當天日期 + 當下時辰（首次開啟即顯示當下命盤）
- 12 宮格渲染、宮名、中心區資訊
- 性別切換、四柱格式
- 大限／小限／流年／流月／流日／流時全 12 宮切換
- 運限標籤格式（非命宮僅顯示角色名稱，無「流X」前綴）
- 各層獨立色系（大限紅、小限綠、流年紫、流月青、流日橙、流時粉紅）
- 四化／自化 checkboxes toggle
- 無虛線分隔、行距緊湊
- 預測時間變更自動重算
- 上一個／下一個時辰導航按鈕（含跨日跳轉、夜子→早子跨日包裹）
- 主星粗體(≥600)、亮度標記、五行局

## 檔案結構

```
zi-wei-pai-pan/
├── index.html                        # 排盤主頁面
├── about.html                        # 關於頁面（功能簡介、免責聲明）
├── contact.html                      # 聯絡我們
├── privacy-policy.html               # 隱私權政策
├── ads.txt                          # AdSense 授權聲明
├── README.md                         # 本文件
├── CONTEXT.md                        # 領域術語詞彙表
├── CHANGELOG.md                      # 版本變更紀錄
├── robots.txt                        # 搜尋引擎爬蟲設定
├── sitemap.xml                       # 網站地圖
├── tests/
│   └── ziwei.spec.js                 # Playwright 端到端測試（52 tests）
├── tools/
│   └── lucky_hours.js               # 流日/流時財帛四化掃描工具 — 詳見 docs/tools.md
├── docs/
│   └── ui-ux-requirements.md         # UI/UX 需求規格書
```

---

## 工具腳本

`tools/` 目錄放獨立的 Node.js 工具，說明與使用方式見 [`docs/tools.md`](docs/tools.md)。

現有工具：
- [`lucky_hours.js`](docs/tools.md#lucky_hoursjs--流日流時財帛四化掃描) — 流日/流時財帛四化掃描

---

## 參考資料

- [iztro GitHub](https://github.com/SylarLong/iztro)
- [iztro 開發文件](https://docs.iztro.com)
- [myfate 參考頁面](https://myfate.herokuapp.com/ziwei)
