import { test, expect } from '@playwright/test';

const validClient = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  cep: '01310-100',
};

function validOrder(overrides: Record<string, unknown> = {}) {
  return {
    cliente: validClient,
    itens: [{ produtoId: 'P005', quantidade: 1 }],
    ...overrides,
  };
}

test('GET produtos lista os oito produtos com preço numérico', async ({ request }) => {
  const response = await request.get('/api/produtos');
  expect(response.status()).toBe(200);

  const products = await response.json();
  expect(products).toEqual([
    { id: 'P001', nome: 'Camiseta Essencial', descricao: 'Algodão penteado e corte reto.', categoria: 'Vestuário', preco: 59.9 },
    { id: 'P002', nome: 'Calça Jeans Slim', descricao: 'Jeans com elastano e lavagem escura.', categoria: 'Vestuário', preco: 139.9 },
    { id: 'P003', nome: 'Tênis Casual Urbano', descricao: 'Solado de borracha e cabedal em lona.', categoria: 'Calçados', preco: 189.9 },
    { id: 'P004', nome: 'Boné Aba Curva', descricao: 'Ajuste traseiro com fivela metálica.', categoria: 'Acessórios', preco: 49.9 },
    { id: 'P005', nome: 'Mochila Urbana 20L', descricao: 'Compartimento acolchoado para notebook.', categoria: 'Acessórios', preco: 100 },
    { id: 'P006', nome: 'Kit 3 Pares de Meias', descricao: 'Cano médio, algodão com reforço no calcanhar.', categoria: 'Vestuário', preco: 29.9 },
    { id: 'P007', nome: 'Jaqueta Corta-Vento', descricao: 'Tecido leve e repelente à água.', categoria: 'Vestuário', preco: 229.9 },
    { id: 'P008', nome: 'Garrafa Térmica 750ml', descricao: 'Mantém a temperatura por até 12 horas.', categoria: 'Acessórios', preco: 50 },
  ]);
});

test('GET produto retorna 404 para identificador inexistente', async ({ request }) => {
  const response = await request.get('/api/produtos/NOPE');
  expect(response.status()).toBe(404);
  expect((await response.json()).erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
});

test('POST calcular corresponde ao exemplo oficial da documentação', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: {
      itens: [
        { produtoId: 'P002', quantidade: 1 },
        { produtoId: 'P004', quantidade: 2 },
      ],
      cupom: 'BEMVINDO10',
    },
  });
  expect(response.status()).toBe(200);

  const result = await response.json();
  expect(result).toMatchObject({
    itens: [
      { produtoId: 'P002', nome: 'Calça Jeans Slim', precoUnitario: 139.9, quantidade: 1, total: 139.9 },
      { produtoId: 'P004', nome: 'Boné Aba Curva', precoUnitario: 49.9, quantidade: 2, total: 99.8 },
    ],
    subtotal: 239.7,
    desconto: 23.97,
    frete: 0,
    freteGratis: true,
    valorFaltanteFreteGratis: 0,
    total: 215.73,
    cupom: {
      codigo: 'BEMVINDO10',
      aplicado: true,
      mensagem: 'Cupom aplicado: 10% de desconto nos produtos.',
    },
  });
});

test('POST pedido corresponde ao exemplo oficial da documentação', async ({ request }) => {
  const response = await request.post('/api/pedidos', {
    data: validOrder({ cupom: 'BEMVINDO10' }),
  });
  expect(response.status()).toBe(201);

  const order = await response.json();
  expect(order.numero).toMatch(/^VZ-\d{6}$/);
  expect(Number.isNaN(Date.parse(order.criadoEm))).toBe(false);
  expect(order).toMatchObject({
    cliente: { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310100' },
    itens: [{ produtoId: 'P005', nome: 'Mochila Urbana 20L', precoUnitario: 100, quantidade: 1, total: 100 }],
    subtotal: 100,
    desconto: 10,
    frete: 19.9,
    freteGratis: false,
    valorFaltanteFreteGratis: 100,
    total: 109.9,
    cupom: {
      codigo: 'BEMVINDO10',
      aplicado: true,
      mensagem: 'Cupom aplicado: 10% de desconto nos produtos.',
    },
  });
});

test('POST calcular retorna frete grátis com subtotal exatamente R$ 200,00', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: { itens: [{ produtoId: 'P008', quantidade: 4 }] },
  });
  expect(response.status()).toBe(200);

  const result = await response.json();
  expect(result.subtotal).toBe(200);
  expect(result.frete).toBe(0);
  expect(result.freteGratis).toBe(true);
  expect(result.total).toBe(200);
});

test('POST calcular cobra frete com subtotal de R$ 199,90', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: {
      itens: [
        { produtoId: 'P008', quantidade: 3 },
        { produtoId: 'P004', quantidade: 1 },
      ],
    },
  });
  const result = await response.json();

  expect(response.status()).toBe(200);
  expect(result.subtotal).toBe(199.9);
  expect(result.frete).toBe(19.9);
  expect(result.valorFaltanteFreteGratis).toBe(0.1);
});

test('POST calcular oferece frete grátis com subtotal de R$ 209,90', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: {
      itens: [
        { produtoId: 'P008', quantidade: 3 },
        { produtoId: 'P001', quantidade: 1 },
      ],
    },
  });
  const result = await response.json();

  expect(response.status()).toBe(200);
  expect(result.subtotal).toBe(209.9);
  expect(result.frete).toBe(0);
  expect(result.freteGratis).toBe(true);
});

test('POST calcular preserva frete grátis em R$ 200,00 com cupom', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: {
      itens: [{ produtoId: 'P005', quantidade: 2 }],
      cupom: 'BEMVINDO10',
    },
  });
  const result = await response.json();

  expect(response.status()).toBe(200);
  expect(result.subtotal).toBe(200);
  expect(result.desconto).toBe(20);
  expect(result.frete).toBe(0);
  expect(result.total).toBe(180);
});

test('POST calcular arredonda desconto e total para duas casas', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: { itens: [{ produtoId: 'P001', quantidade: 3 }], cupom: 'BEMVINDO10' },
  });
  const result = await response.json();

  expect(response.status()).toBe(200);
  expect(result.subtotal).toBe(179.7);
  expect(result.desconto).toBe(17.97);
  expect(result.frete).toBe(19.9);
  expect(result.total).toBe(181.63);
});

test('POST calcular rejeita mais de cinco unidades do mesmo produto', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: { itens: [{ produtoId: 'P005', quantidade: 6 }] },
  });
  expect(response.status()).toBe(422);
  expect((await response.json()).erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
});

test('POST calcular normaliza maiúsculas e espaços do cupom válido', async ({ request }) => {
  const response = await request.post('/api/carrinho/calcular', {
    data: {
      itens: [{ produtoId: 'P005', quantidade: 2 }],
      cupom: '  bemvindo10  ',
    },
  });
  const result = await response.json();

  expect(response.status()).toBe(200);
  expect(result.cupom.aplicado).toBe(true);
  expect(result.desconto).toBe(20);
  expect(result.subtotal).toBe(200);
});

for (const [coupon, message] of [
  ['INEXISTENTE', 'Cupom inválido.'],
  ['VERAO2026', 'Cupom expirado.'],
]) {
  test(`POST calcular rejeita ${coupon} sem erro HTTP`, async ({ request }) => {
    const response = await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: coupon },
    });
    const result = await response.json();

    expect(response.status()).toBe(200);
    expect(result.desconto).toBe(0);
    expect(result.cupom.aplicado).toBe(false);
    expect(result.cupom.mensagem).toBe(message);
  });
}

test('POST pedido aplica frete grátis no limite de R$ 200,00', async ({ request }) => {
  const response = await request.post('/api/pedidos', {
    data: validOrder({ itens: [{ produtoId: 'P008', quantidade: 4 }] }),
  });
  expect(response.status()).toBe(201);

  const order = await response.json();
  expect(order.subtotal).toBe(200);
  expect(order.frete).toBe(0);
  expect(order.freteGratis).toBe(true);
  expect(order.total).toBe(200);
});

test('POST pedido aceita a quantidade máxima de cinco unidades', async ({ request }) => {
  const response = await request.post('/api/pedidos', {
    data: validOrder({ itens: [{ produtoId: 'P005', quantidade: 5 }] }),
  });
  expect(response.status()).toBe(201);
  expect((await response.json()).itens[0].quantidade).toBe(5);
});

test('POST pedido rejeita quantidade acima de cinco unidades', async ({ request }) => {
  const response = await request.post('/api/pedidos', {
    data: validOrder({ itens: [{ produtoId: 'P005', quantidade: 6 }] }),
  });
  expect(response.status()).toBe(422);
  expect((await response.json()).erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
});

for (const [title, quantity] of [
  ['zero', 0],
  ['negativa', -1],
  ['fracionária', 1.5],
]) {
  test(`POST pedido rejeita quantidade ${title}`, async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: validOrder({ itens: [{ produtoId: 'P005', quantidade: quantity }] }),
    });
    expect(response.status()).toBe(422);
    expect((await response.json()).erro.codigo).toBe('QUANTIDADE_INVALIDA');
  });
}

for (const [title, client, field] of [
  ['nome sem sobrenome', { ...validClient, nome: 'Maria' }, 'cliente.nome'],
  ['nome vazio', { ...validClient, nome: '' }, 'cliente.nome'],
  ['e-mail inválido', { ...validClient, email: 'maria@' }, 'cliente.email'],
  ['e-mail ausente', { ...validClient, email: '' }, 'cliente.email'],
  ['CEP com letras', { ...validClient, cep: 'ABC' }, 'cliente.cep'],
  ['CEP curto', { ...validClient, cep: '1234567' }, 'cliente.cep'],
  ['CEP com hífen fora do padrão', { ...validClient, cep: '1234-5678' }, 'cliente.cep'],
]) {
  test(`POST pedido rejeita ${title}`, async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: validOrder({ cliente: client }),
    });
    const result = await response.json();

    expect(response.status()).toBe(422);
    expect(result.erro.codigo).toBe('DADOS_INVALIDOS');
    expect(result.erro.campos).toEqual(
      expect.arrayContaining([expect.objectContaining({ campo: field })]),
    );
  });
}

for (const email of ['ana@dominio..com', 'ana..silva@dominio.com']) {
  test(`POST pedido rejeita e-mail malformado ${email}`, async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: validOrder({ cliente: { ...validClient, email } }),
    });
    const result = await response.json();

    expect(response.status()).toBe(422);
    expect(result.erro.codigo).toBe('DADOS_INVALIDOS');
    expect(result.erro.campos).toEqual(
      expect.arrayContaining([expect.objectContaining({ campo: 'cliente.email' })]),
    );
  });
}

for (const cep of ['01310-100', '01310100']) {
  test(`POST pedido aceita CEP válido ${cep}`, async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: validOrder({ cliente: { ...validClient, cep } }),
    });
    expect(response.status()).toBe(201);
    expect((await response.json()).cliente.cep).toBe('01310100');
  });
}

test('POST pedido normaliza espaços externos do e-mail', async ({ request }) => {
  const response = await request.post('/api/pedidos', {
    data: validOrder({ cliente: { ...validClient, email: ' maria@exemplo.com ' } }),
  });
  expect(response.status()).toBe(201);
  expect((await response.json()).cliente.email).toBe('maria@exemplo.com');
});

for (const [title, items, code] of [
  ['sem itens', [], 'ITENS_OBRIGATORIOS'],
  ['produto inexistente', [{ produtoId: 'NOPE', quantidade: 1 }], 'PRODUTO_NAO_ENCONTRADO'],
  ['produto duplicado', [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P001', quantidade: 1 }], 'ITEM_DUPLICADO'],
]) {
  test(`POST pedido rejeita ${title}`, async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: validOrder({ itens: items }),
    });
    expect(response.status()).toBe(422);
    expect((await response.json()).erro.codigo).toBe(code);
  });
}

for (const [coupon, code] of [
  ['INEXISTENTE', 'CUPOM_INVALIDO'],
  ['VERAO2026', 'CUPOM_EXPIRADO'],
]) {
  test(`POST pedido rejeita cupom ${coupon}`, async ({ request }) => {
    const response = await request.post('/api/pedidos', {
      data: validOrder({ cupom: coupon }),
    });
    expect(response.status()).toBe(422);
    expect((await response.json()).erro.codigo).toBe(code);
  });
}