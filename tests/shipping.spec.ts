import { test, expect } from '@playwright/test';

async function addProduct(page: import('@playwright/test').Page, name: string, quantity: number) {
  const product = page.locator('article').filter({ hasText: name });
  const addButton = product.getByRole('button', { name: 'Adicionar ao carrinho' });

  for (let item = 0; item < quantity; item++) {
    await addButton.click();
  }
}

async function openCart(page: import('@playwright/test').Page) {
  await page.getByRole('link', { name: /Carrinho/i }).click();
  return page.getByRole('region', { name: 'Resumo do pedido' });
}

test('aplicar frete grátis quando o subtotal é exatamente R$ 200,00', async ({ page }) => {
  await page.goto('/');
  await addProduct(page, 'Garrafa Térmica 750ml', 4);
  const summary = await openCart(page);

  await expect(summary).toContainText('R$ 200,00');
  await expect(summary.getByText('Grátis', { exact: true })).toBeVisible();
});

test('cobrar frete abaixo do limite, em R$ 199,90', async ({ page }) => {
  await page.goto('/');
  await addProduct(page, 'Garrafa Térmica 750ml', 3);
  await addProduct(page, 'Boné Aba Curva', 1);
  const summary = await openCart(page);

  await expect(summary).toContainText('R$ 199,90');
  await expect(summary.getByText('R$ 19,90', { exact: true })).toBeVisible();
  await expect(summary.getByText('Grátis', { exact: true })).toHaveCount(0);
});

test('manter frete grátis acima do limite', async ({ page }) => {
  await page.goto('/');
  await addProduct(page, 'Garrafa Térmica 750ml', 3);
  await addProduct(page, 'Camiseta Essencial', 1);
  const summary = await openCart(page);

  await expect(summary).toContainText('R$ 209,90');
  await expect(summary.getByText('Grátis', { exact: true })).toBeVisible();
});

test('calcular frete grátis pelo subtotal antes do desconto', async ({ page }) => {
  await page.goto('/');
  await addProduct(page, 'Garrafa Térmica 750ml', 4);
  const summary = await openCart(page);

  await page.getByLabel('Cupom de desconto').fill('BEMVINDO10');
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();

  await expect(summary).toContainText('R$ 200,00');
  await expect(summary).toContainText('R$ 20,00');
  await expect(summary.getByText('Grátis', { exact: true })).toBeVisible();
  await expect(summary).toContainText('R$ 180,00');
});