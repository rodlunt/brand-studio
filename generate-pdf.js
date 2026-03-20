const { chromium } = require('playwright');

const URL = 'http://localhost:3000';
const DIR = './screenshots';
const VIEWPORT = { width: 1440, height: 900 };

const BRAND = {
  name: 'FlowRight Plumbing',
  industry: 'Residential & commercial plumbing services',
  desc: 'FlowRight Plumbing provides same-day emergency repairs, bathroom renovations, and gas fitting across Sydney — licensed, insured, and guaranteed. No call-out fee, upfront pricing, and a lifetime warranty on all workmanship.',
  audience: 'Sydney homeowners aged 28-65, often searching in a panic (burst pipe, blocked drain), price-sensitive but value reliability. Commercial property managers who need a trusted ongoing contractor.',
  personality: ['Reliable', 'Straight-talking', 'Professional', 'Friendly'],
  competitors: ['Plumber Near Me', 'Sydney Emergency Plumbing', 'Nu-Trend'],
  avoid: 'Cheap clip-art pipes and wrenches, blue-everything, cartoon mascots, anything that looks like a Yellow Pages ad from 2005',
  vdir: 'Bold & Strong'
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto(URL, { waitUntil: 'networkidle' });

  async function goStep(n) {
    await page.click(`.si[data-n="${n}"]`);
    await page.waitForTimeout(300);
  }

  async function waitForGeneration(outId, timeout = 120000) {
    await page.waitForFunction(
      (id) => {
        const el = document.getElementById(id);
        return el && !el.querySelector('.ld') && !el.textContent.includes('will appear here');
      },
      outId,
      { timeout }
    );
    await page.waitForTimeout(500);
  }

  console.log('\n  Generating all content for PDF...\n');

  // Fill brief
  await page.fill('#b-name', BRAND.name);
  await page.fill('#b-industry', BRAND.industry);
  await page.fill('#b-desc', BRAND.desc);
  await page.fill('#b-audience', BRAND.audience);
  for (const tag of BRAND.personality) { await page.fill('#ti-personality', tag); await page.press('#ti-personality', 'Enter'); }
  for (const tag of BRAND.competitors) { await page.fill('#ti-competitors', tag); await page.press('#ti-competitors', 'Enter'); }
  await page.fill('#b-avoid', BRAND.avoid);
  await page.click(`.sc[data-v="${BRAND.vdir}"]`);
  await page.click('#btn-next');
  await page.waitForTimeout(300);

  // Generate all steps
  console.log('  ⏳ Name analysis...');
  await page.click('#btn-naming');
  await waitForGeneration('out-naming');

  await goStep(3);
  console.log('  ⏳ Strategy...');
  await page.click('#btn-strategy');
  await waitForGeneration('out-strategy');

  await goStep(4);
  console.log('  ⏳ Voice & copy...');
  await page.click('#btn-voice');
  await waitForGeneration('out-voice');

  await goStep(5);
  console.log('  ⏳ Color system...');
  await page.click('#btn-color');
  await waitForGeneration('out-color');

  await goStep(6);
  console.log('  ⏳ Typography...');
  await page.click('#btn-type');
  await waitForGeneration('out-type');

  await goStep(7);
  await page.fill('#logo-notes', 'Brand name is one word: FlowRight. The mark should suggest water flow or pipes without being a cliché wrench icon.');
  console.log('  ⏳ Logo brief...');
  await page.click('#btn-logo');
  await waitForGeneration('out-logo');

  await goStep(8);
  console.log('  ⏳ UI tokens...');
  await page.click('#btn-tokens');
  await waitForGeneration('out-tokens');

  // Build guide and export PDF
  await goStep(10);
  console.log('  ⏳ Building brand guide...');
  await page.click('text=Build Brand Guide');
  await page.waitForTimeout(1500);

  console.log('  ⏳ Exporting PDF...');
  // Click the Download PDF button and wait for download
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 120000 }),
    page.click('text=Download PDF')
  ]);

  const filePath = `${DIR}/flowright-plumbing-brand-guide.pdf`;
  await download.saveAs(filePath);
  console.log(`  ✓ PDF saved to ${filePath}`);

  await browser.close();
  console.log('\n  Done!\n');
})();
