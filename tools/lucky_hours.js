// 2026 香港公眾假期 — 流日/流時財帛宮四化掃描
// 條件：
//   流時或流日的財帛宮中，需有 貪狼/武曲/破軍/太陽/太陰 其中之一
//   且在財帛的那些星中，至少一顆是該流日的化祿或化權
//
// 流日/流時財帛宮 = physical_palace[(scope.index + 8) % 12]
//   因為 FLOW_ROLES_CLOCKWISE 逆時針順序：命宮(0) -> 父母(1) -> ... -> 財帛(8) -> ...
//
// 化祿 = mutagen[0], 化權 = mutagen[1]

const iztro = require('iztro');
const master = iztro.astro.bySolar('1982/11/11', 11, 'male', true, 'zh-TW');

const TARGET_STARS = ['貪狼', '武曲', '破軍', '太陽', '太陰'];

const FLOW_ROLES = ['命宮', '父母', '福德', '田宅', '官祿', '僕役', '遷移', '疾厄', '財帛', '子女', '夫妻', '兄弟'];
const CAI_BO_OFFSET = FLOW_ROLES.indexOf('財帛'); // 8

// 2026 香港公眾假期 (GovHK 公布 + 每個星期日)
function pad(n) { return String(n).padStart(2, '0'); }

const HOLIDAYS_SET = new Set([
  '2026-01-01', // 元旦
  '2026-02-17', // 農曆年初一
  '2026-02-18', // 農曆年初二
  '2026-02-19', // 農曆年初三
  '2026-04-03', // 耶穌受難節
  '2026-04-04', // 耶穌受難節翌日
  '2026-04-06', // 清明節翌日
  '2026-04-07', // 復活節星期一翌日
  '2026-05-01', // 勞動節
  '2026-05-25', // 佛誕翌日
  '2026-06-19', // 端午節
  '2026-07-01', // 香港特別行政區成立紀念日
  '2026-09-26', // 中秋節翌日
  '2026-10-01', // 國慶日
  '2026-10-19', // 重陽節翌日
  '2026-12-25', // 聖誕節
  '2026-12-26', // 聖誕節後第一個周日
]);

// 加上所有星期日
for (let m = 0; m < 12; m++) {
  for (let d = 1; d <= 31; d++) {
    const dt = new Date(2026, m, d);
    if (dt.getMonth() !== m) break;
    if (dt.getDay() === 0) {
      HOLIDAYS_SET.add('2026-' + pad(m + 1) + '-' + pad(d));
    }
  }
}

const HOLIDAYS = [...HOLIDAYS_SET].sort();

// 時辰標籤 (13個)
const TIME_LABELS = ['早子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '夜子'];

// 檢查某個 flow scope（流日或流時）是否滿足條件
// scope = { index, mutagen, heavenlyStem, earthlyBranch }
// scopeName = '流日' or '流時'
function checkScope(scope, scopeName, dateStr, timeIndex) {
  if (!scope || scope.index < 0 || !Array.isArray(scope.mutagen)) return null;

  // 財帛宮的 physical palace index
  const wealthPalaceIdx = (scope.index + CAI_BO_OFFSET) % 12;
  const wealthPalace = master.palaces[wealthPalaceIdx];
  const wealthStars = wealthPalace.majorStars || [];

  // 檢查財帛宮是否有目標星
  const foundStars = wealthStars.filter(s =>
    TARGET_STARS.some(t => s.name.startsWith(t))
  );
  if (foundStars.length === 0) return null;

  // 檢查這些星中，是否至少一顆是化祿或化權
  const huaLu = scope.mutagen[0];
  const huaQuan = scope.mutagen[1];

  const matched = foundStars.filter(s => s.name === huaLu || s.name === huaQuan);
  if (matched.length === 0) return null;

  const details = matched.map(s => {
    if (s.name === huaLu) return s.name + '(化祿)';
    if (s.name === huaQuan) return s.name + '(化權)';
    return s.name;
  });

  return {
    date: dateStr,
    timeIndex,
    timeLabel: TIME_LABELS[timeIndex] || `${timeIndex}`,
    scope: scopeName,
    flowStem: scope.heavenlyStem + scope.earthlyBranch,
    wealthPalace: wealthPalace.name,
    foundStars: foundStars.map(s => s.name).join(','),
    matched: details.join(','),
  };
}

// === 開始掃描 ===
console.log('=== 2026 香港公眾假期 流日/流時財帛宮四化掃描 ===');
console.log('目標星：貪狼、武曲、破軍、太陽、太陰 (需化祿或化權)');
console.log('');

let totalMatches = 0;

for (const dateStr of HOLIDAYS) {
  let dateResults = [];

  for (let ti = 0; ti <= 12; ti++) {
    const h = master.horoscope(dateStr, ti);

    // 檢查流日
    const r1 = checkScope(h.daily, '流日', dateStr, ti);
    if (r1) dateResults.push(r1);

    // 檢查流時
    const r2 = checkScope(h.hourly, '流時', dateStr, ti);
    if (r2) dateResults.push(r2);
  }

  if (dateResults.length > 0) {
    totalMatches += dateResults.length;
    console.log(`\n📅 ${dateStr}`);
    for (const r of dateResults) {
      console.log(`  ${r.timeLabel.padEnd(4)} ${r.scope}=${r.flowStem} 財帛=${r.wealthPalace} 星=[${r.foundStars}] ${r.matched}`);
    }
  }
}

console.log(`\n=== 掃描完成，共 ${totalMatches} 筆符合條件 ===`);
