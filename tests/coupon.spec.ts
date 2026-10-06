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
