import { test, expect } from '@playwright/test';

test('catalogo exibe produtos e preços da documentação', async ({ page }) => {
  await page.goto('/');

  const productCards = page.locator('article');
  await expect(productCards).toHaveCount(8);

  const firstProduct = productCards.first();
  await expect(firstProduct.getByRole('heading')).toBeVisible();
  await expect(firstProduct).toContainText('R$');
  await expect(firstProduct.getByRole('button', { name: 'Adicionar ao carrinho' })).toBeVisible();

  await page.screenshot({ path: 'evidence/positivos/catalogo.png', fullPage: true });
});
