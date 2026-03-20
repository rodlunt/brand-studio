const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Fill brief with example data so it looks populated
  await page.fill('#b-name', 'FlowRight Plumbing');
  await page.fill('#b-industry', 'Residential & commercial plumbing');
  await page.fill('#b-desc', 'Same-day emergency repairs, bathroom renovations, and gas fitting across Sydney.');
  for (const tag of ['Reliable', 'Straight-talking', 'Professional']) {
    await page.fill('#ti-personality', tag);
    await page.press('#ti-personality', 'Enter');
  }
  await page.click('.sc[data-v="Bold & Strong"]');

  await page.waitForTimeout(500);
  await page.screenshot({ path: './screenshots/social-preview.png', fullPage: false });
  console.log('  ✓ social-preview.png (1280x640)');

  await browser.close();
})();
