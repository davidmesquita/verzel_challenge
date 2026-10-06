import { test, expect } from '@playwright/test';

test('confirmar pedido com dados válidos', async ({ page }) => {
  await page.goto('/');

  const product = page.locator('article').filter({ hasText: 'Mochila Urbana 20L' });
  await product.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.getByRole('link', { name: /Carrinho/i }).click();
  await page.getByRole('link', { name: 'Finalizar compra' }).click();

  await page.getByLabel('Nome completo').fill('Maria Silva');
  await page.getByLabel('E-mail').fill('maria@exemplo.com');
  await page.getByLabel('CEP').fill('01310-100');

  await page.getByRole('button', { name: 'Confirmar pedido' }).click();

  await expect(page.locator('.confirmacao-selo')).toHaveText(/Pedido confirmado/);
  await expect(page.locator('.numero-pedido')).toHaveText(/VZ-\d+/);

  await page.screenshot({ path: 'evidence/positivos/checkout.png', fullPage: true });
});

