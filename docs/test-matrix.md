# Matriz de testes

| ID | Requisito | Funcionalidade | Tipo | Prioridade | Cenário | Status |
|---|---|---|---|---|---|---|
| TC-001 | REQ-001 | Cupom | Funcional | Alta | Aplicar `BEMVINDO10` em compra elegível | PASS |
| TC-002 | REQ-003 | Cupom | Negativo | Alta | Cupom inexistente exibe `Cupom inválido.` | PASS |
| TC-003 | REQ-004 | Cupom | Negativo | Alta | Cupom expirado exibe `Cupom expirado.` | PASS |
| TC-004 | REQ-006 | Frete | Boundary | Alta | Frete grátis com subtotal exatamente R$ 200,00 | Falha (BUG-001) |
| TC-005 | REQ-007 | Frete | Boundary | Alta | Frete fixo de R$ 19,90 com subtotal R$ 199,90 | PASS |
| TC-006 | REQ-008 | Frete | Funcional | Média | Desconto não incide sobre o frete | PASS |
| TC-007 | REQ-010 | Carrinho/API | Negativo | Alta | Quantidade maior que 5 deve ser bloqueada | Falha API (BUG-002); UI PASS |
| TC-008 | REQ-012 | Checkout | Negativo | Alta | Nome sem sobrenome | PASS |
| TC-009 | REQ-013 | Checkout | Negativo | Alta | E-mail inválido | PASS |
| TC-010 | REQ-014 | Checkout | Negativo | Alta | CEP inválido | PASS |
| TC-011 | REQ-015 | Checkout | Funcional | Média | Pedido confirmado com os dados válidos | PASS |
| TC-012 | REQ-016 | Ambiente | Exploratório | Média | Carrinho não persiste entre abas | PASS |
| TC-013 | REQ-011 | Cálculo | Boundary | Média | Arredondamento para 2 casas decimais | PASS |
| TC-014 | REQ-010 | Carrinho | Exploratório | Média | Carrinho vazio e preenchido | PASS |
| TC-015 | REQ-006 | Frete | Boundary | Alta | Frete grátis acima do limite, com subtotal R$ 209,90 | PASS |
| TC-016 | REQ-008 | Frete/Cupom | Boundary | Alta | Subtotal de R$ 200,00 mantém frete grátis após cupom | Falha (BUG-001) |
| TC-017 | API | Catálogo | Funcional/Negativo | Média | Listar produtos e consultar IDs existente/inexistente | PASS |
| TC-018 | API | Pedido | Negativo | Alta | Validar itens vazios, duplicados e produto inexistente | PASS |
| TC-019 | API | Checkout | Negativo | Alta | Validar nome, e-mail e CEP inválidos | PASS |
| TC-020 | API | Erros HTTP | Negativo | Média | JSON inválido e método não permitido | PASS |
| TC-021 | REQ-013 | API | Negativo | Alta | Rejeitar e-mail com pontos consecutivos no usuário ou domínio | Falha (BUG-003) |
| TC-022 | API | Contrato | Funcional | Alta | Valores de catálogo e exemplo oficial de cálculo | PASS |
| TC-023 | API | Pedido | Funcional | Alta | Exemplo oficial de criação de pedido e normalização do CEP | PASS |
| TC-024 | API | Pedido | Negativo | Média | Item sem `produtoId` ou `quantidade` retorna `ITEM_INVALIDO` | Falha (BUG-004) |
| TC-025 | REQ-005 | Cupom | Funcional | Média | Remover cupom aplicado antes de trocar por outro | PASS |

## Cobertura mínima desejada
- Happy path: fluxo correto com dados válidos
- Negativos: cupom inválido, cupom expirado, e-mail inválido, CEP inválido
- Boundary values: exatamente 200, 199,90, zero, limite de 5 unidades
- Estados: vazio, preenchido, com cupom, após erro, após sucesso

## Relacionamento com UI e API

Quando a funcionalidade envolve cálculo e confirmação, o compare entre UI e API foi realizado pela observação dos valores; a regra do documento foi usada como fonte de verdade.
