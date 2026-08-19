const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const draftPath = path.resolve(__dirname, 'draft', 'index.html');
  const url = 'file:///' + draftPath.split(path.sep).join('/');

  console.log('Capturing draft:', url);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.evaluate(() => {
    var loader = document.getElementById('loader');
    if (loader) loader.classList.add('loaded');
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('revealed'); });
  });
  await new Promise(function(r) { setTimeout(r, 1000); });

  await page.screenshot({
    path: path.join(__dirname, 'DeepTrail_draft.png'),
    fullPage: true
  });
  console.log('Done! -> DeepTrail_draft.png');

  await browser.close();
})();
