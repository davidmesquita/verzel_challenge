import { test, expect } from '@playwright/test';

async function openCartWithProduct(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.locator('article').first().getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.getByRole('link', { name: /Carrinho/i }).click();
}

test('capturar rejeição de cupom inválido', async ({ page }) => {
  await openCartWithProduct(page);

  await page.getByLabel('Cupom de desconto').fill('INVALIDO');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
  await expect(page.getByText(/Cupom inválido/i)).toBeVisible();

  await page.screenshot({ path: 'evidence/negativos/cupom-invalido.png', fullPage: true });
});

test('capturar rejeição de cupom expirado', async ({ page }) => {
  await openCartWithProduct(page);

  await page.getByLabel('Cupom de desconto').fill('VERAO2026');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
  await expect(page.getByText(/Cupom expirado/i)).toBeVisible();

  await page.screenshot({ path: 'evidence/negativos/cupom-expirado.png', fullPage: true });
});

test('capturar validação de CEP inválido', async ({ page }) => {
  await page.goto('/');
  await page.locator('article').first().getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.getByRole('link', { name: /Carrinho/i }).click();
  await page.getByRole('link', { name: 'Finalizar compra' }).click();

  await page.getByLabel('Nome completo').fill('Maria Silva');
  await page.getByLabel('E-mail').fill('maria@exemplo.com');
  await page.getByLabel('CEP').fill('ABC');
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(page.getByText(/CEP com 8 dígitos/i)).toBeVisible();

  await page.screenshot({ path: 'evidence/negativos/cep-invalido.png', fullPage: true });
});