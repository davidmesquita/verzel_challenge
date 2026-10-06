import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/');
await page.getByRole('button', { name: 'Adicionar ao carrinho' }).first().click();
await page.getByRole('link', { name: /Carrinho/i }).click();
console.log(await page.locator('body').innerText());
await page.screenshot({ path: './evidence/manual-cart.png', fullPage: true });
await browser.close();
