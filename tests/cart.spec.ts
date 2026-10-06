import { test, expect } from '@playwright/test';

test('adicionar item ao carrinho e respeitar limite de 5 unidades', async ({ page }) => {
  await page.goto('/');

  const firstProduct = page.locator('article').first();
  await firstProduct.getByRole('button', { name: 'Adicionar ao carrinho' }).click();

  await page.getByRole('link', { name: /Carrinho/i }).click();
  await expect(page.getByRole('heading', { name: 'Carrinho' })).toBeVisible();

  const quantity = page.getByRole('status', { name: /Quantidade de/i });
  await expect(quantity).toHaveText('1');

  const increaseButton = page.getByRole('button', { name: /Aumentar quantidade/i });
  for (let i = 0; i < 4; i++) {
    await increaseButton.click();
  }

  await expect(quantity).toHaveText('5');
  await expect(increaseButton).toBeDisabled();

  await page.screenshot({ path: 'evidence/positivos/carrinho.png', fullPage: true });
});
