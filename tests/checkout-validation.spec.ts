import { test, expect } from '@playwright/test';

async function openCheckout(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.locator('article').first().getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.getByRole('link', { name: /Carrinho/i }).click();
  await page.getByRole('link', { name: 'Finalizar compra' }).click();
}

for (const [title, name, message] of [
  ['nome sem sobrenome', 'Maria', 'Informe nome e sobrenome.'],
  ['nome vazio', '', 'Informe o nome completo.'],
]) {
  test(`checkout bloqueia ${title}`, async ({ page }) => {
    await openCheckout(page);
    await page.getByLabel('Nome completo').fill(name);
    await page.getByLabel('E-mail').fill('maria@exemplo.com');
    await page.getByLabel('CEP').fill('01310-100');
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();

    await expect(page.getByText(message)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Finalizar compra' })).toBeVisible();
  });
}

test('checkout bloqueia e-mail inválido', async ({ page }) => {
  await openCheckout(page);
  await page.getByLabel('Nome completo').fill('Maria Silva');
  await page.getByLabel('E-mail').fill('maria@');
  await page.getByLabel('CEP').fill('01310-100');
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();

  await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Finalizar compra' })).toBeVisible();
});

for (const cep of ['ABC', '1234567', '1234-5678']) {
  test(`checkout bloqueia CEP inválido ${cep}`, async ({ page }) => {
    await openCheckout(page);
    await page.getByLabel('Nome completo').fill('Maria Silva');
    await page.getByLabel('E-mail').fill('maria@exemplo.com');
    await page.getByLabel('CEP').fill(cep);
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();

    await expect(page.getByText('Informe um CEP com 8 dígitos.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Finalizar compra' })).toBeVisible();
  });
}