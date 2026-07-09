const { chromium } = require('playwright');
const { createServer } = require('http');
const { readFileSync } = require('fs');
const { join, basename } = require('path');

const PORT = 18766;
const PAGES = ['index.html', 'about.html', 'contact.html', 'privacy-policy.html', '404.html'];
const REQUIRED_META = [
  { name: 'theme-color', content: '#D9D2BC' },
  { name: 'apple-mobile-web-app-capable', content: 'yes' },
  { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
];

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    return true;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    return false;
  }
}

(async () => {
  let passed = 0, failed = 0;

  const testFn = async (name, fn) => {
    try { await fn(); passed++; console.log(`  ✅ ${name}`); }
    catch (e) { failed++; console.log(`  ❌ ${name}: ${e.message}`); }
  };

  // Serve all HTML pages
  const serverPromise = new Promise(resolve => {
    const srv = createServer((req, res) => {
      const path = req.url === '/' ? '/index.html' : req.url;
      const fullPath = join(__dirname, '..', path);
      try {
        const html = readFileSync(fullPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      } catch {
        res.writeHead(404);
        res.end('Not Found');
      }
    });
    srv.listen(PORT, () => resolve(srv));
  });
  const server = await serverPromise;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  console.log('\n🧪 Meta Tags Integration Tests\n');

  for (const htmlFile of PAGES) {
    await page.goto(`http://127.0.0.1:${PORT}/${htmlFile}`, { waitUntil: 'domcontentloaded' });

    await testFn(`${htmlFile}: theme-color meta tag present`, async () => {
      const val = await page.evaluate(() => document.querySelector('meta[name="theme-color"]')?.content);
      if (val !== '#D9D2BC') throw new Error(`theme-color content is "${val}", expected "#D9D2BC"`);
    });

    await testFn(`${htmlFile}: apple-mobile-web-app-capable`, async () => {
      const val = await page.evaluate(() => document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.content);
      if (val !== 'yes') throw new Error(`apple-mobile-web-app-capable="${val}"`);
    });

    await testFn(`${htmlFile}: apple-mobile-web-app-status-bar-style`, async () => {
      const val = await page.evaluate(() => document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.content);
      if (val !== 'black-translucent') throw new Error(`status-bar-style="${val}"`);
    });

    await testFn(`${htmlFile}: apple-touch-icon link`, async () => {
      const href = await page.evaluate(() => document.querySelector('link[rel="apple-touch-icon"]')?.href);
      if (!href || !href.includes('icon-192.png')) throw new Error(`apple-touch-icon href="${href}"`);
    });
  }

  // Verify icon files exist and are valid PNGs (read directly from disk)
  for (const iconFile of ['apple-touch-icon.png', 'icon-192.png']) {
    await testFn(`${iconFile}: binary file is valid PNG`, async () => {
      const buf = readFileSync(join(__dirname, '..', iconFile));
      if (buf.length < 30) throw new Error(`File too small: ${buf.length} bytes`);
      const sig = buf.slice(0, 4).toString('hex');
      if (sig !== '89504e47') throw new Error(`Not a valid PNG: signature ${sig}`);
    });
  }

  await browser.close();
  server.close();

  console.log(`\n📊 Meta Tags Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);
  process.exit(failed > 0 ? 1 : 0);
})().catch(err => { console.error('Error:', err); process.exit(1); });
