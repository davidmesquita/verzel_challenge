# Requisitos e regras de negócio

## 1. Fonte

Documentação oficial da Verzel Store, acessada em https://verzel-store.qa-test-verzel-store.workers.dev/documentacao.

## 2. Funcionalidades mapeadas

### 2.1 Catálogo de produtos
- Listagem de produtos na página inicial.
- Exibição de categoria, descrição, preço e botão de adicionar ao carrinho.
- Detalhe do produto por endpoint `GET /api/produtos/{id}`.

### 2.2 Carrinho
- Adição de produtos ao carrinho.
- Atualização de quantidade.
- Remoção de itens.
- Cálculo de subtotal, desconto, frete e total.
- Estado vazio e preenchido.

### 2.3 Cupons
- Aplicação de um cupom por vez.
- Cupom válido: `BEMVINDO10` com 10% de desconto.
- Cupom expirado: `VERAO2026`.
- Mensagem de erro para cupom inválido e expirado.

### 2.4 Frete
- Frete grátis a partir de R$ 200,00, inclusive.
- Frete fixo de R$ 19,90 para subtotal menor que R$ 200,00.
- Cálculo considera subtotal antes do desconto.
- Valor faltante para frete grátis.

### 2.5 Checkout
- Cadastro de cliente com nome, e-mail e CEP.
- Pedido confirmado com número fictício `VZ-######`.
- Pagamento na entrega (sem pagamento online).
- Validação de dados do cliente e regras de itens.

### 2.6 API
- `GET /api/produtos`
- `GET /api/produtos/{id}`
- `POST /api/carrinho/calcular`
- `POST /api/pedidos`

## 3. Regras de negócio

| ID | Regra | Fonte | Observação |
|---|---|---|---|
| REQ-001 | O cupom `BEMVINDO10` aplica 10% sobre o subtotal dos produtos. | Documentação | Caso válido, desconto aplicado no cálculo do carrinho. |
| REQ-002 | Cupom não diferencia maiúsculas/minúsculas e ignora espaços no início e fim. | Documentação | Ex.: `bemvindo10` pode ser aceito. |
| REQ-003 | Cupom inexistente deve resultar em mensagem `Cupom inválido.` | Documentação | No cálculo do carrinho não gera erro; no pedido, gera `422`. |
| REQ-004 | Cupom expirado deve resultar em `Cupom expirado.` | Documentação | Regrada a data de validade informada em documentação. |
| REQ-005 | Apenas um cupom pode ser aplicado por vez. | Documentação | Necessária troca/remoção da aplicação atual. |
| REQ-006 | Frete grátis para subtotal >= R$ 200,00. | Documentação | Frete zero para limite inclusive. |
| REQ-007 | Subtotal abaixo de R$ 200,00 tem frete fixo de R$ 19,90. | Documentação | Valido no cálculo do carrinho. |
| REQ-008 | Cálculo do frete grátis considera subtotal antes do desconto. | Documentação | Useful for regression tests. |
| REQ-009 | Cupom não incide sobre o frete. | Documentação | Total = subtotal - desconto + frete. |
| REQ-010 | Cada produto pode ter no máximo 5 unidades por pedido. | Documentação | Regra vale para UI e API. |
| REQ-011 | Todos os valores são arredondados para 2 casas decimais. | Documentação | Relevante para cálculo do total. |
| REQ-012 | Nome do cliente precisa ter nome e sobrenome. | Documentação | Validação de cliente. |
| REQ-013 | E-mail precisa ter formato válido. | Documentação | Validação do checkout. |
| REQ-014 | CEP deve ter 8 dígitos, com ou sem hífen. | Documentação | Validado em pedido. |
| REQ-015 | Pedido é confirmado mesmo sem pagamento online. | Documentação | Pagamento na entrega. |
| REQ-016 | Carrinho se mantém apenas na aba do navegador. | Sobre este ambiente | Não deve ser tratado como bug. |
| REQ-017 | Nenhum e-mail ou cobrança real é enviado. | Sobre este ambiente | Ambiente fictício. |

## 4. Validações relevantes

| ID | Campo/Fluxo | Regra |
|---|---|---|
| VAL-001 | Itens do pedido | Lista obrigatória e não vazia. |
| VAL-002 | `produtoId` | Deve apontar para um produto existente. |
| VAL-003 | `quantidade` | Número inteiro maior ou igual a 1. |
| VAL-004 | `quantidade` | Máximo 5 por produto. |
| VAL-005 | `cliente.nome` | Nome e sobrenome obrigatórios. |
| VAL-006 | `cliente.email` | Formato válido. |
| VAL-007 | `cliente.cep` | 8 dígitos com/sem hífen. |
| VAL-008 | `cupom` | Inexistente/expirado gera erro somente no pedido; no cálculo gera resultado sem desconto. |

## 5. API

| Método | Endpoint | Objetivo | Parâmetros |
|---|---|---|---|
| GET | `/api/produtos` | Listar produtos | Nenhum |
| GET | `/api/produtos/{id}` | Consultar produto específico | `id` obrigatório |
| POST | `/api/carrinho/calcular` | Calcular subtotal, desconto, frete e total | `itens`, `cupom` opcional |
| POST | `/api/pedidos` | Validar e confirmar pedido | `cliente`, `itens`, `cupom` opcional |

## 6. Comportamentos intencionais do ambiente

> Estes comportamentos NÃO devem ser reportados como bugs.

- O carrinho fica salvo apenas na aba do navegador; outra aba ou janela anônima inicia vazia.
- Os pedidos não são armazenados.
- Nenhum e-mail é enviado e nenhuma cobrança é feita.
- Produtos, preços e cupons são fixos e iguais para todos os candidatos.
- A API não persiste estado entre chamadas.
- Login, cadastro, pagamento online e consulta de pedidos ficam fora do escopo.

## 7. Ambiguidades

| ID | Ambiguidade | Interpretação adotada | Motivo |
|---|---|---|---|
| AMB-001 | Qual é a regra exata para frete grátis quando subtotal é igual a R$ 200,00? | Inclui o valor limite. | A documentação diz “a partir de R$ 200,00, inclusive”. |
| AMB-002 | O cupom inválido pode aparecer na UI com mensagem, mas sem erro de API? | Sim, no cálculo do carrinho ele retorna `200` com `cupom.aplicado: false` e `mensagem` do motivo. | A documentação explicitamente informa isso. |
| AMB-003 | O total deve considerar desconto antes ou depois do frete? | `total = subtotal - desconto + frete`. | Fórmula documentada. |

## 8. Resumo executivo

A loja foi tratada como uma aplicação simples de catálogo + carrinho + cupom + frete + checkout. A prioridade de teste foi: regras de preço, cupom, frete grátis, quantidade máxima e validações de cliente e pedido.
