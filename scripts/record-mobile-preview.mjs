import fs from 'node:fs';
import { chromium } from 'playwright';

const baseUrl = 'https://integration-current-site--sml-new-skeleton.netlify.app/';
fs.mkdirSync('artifacts/mobile-video', { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  recordVideo: { dir: 'artifacts/mobile-video', size: { width: 393, height: 852 } },
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.locator('#entrenamiento').waitFor({ state: 'attached', timeout: 30000 });
await page.evaluate(() => {
  const el = document.querySelector('#entrenamiento');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 88);
});
await page.locator('.pricing-tabs').waitFor({ state: 'visible', timeout: 30000 });
await page.waitForTimeout(1000);

const title = await page.locator('.pricing-title').innerText();
if (!title.includes('Entrenamiento diseñado')) throw new Error(`Unexpected pricing title: ${title}`);
if ((await page.locator('.pricing-social').innerText()).trim() !== '5,0 ★ · 18 reseñas') throw new Error('Social proof line is missing or incorrect');
if ((await page.getByRole('tab', { name: /1:1/ }).getAttribute('aria-selected')) !== 'true') throw new Error('1:1 is not selected by default');
for (const expected of ['27,50 € / sesión', '23,13 € / sesión', '22,50 € / sesión']) {
  if (!(await page.locator('.plan-card-per-session').allInnerTexts()).some((value) => value.includes(expected))) throw new Error(`Missing unit price: ${expected}`);
}
if (await page.locator('.plan-card-action svg').count() !== 3) throw new Error('Plan CTA SVG icons are missing');
if ((await page.locator('.plan-card-action').allInnerTexts()).some((value) => value.includes('↗'))) throw new Error('Emoji arrow remains in a plan CTA');
await page.screenshot({ path: 'artifacts/pricing-mobile-top.png' });
for (const [selector, name] of [['.plan-card-arsenal','arsenal'],['.plan-card-striker','striker'],['.plan-card-fight-iq','fight-iq']]) {
  const card = page.locator(selector);
  await card.waitFor({ state: 'visible' });
  await card.screenshot({ path: `artifacts/${name}-card.png` });
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
}
await page.getByRole('tab', { name: /Parejas/ }).click();
await page.waitForTimeout(750);
if (!(await page.locator('.pricing-tab-panel').innerText()).includes('20 €')) throw new Error('Couples price is not shown in its tab');
await page.screenshot({ path: 'artifacts/pricing-mobile-couples.png' });
await page.getByRole('tab', { name: /Grupos reducidos/ }).click();
await page.waitForTimeout(750);
const groupText = await page.locator('.pricing-tab-panel').innerText();
if (!groupText.includes('15 €') || !groupText.includes('55 €') || !groupText.includes('95 €')) throw new Error('Group price or bonuses are missing');
await page.screenshot({ path: 'artifacts/pricing-mobile-groups.png' });
await page.getByRole('tab', { name: /1:1/ }).click();
await page.waitForTimeout(750);
await page.getByRole('button', { name: /Comparar qué incluye cada plan/ }).click();
if (!(await page.locator('#plan-comparison').isVisible())) throw new Error('Plan comparison does not expand');
await page.screenshot({ path: 'artifacts/pricing-mobile-comparison.png' });
if (errors.length) throw new Error(`Browser runtime errors: ${errors.join(' | ')}`);
const video = page.video();
await context.close();
if (video) fs.copyFileSync(await video.path(), 'artifacts/pricing-mobile.webm');
await browser.close();
console.log('MOBILE_PRICING_CHECK_OK', JSON.stringify({ title, viewport: '393x852', groupText: groupText.slice(0, 180), screenshots: 'top, arsenal, striker, fight-iq, couples, groups, comparison', video: 'artifacts/pricing-mobile.webm' }));
