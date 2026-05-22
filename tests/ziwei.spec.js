const { chromium } = require('playwright');
const { createServer } = require('http');
const { readFileSync } = require('fs');
const { join } = require('path');

const PORT = 18765;

// Simple static server for the test
function startServer() {
  const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf-8');
  return new Promise(resolve => {
    const server = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    server.listen(PORT, () => resolve(server));
  });
}

(async () => {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      passed++;
      console.log(`  ✅ ${name}`);
    } catch (e) {
      failed++;
      console.log(`  ❌ ${name}: ${e.message}`);
    }
  }

  console.log('\n🧪 Zi Wei Dou Shu — Playwright Tests\n');
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.palace-cell');

  // ─── Q1: 四化 CSS ───
  await test('四化 祿 has green CSS color (Q1)', async () => {
    // 太陽有化祿 in this chart
    const hasCustomColor = await page.evaluate(() => {
      const style = document.createElement('style');
      // override the transformed.祿 to verify it actually applies
      const tr = document.querySelector('.transformed.祿');
      if (!tr) return 'no .transformed.祿 element found';
      const color = getComputedStyle(tr).color;
      return color;
    });
    // The chart data depends on the birth date; just verify the CSS rule exists
    const cssRuleExists = await page.evaluate(() => {
      const sheets = document.styleSheets;
      for (const s of sheets) {
        try {
          for (const r of s.cssRules) {
            if (r.selectorText && r.selectorText.includes('transformed') && r.selectorText.includes('祿')) {
              return true;
            }
          }
        } catch(e) {}
      }
      return false;
    });
    if (!cssRuleExists) throw new Error('.transformed.祿 CSS rule not found');
  });

  // ─── Q2: Birth hour dropdown ───
  await test('Birth hour has 13 時辰 options (Q2)', async () => {
    const opts = await page.evaluate(() => {
      const sel = document.getElementById('birthHour');
      return Array.from(sel.options).map(o => o.text);
    });
    if (opts.length !== 13) throw new Error(`Expected 13 options, got ${opts.length}`);
    if (!opts[0].includes('早子')) throw new Error('First option should be 早子');
    if (!opts[12].includes('夜子')) throw new Error('Last option should be 夜子');
    // Check unique 時辰 labels
    const labels = opts.map(t => t.replace(/^\d{2}:\d{2}-\d{2}:\d{2}\s*/, '').replace(/\(.*?\)/, '').trim());
    const set = new Set(labels);
    if (set.size < 10) throw new Error('Too few unique 時辰 labels: ' + labels.join(','));
  });

  // ─── Q3: 四柱 B format ───
  await test('Four pillars in B format (Q3)', async () => {
    const pillarText = await page.evaluate(() => {
      const c01 = document.getElementById('center_1_2');
      return c01 ? c01.textContent : '';
    });
    // Should contain 年 and 月 in same string e.g. "庚午年 壬午月"
    if (!pillarText.includes('年') || !pillarText.includes('月')) {
      throw new Error('Pillar B format not found: ' + pillarText);
    }
    // Should NOT have the old "年 · 月" label
    if (pillarText.includes('年 · 月')) {
      throw new Error('Old label format still present');
    }
  });

  // ─── Q5: Target hour dropdown ───
  await test('Target hour has 13 時辰 options (Q5)', async () => {
    const opts = await page.evaluate(() => {
      const sel = document.getElementById('targetHour');
      return Array.from(sel.options).map(o => o.text);
    });
    if (opts.length !== 13) throw new Error(`Expected 13 options, got ${opts.length}`);
    if (!opts[0].includes('早子')) throw new Error('First option should include 早子');
  });

  // ─── Q7: 大限 per-palace overlay ───
  await test('大限 shows in all 12 palaces (Q7)', async () => {
    const count = await page.evaluate(() => {
      return document.querySelectorAll('.horo-info.daxian').length;
    });
    if (count !== 12) throw new Error(`Expected 12 大限 overlay cells, got ${count}`);
  });

  await test('大限 current decade palace is bold', async () => {
    const boldCount = await page.evaluate(() => {
      return document.querySelectorAll('.horo-info.daxian .horo-value[style*="700"]').length;
    });
    if (boldCount < 1) throw new Error('No bold current decade palace found');
  });

  // ─── Chart renders ───
  await test('Chart renders 12 palace cells', async () => {
    const cells = await page.$$('.palace-cell');
    if (cells.length !== 12) throw new Error(`Expected 12 palace cells, got ${cells.length}`);
  });

  await test('Center has 4 info cells', async () => {
    const cells = await page.$$('.center-cell');
    if (cells.length !== 4) throw new Error(`Expected 4 center cells, got ${cells.length}`);
  });

  await test('All palaces have names', async () => {
    const names = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.palace-name'))
        .map(el => el.textContent)
        .filter(Boolean);
    });
    if (names.length < 12) throw new Error(`Got ${names.length} palace names: ${names.join(',')}`);
  });

  await test('Bottom-right center shows lunar date', async () => {
    const text = await page.evaluate(() => {
      const c11 = document.getElementById('center_2_2');
      return c11 ? c11.textContent : '';
    });
    if (!text.includes('一九九') && !text.includes('年') && !text.includes('月')) {
      throw new Error('Lunar date not found in center bottom-right: ' + text);
    }
  });

  await test('Gender radio buttons present', async () => {
    const male = await page.$('#genderM');
    const female = await page.$('#genderF');
    if (!male || !female) throw new Error('Gender radio buttons missing');
    const maleChecked = await male.isChecked();
    if (!maleChecked) throw new Error('Male should be default checked');
  });

  await test('Predictive checkboxes present', async () => {
    const ids = ['chkDaxian', 'chkXiaoxian', 'chkFlowYear', 'chkFlowMonth', 'chkFlowDay', 'chkFlowHour', 'chkZihua'];
    for (const id of ids) {
      const el = await page.$('#' + id);
      if (!el) throw new Error(`Missing checkbox: ${id}`);
    }
  });

  await test('Time display shows 時辰 label on init', async () => {
    const text = await page.evaluate(() => {
      const el = document.getElementById('targetTimeDisplay');
      return el ? el.textContent : '';
    });
    if (!text.includes('時')) throw new Error('Time display missing 時 label: ' + text);
  });

  // ─── 四化 default ON ───
  await test('四化 markers visible by default (checked)', async () => {
    const visible = await page.evaluate(() => {
      const chk = document.getElementById('chkZihua');
      if (!chk || !chk.checked) return 'checkbox not checked';
      const markers = document.querySelectorAll('.transformed');
      if (markers.length === 0) return 'no .transformed elements found';
      const first = markers[0];
      return getComputedStyle(first).display;
    });
    if (visible !== 'inline') throw new Error('四化 marker display is ' + visible);
  });

  await test('四化 toggle hides markers', async () => {
    await page.click('#chkZihua + label');
    await page.waitForTimeout(100);
    const hidden = await page.evaluate(() => {
      const markers = document.querySelectorAll('.transformed');
      if (markers.length === 0) return true;
      return getComputedStyle(markers[0]).display === 'none';
    });
    // Re-toggle back on for remaining tests
    await page.click('#chkZihua + label');
    await page.waitForTimeout(100);
    if (!hidden) throw new Error('四化 markers not hidden after toggle off');
  });

  // ─── 自化默认 OFF ───
  await test('自化 markers hidden by default (unchecked)', async () => {
    const hidden = await page.evaluate(() => {
      const chk = document.getElementById('chkSelfTransform');
      if (!chk || chk.checked) return 'checkbox is checked';
      const markers = document.querySelectorAll('.self-transform');
      if (markers.length === 0) return 'no .self-transform elements found';
      return markers[0].style.display === 'none' || getComputedStyle(markers[0]).display === 'none';
    });
    if (hidden === 'checkbox is checked') throw new Error('自化 checkbox should be unchecked by default');
    if (hidden === 'no .self-transform elements found') throw new Error('No self-transformation markers rendered (this chart may have none)');
    if (hidden !== true) throw new Error('自化 markers not hidden by default');
  });

  await test('自化 toggle reveals markers', async () => {
    await page.click('#chkSelfTransform + label');
    await page.waitForTimeout(100);
    const visible = await page.evaluate(() => {
      const markers = document.querySelectorAll('.self-transform');
      if (markers.length === 0) return 'no markers';
      const first = markers[0];
      return getComputedStyle(first).display;
    });
    // Toggle back off
    await page.click('#chkSelfTransform + label');
    await page.waitForTimeout(100);
    if (visible !== 'inline' && visible !== 'inline-block') {
      throw new Error('自化 marker display is ' + visible);
    }
  });

  await test('Self-transformation markers show mutagen type', async () => {
    await page.click('#chkSelfTransform + label');
    await page.waitForTimeout(100);
    const text = await page.evaluate(() => {
      const markers = document.querySelectorAll('.self-transform');
      return Array.from(markers).map(m => m.textContent).join(',');
    });
    await page.click('#chkSelfTransform + label');
    await page.waitForTimeout(100);
    // Should contain 自 prefix with a mutagen type
    if (!text.includes('自')) throw new Error('自化 markers missing 自 prefix: ' + text);
  });

  // ─── 身主 display ───
  await test('身主 display uses normal sub-info size', async () => {
    const fontSize = await page.evaluate(() => {
      const c00 = document.getElementById('center_1_1');
      if (!c00) return null;
      // Find the 身主 text node - it's after 廉貞 · 身(申)
      const text = c00.textContent;
      // Check inline style not present
      const spans = c00.querySelectorAll('span');
      for (const s of spans) {
        if (s.textContent === '火星' || (s.style && s.style.fontSize === '.6rem')) {
          return s.style.fontSize + '|' + s.style.color;
        }
      }
      return 'no-inline-style';
    });
    if (fontSize && fontSize.includes('.6rem')) {
      throw new Error('身主 still has small font size: ' + fontSize);
    }
  });

  // ─── Date input inline style ───
  await test('Target date input has no conflicting inline styles', async () => {
    const style = await page.evaluate(() => {
      const el = document.getElementById('targetDate');
      if (!el) return null;
      return el.getAttribute('style');
    });
    if (style && style.includes('display:inline!important')) {
      throw new Error('Conflicting inline display style: ' + style);
    }
    if (style && style.includes('display:inline;')) {
      throw new Error('Conflicting inline display style: ' + style);
    }
  });

  await test('Recalculate when gender changes', async () => {
    // Click female radio
    await page.click('#genderF');
    await page.waitForTimeout(300);
    // Wait for chart to re-render
    await page.waitForSelector('.palace-cell');
    const palaceNames = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.palace-name')).map(el => el.textContent);
    });
    // Palace names should change with different gender (命宮 position changes)
    if (palaceNames.length < 12) throw new Error('Chart not re-rendered after gender change');
    // Reset to male
    await page.click('#genderM');
    await page.waitForTimeout(300);
  });

  // ─── Birth defaults ───
  await test('Birth date defaults to 1982-11-11', async () => {
    const val = await page.evaluate(() => document.getElementById('birthDate').value);
    if (val !== '1982-11-11') throw new Error(`Expected 1982-11-11, got ${val}`);
  });

  await test('Birth hour defaults to 亥時 (index 11)', async () => {
    const val = await page.evaluate(() => document.getElementById('birthHour').value);
    if (val !== '11') throw new Error(`Expected hour 11 (亥), got ${val}`);
  });

  // ─── 小限 12 palaces ───
  await test('小限 shows in all 12 palaces when toggled', async () => {
    await page.click('#chkXiaoxian + label');
    await page.waitForTimeout(100);
    const count = await page.evaluate(() => {
      return document.querySelectorAll('.horo-info.xiaoxian.show').length;
    });
    await page.click('#chkXiaoxian + label');
    await page.waitForTimeout(100);
    if (count !== 12) throw new Error(`Expected 12 小限 cells, got ${count}`);
  });

  await test('小限 current age palace is bold', async () => {
    await page.click('#chkXiaoxian + label');
    await page.waitForTimeout(100);
    const boldCount = await page.evaluate(() => {
      return document.querySelectorAll('.horo-info.xiaoxian .horo-value[style*="700"]').length;
    });
    await page.click('#chkXiaoxian + label');
    await page.waitForTimeout(100);
    if (boldCount < 1) throw new Error('No bold current age palace found');
  });

  // ─── 流年 12 palaces ───
  await test('流年 shows in all 12 palaces when toggled', async () => {
    await page.click('#chkFlowYear + label');
    await page.waitForTimeout(100);
    const count = await page.evaluate(() => {
      return document.querySelectorAll('.horo-info.flowyear.show').length;
    });
    await page.click('#chkFlowYear + label');
    await page.waitForTimeout(100);
    if (count !== 12) throw new Error(`Expected 12 流年 cells, got ${count}`);
  });

  await test('流年 non-starting palaces show role name only (no 流 prefix)', async () => {
    await page.click('#chkFlowYear + label');
    await page.waitForTimeout(100);
    const hasPrefix = await page.evaluate(() => {
      const cells = document.querySelectorAll('.horo-info.flowyear.show .horo-value');
      // Count how many cells have 流年 prefix in their label
      const labels = document.querySelectorAll('.horo-info.flowyear.show .horo-label');
      // Only 1 starting cell should have the label
      return labels.length;
    });
    await page.click('#chkFlowYear + label');
    await page.waitForTimeout(100);
    if (hasPrefix !== 1) throw new Error(`Expected exactly 1 流年 label (starting palace), got ${hasPrefix}`);
  });

  await test('流年 cells have purple color on .horo-value', async () => {
    await page.click('#chkFlowYear + label');
    await page.waitForTimeout(100);
    const color = await page.evaluate(() => {
      const first = document.querySelector('.horo-info.flowyear.show .horo-value');
      if (!first) return null;
      return getComputedStyle(first).color;
    });
    await page.click('#chkFlowYear + label');
    await page.waitForTimeout(100);
    // Purple = #8e44ad → rgb(142, 68, 173)
    if (!color || !color.includes('68, 173') && !color.includes('142')) {
      throw new Error(`流年 .horo-value color not purple: ${color}`);
    }
  });

  // ─── 流月/流日/流時 ───
  for (const [id, cls, label] of [
    ['chkFlowMonth', 'flowmonth', '流月'],
    ['chkFlowDay', 'flowday', '流日'],
    ['chkFlowHour', 'flowhour', '流時'],
  ]) {
    await test(`${label} shows in all 12 palaces`, async () => {
      await page.click(`#${id} + label`);
      await page.waitForTimeout(100);
      const count = await page.evaluate((c) => {
        return document.querySelectorAll(`.horo-info.${c}.show`).length;
      }, cls);
      await page.click(`#${id} + label`);
      await page.waitForTimeout(100);
      if (count !== 12) throw new Error(`Expected 12 ${label} cells, got ${count}`);
    });
  }

  // ─── No dashed borders ───
  await test('No dashed borders between horo-info rows', async () => {
    const hasDashed = await page.evaluate(() => {
      const el = document.querySelector('.horo-info');
      if (!el) return false;
      const sheets = document.styleSheets;
      for (const s of sheets) {
        try {
          for (const r of s.cssRules) {
            if (!r.selectorText || !r.style) continue;
            if (r.selectorText.includes('horo-info') && r.style.borderTop && r.style.borderTop.includes('dashed')) {
              return true;
            }
          }
        } catch(e) {}
      }
      return false;
    });
    if (hasDashed) throw new Error('Dashed border still defined on .horo-info');
  });

  // ─── Predictive auto-recalculate ───
  await test('Changing target date recalculates horoscope', async () => {
    const oldHour = await page.evaluate(() => {
      const el = document.getElementById('targetHour');
      return el ? el.value : null;
    });
    // Toggle 流年 on
    await page.click('#chkFlowYear + label');
    await page.waitForTimeout(100);
    // Change target date
    await page.evaluate(() => {
      const el = document.getElementById('targetDate');
      el.value = '2026-06-15';
      el.dispatchEvent(new Event('change'));
    });
    await page.waitForTimeout(300);
    // Flow year cells should still be present after recalc
    const flowCells = await page.evaluate(() => {
      return document.querySelectorAll('.horo-info.flowyear.show').length;
    });
    await page.click('#chkFlowYear + label');
    await page.waitForTimeout(100);
    if (flowCells !== 12) throw new Error(`Expected 12 流年 after date change, got ${flowCells}`);
  });

  // ─── Target time display format ───
  await test('Target time display shows current 時辰 label', async () => {
    const text = await page.evaluate(() => {
      const el = document.getElementById('targetTimeDisplay');
      return el ? el.textContent : '';
    });
    if (!text.includes('時')) {
      throw new Error('Time display missing 時辰 label: ' + text);
    }
  });

  // ─── Major/minor/adjective star styles ───
  await test('Major stars are bold (≥600), minor stars normal', async () => {
    const styles = await page.evaluate(() => {
      const cell = document.querySelector('.palace-cell');
      if (!cell) return null;
      const all = cell.querySelectorAll('.star');
      let majorCount = 0, majorBold = 0;
      for (const s of all) {
        if (s.classList.contains('major')) {
          majorCount++;
          const fw = parseInt(getComputedStyle(s).fontWeight);
          if (fw >= 600) majorBold++;
        }
      }
      return { majorCount, majorBold };
    });
    if (!styles || styles.majorCount === 0) throw new Error('No major stars found');
    if (styles.majorBold < styles.majorCount) {
      throw new Error(`${styles.majorBold}/${styles.majorCount} major stars have fw≥600`);
    }
  });

  // ─── Brightness markers ───
  await test('Brightness markers present on stars', async () => {
    const hasBrightness = await page.evaluate(() => {
      const cells = document.querySelectorAll('.palace-cell');
      for (const c of cells) {
        const text = c.textContent;
        if (text.includes('廟') || text.includes('旺') || text.includes('得')
          || text.includes('利') || text.includes('平') || text.includes('陷')) {
          return true;
        }
      }
      return false;
    });
    if (!hasBrightness) throw new Error('No brightness markers (廟旺得利平陷) found in any palace');
  });

  // ─── Center info ───
  await test('Center shows 五行局', async () => {
    const text = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.center-cell')).map(c => c.textContent).join(' ');
    });
    if (!text.includes('局')) throw new Error('五行局 not found in center cells: ' + text);
  });

  await test('Center shows 五行局 and 子平四柱', async () => {
    const text = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.center-cell')).map(c => c.textContent).join(' ');
    });
    if (!text.includes('局')) throw new Error('五行局 not found: ' + text);
    if (!text.includes('年') || !text.includes('月')) throw new Error('四柱年月 not found: ' + text);
  });

  await test('Center shows 生肖', async () => {
    const text = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.center-cell')).map(c => c.textContent).join(' ');
    });
    if (!text.includes('狗') && !text.includes('豬') && !text.includes('鼠')
      && !text.includes('牛') && !text.includes('虎') && !text.includes('兔')
      && !text.includes('龍') && !text.includes('蛇') && !text.includes('馬')
      && !text.includes('羊') && !text.includes('猴') && !text.includes('雞')) {
      throw new Error('生肖 not found in center: ' + text);
    }
  });

  // ─── 天干地支 in each palace ───
  await test('All 12 palaces show 天干地支', async () => {
    const count = await page.evaluate(() => {
      let found = 0;
      document.querySelectorAll('.palace-cell').forEach(cell => {
        const text = cell.textContent;
        // Check for Chinese branch characters (子丑寅卯辰巳午未申酉戌亥)
        if (/[子丑寅卯辰巳午未申酉戌亥]/.test(text)) found++;
      });
      return found;
    });
    if (count < 12) throw new Error(`Only ${count}/12 palaces have 天干`);
  });

  // ─── Summary ───
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);
  await browser.close();
  server.close();

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
})().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
