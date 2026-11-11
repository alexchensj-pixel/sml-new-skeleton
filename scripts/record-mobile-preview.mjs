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
await page.locator('#entrenamiento').scrollIntoViewIfNeeded();
await page.locator('.pricing-tabs').waitFor({ state: 'visible', timeout: 30000 });
await page.waitForTimeout(1200);

const title = await page.locator('.pricing-title').innerText();
if (!title.includes('Entrenamiento diseñado')) throw new Error(`Unexpected pricing title: ${title}`);
if ((await page.locator('.pricing-social').innerText()).trim() !== '5,0 ★ · 18 reseñas') throw new Error('Social proof line is missing or incorrect');
if ((await page.getByRole('tab', { name: /1:1/ }).getAttribute('aria-selected')) !== 'true') throw new Error('1:1 is not selected by default');
for (const expected of ['27,50 € / sesión', '23,13 € / sesión', '22,50 € / sesión']) {
  if (!(await page.locator('.plan-card-per-session').allInnerTexts()).some((value) => value.includes(expected))) throw new Error(`Missing unit price: ${expected}`);
}
if (await page.locator('.plan-card-action svg').count() !== 3) throw new Error('Plan CTA SVG icons are missing');
if ((await page.locator('.plan-card-action').allInnerTexts()).some((value) => value.includes('↗'))) throw new Error('Emoji arrow remains in a plan CTA');
await page.waitForTimeout(700);
await page.getByRole('tab', { name: /Parejas/ }).click();
await page.waitForTimeout(900);
if (!(await page.locator('.pricing-tab-panel').innerText()).includes('20 €')) throw new Error('Couples price is not shown in its tab');
await page.getByRole('tab', { name: /Grupos reducidos/ }).click();
await page.waitForTimeout(900);
const groupText = await page.locator('.pricing-tab-panel').innerText();
if (!groupText.includes('15 €') || !groupText.includes('55 €') || !groupText.includes('95 €')) throw new Error('Group price or bonuses are missing');
await page.getByRole('tab', { name: /1:1/ }).click();
await page.waitForTimeout(900);
await page.getByRole('button', { name: /Comparar qué incluye cada plan/ }).click();
if (!(await page.locator('#plan-comparison').isVisible())) throw new Error('Plan comparison does not expand');
await page.screenshot({ path: 'artifacts/pricing-mobile.png' });
if (errors.length) throw new Error(`Browser runtime errors: ${errors.join(' | ')}`);
const video = page.video();
await context.close();
if (video) fs.copyFileSync(await video.path(), 'artifacts/pricing-mobile.webm');
await browser.close();
console.log('MOBILE_PRICING_CHECK_OK', JSON.stringify({ title, viewport: '393x852', groupText: groupText.slice(0, 180), screenshot: 'artifacts/pricing-mobile.png', video: 'artifacts/pricing-mobile.webm' }));
