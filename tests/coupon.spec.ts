import { test, expect } from '@playwright/test';

test('aplicar cupom válido e frete grátis quando subtotal atinge o limite', async ({ page }) => {
  await page.goto('/');

  const jacket = page.locator('article').filter({ hasText: 'Jaqueta Corta-Vento' });
  await jacket.getByRole('button', { name: 'Adicionar ao carrinho' }).click();

  await page.getByRole('link', { name: /Carrinho/i }).click();
  const couponInput = page.getByLabel('Cupom de desconto');
  await couponInput.fill('BEMVINDO10');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();

  await expect(page.getByText(/Cupom .*aplicado/i)).toBeVisible();
  await expect(page.getByText('R$ 206,91')).toBeVisible();
  await expect(page.getByText('Grátis')).toBeVisible();

  await page.screenshot({ path: 'evidence/positivos/cupom.png', fullPage: true });
});

test('remover o cupom atual antes de aplicar outro', async ({ page }) => {
  await page.goto('/');

  const product = page.locator('article').filter({ hasText: 'Mochila Urbana 20L' });
  await product.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.getByRole('link', { name: /Carrinho/i }).click();

  await page.getByLabel('Cupom de desconto').fill('BEMVINDO10');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
  await expect(page.getByRole('button', { name: 'Remover cupom' })).toBeVisible();
  await expect(page.getByLabel('Cupom de desconto')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Aplicar cupom' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Remover cupom' }).click();
  await page.getByLabel('Cupom de desconto').fill('VERAO2026');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();

  await expect(page.getByRole('alert')).toHaveText('Cupom expirado.');
  await expect(page.getByRole('region', { name: 'Resumo do pedido' })).toContainText('R$ 0,00');
});
