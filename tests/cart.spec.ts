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

test('exibir o estado vazio do carrinho', async ({ page }) => {
  await page.goto('/carrinho');

  await expect(page.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible();
  await expect(page.getByText('Escolha um produto na vitrine para começar.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ver produtos' })).toHaveAttribute('href', '/');
});

test('manter o carrinho isolado entre abas', async ({ page, context }) => {
  await page.goto('/');

  const product = page.locator('article').filter({ hasText: 'Mochila Urbana 20L' });
  await product.getByRole('button', { name: 'Adicionar ao carrinho' }).click();

  const otherTab = await context.newPage();
  await otherTab.goto('/carrinho');

  await expect(otherTab.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeVisible();
});
