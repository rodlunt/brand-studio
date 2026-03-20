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

  async function snap(name, delay = 500) {
    await page.waitForTimeout(delay);
    await page.screenshot({ path: `${DIR}/${name}.png`, fullPage: false });
    console.log(`  ✓ ${name}`);
  }

  async function snapFull(name, delay = 500) {
    await page.waitForTimeout(delay);
    // Scroll to top first
    await page.evaluate(() => document.getElementById('content').scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${DIR}/${name}.png`, fullPage: false });
    console.log(`  ✓ ${name}`);
  }

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

  console.log('\n  Taking screenshots with generated content...\n');

  // ── Step 1: Fill Brief ──
  await page.fill('#b-name', BRAND.name);
  await page.fill('#b-industry', BRAND.industry);
  await page.fill('#b-desc', BRAND.desc);
  await page.fill('#b-audience', BRAND.audience);
  for (const tag of BRAND.personality) {
    await page.fill('#ti-personality', tag);
    await page.press('#ti-personality', 'Enter');
  }
  for (const tag of BRAND.competitors) {
    await page.fill('#ti-competitors', tag);
    await page.press('#ti-competitors', 'Enter');
  }
  await page.fill('#b-avoid', BRAND.avoid);
  await page.click(`.sc[data-v="${BRAND.vdir}"]`);
  await snapFull('01-brief-filled');

  // Save brief and go to step 2
  await page.click('#btn-next');
  await page.waitForTimeout(300);

  // ── Step 2: Name Analysis — Generate ──
  console.log('  ⏳ Generating name analysis...');
  await page.click('#btn-naming');
  await waitForGeneration('out-naming');
  await snapFull('02-name-analysis');

  // ── Step 3: Strategy — Generate ──
  await goStep(3);
  console.log('  ⏳ Generating strategy...');
  await page.click('#btn-strategy');
  await waitForGeneration('out-strategy');
  await snapFull('03-strategy');

  // ── Step 4: Voice & Copy — Generate ──
  await goStep(4);
  console.log('  ⏳ Generating voice & copy...');
  await page.click('#btn-voice');
  await waitForGeneration('out-voice');
  await snapFull('04-voice-copy');

  // ── Step 5: Color System ──
  await goStep(5);
  // Click "Help me choose a color"
  console.log('  ⏳ Getting color guidance...');
  await page.click('text=Help me choose a color');
  await page.waitForFunction(
    () => {
      const el = document.getElementById('out-color-guidance');
      return el && el.innerHTML.length > 100 && !el.querySelector('.ld');
    },
    null,
    { timeout: 60000 }
  );
  await page.waitForTimeout(500);
  await snapFull('05-color-guidance');

  // Generate full color system
  console.log('  ⏳ Generating color system...');
  await page.click('#btn-color');
  await waitForGeneration('out-color');
  await snapFull('06-color-system');

  // ── Step 6: Typography & Grid — Generate ──
  await goStep(6);
  console.log('  ⏳ Generating typography...');
  await page.click('#btn-type');
  await waitForGeneration('out-type');
  await snapFull('07-typography');

  // ── Step 7: Logo Brief — Generate ──
  await goStep(7);
  await page.fill('#logo-notes', 'Brand name is one word: FlowRight. The mark should suggest water flow or pipes without being a cliché wrench icon. Should feel premium trade, not DIY.');
  console.log('  ⏳ Generating logo brief...');
  await page.click('#btn-logo');
  await waitForGeneration('out-logo');
  await snapFull('08-logo-brief');

  // Scroll down to see more of the brief
  await page.evaluate(() => document.getElementById('content').scrollBy(0, 500));
  await page.waitForTimeout(300);
  await snap('09-logo-brief-detail');

  // ── Step 8: UI Tokens — Generate ──
  await goStep(8);
  console.log('  ⏳ Generating UI tokens...');
  await page.click('#btn-tokens');
  await waitForGeneration('out-tokens');
  await snapFull('10-ui-tokens');

  // ── Step 9: Assets ──
  await goStep(9);
  await snapFull('11-assets');

  // ── Step 10: Brand Guide — Build ──
  await goStep(10);
  await page.click('text=Build Brand Guide');
  await page.waitForTimeout(1000);
  await snapFull('12-brand-guide-cover');

  // Scroll through the guide
  await page.evaluate(() => document.getElementById('content').scrollBy(0, 600));
  await page.waitForTimeout(300);
  await snap('13-brand-guide-strategy');

  await page.evaluate(() => document.getElementById('content').scrollBy(0, 600));
  await page.waitForTimeout(300);
  await snap('14-brand-guide-color');

  // ── Settings modal ──
  await page.click('button[title="API Key Settings"]');
  await page.waitForTimeout(300);
  await snap('15-settings');
  await page.click('text=Cancel');

  // ── Project menu ──
  await page.click('.proj-trigger');
  await page.waitForTimeout(300);
  await snap('16-project-menu');

  await browser.close();
  console.log(`\n  Done — ${DIR}/\n`);
})();
