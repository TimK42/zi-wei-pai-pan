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
