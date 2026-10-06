# Varredura completa de regressão — Verzel Store

**Data:** 2026-10-06  
**Fonte de verdade:** documentação oficial da loja, versão 2.3.0, card VZS-142.  
**Ambiente:** loja e API oficiais, acessadas no Chromium integrado.  
**Objetivo:** comparar UI e API com critérios de aceite, priorizando limites e validações de cliente.

## Resumo executivo

Foram reproduzidos três defeitos:

- **BUG-001:** subtotal de R$ 200,00 é cobrado com frete de R$ 19,90, embora o limite seja inclusivo. O erro ocorre na UI, no cálculo da API e na confirmação do pedido.
- **BUG-002:** os endpoints de cálculo e pedido aceitam quantidade 6 do mesmo produto, acima do máximo 5.
- **BUG-003:** `POST /api/pedidos` aceita e-mails com pontos consecutivos inválidos, embora a UI os bloqueie.

Nome sem sobrenome, e-mail inválido simples e CEP inválido foram rejeitados como esperado. A exceção de e-mail malformado com pontos consecutivos está detalhada no BUG-003. Também passaram o cálculo abaixo/acima do limite, cupons válido/inválido/expirado, itens duplicados/inexistentes, arredondamento e erros HTTP/JSON documentados.

## Execução manual e exploratória — UI

| ID | Cenário e dados | Resultado observado | Status |
|---|---|---|---|
| UI-001 | Carregar catálogo | O catálogo apresentou os oito produtos e preços documentados. | PASS |
| UI-002 | Sessão nova e carrinho vazio | A página de produtos iniciou com zero itens; o carrinho vazio é estado esperado. | PASS |
| UI-003 | Checkout válido: Maria Silva, `maria@exemplo.com`, CEP `01310-100` | Pedido confirmado; o CEP foi normalizado para oito dígitos e o resumo manteve subtotal, frete e total esperados. | PASS |
| UI-004 | Nome `Maria` sem sobrenome | Checkout permaneceu aberto e exibiu “Informe nome e sobrenome.” | PASS |
| UI-005 | Nome válido `Maria Silva` | O checkout aceitou o nome completo e a confirmação exibiu “Obrigado, Maria.” | PASS |
| UI-006 | E-mail `maria@` | Checkout bloqueou a confirmação e exibiu “Informe um e-mail válido.” | PASS |
| UI-007 | E-mail com espaços externos | ` maria@exemplo.com ` foi aceito e normalizado no pedido confirmado. | PASS |
| UI-008 | CEP `ABC` | Checkout bloqueou a confirmação e exibiu “Informe um CEP com 8 dígitos.” | PASS |
| UI-009 | CEP `1234-5678` | Checkout bloqueou a confirmação; hífen fora da posição esperada não foi aceito. | PASS |
| UI-010 | CEP válido `01310-100` | Fluxo de checkout foi confirmado; API retornou o CEP normalizado. | PASS |
| UI-011 | Subtotal R$ 199,90 (3 garrafas + boné) | Frete R$ 19,90; mensagem informa R$ 0,10 faltante. | PASS |
| UI-012 | Subtotal exatamente R$ 200,00 (4 garrafas) | Frete R$ 19,90; total R$ 219,90; mensagem contraditória “Faltam R$ 0,00”. | FAIL — BUG-001 |
| UI-013 | Subtotal R$ 209,90 (3 garrafas + camiseta) | Frete grátis e total R$ 209,90. | PASS |
| UI-014 | R$ 200,00 antes do cupom `BEMVINDO10` | Desconto de R$ 20,00 foi aplicado; frete permaneceu em R$ 19,90 apesar do subtotal elegível. | FAIL — BUG-001 |
| UI-015 | Limite de cinco unidades no carrinho | O teste Playwright existente valida cinco unidades e botão de incremento desabilitado. | PASS (automação existente) |

## Execução manual e exploratória — API

| ID | Requisição/cenário | Resultado observado | Status |
|---|---|---|---|
| API-001 | `GET /api/produtos` | HTTP 200; oito produtos, IDs P001–P008 e preços numéricos. | PASS |
| API-002 | `GET /api/produtos/P001` | HTTP 200; produto e preço corretos. | PASS |
| API-003 | `GET /api/produtos/NOPE` | HTTP 404, código `PRODUTO_NAO_ENCONTRADO`. | PASS |
| API-004 | Calcular subtotal R$ 199,90 | HTTP 200; frete R$ 19,90, `freteGratis: false`, faltante R$ 0,10. | PASS |
| API-005 | Calcular subtotal R$ 200,00 sem cupom | HTTP 200; frete R$ 19,90, `freteGratis: false`, faltante R$ 0, total R$ 219,90. | FAIL — BUG-001 |
| API-006 | Calcular subtotal R$ 209,90 | HTTP 200; frete zero e `freteGratis: true`. | PASS |
| API-007 | Calcular R$ 200,00 com cupom `  bemvindo10  ` | Código foi normalizado e desconto de R$ 20,00 aplicado; frete incorreto de R$ 19,90. | FAIL — BUG-001 |
| API-008 | Cupom inexistente no cálculo | HTTP 200, desconto zero, `aplicado: false`, mensagem “Cupom inválido.” | PASS |
| API-009 | Cupom `VERAO2026` no cálculo | HTTP 200, desconto zero, `aplicado: false`, mensagem “Cupom expirado.” | PASS |
| API-010 | Pedido válido com CEP `01310-100` | HTTP 201; pedido fictício gerado, CEP normalizado para `01310100`. | PASS |
| API-011 | Pedido válido com CEP `01310100` | HTTP 201; CEP aceito e normalizado. | PASS |
| API-012 | Nome sem sobrenome ou vazio | HTTP 422, `DADOS_INVALIDOS`, erro associado a `cliente.nome`. | PASS |
| API-013 | E-mail `maria@` ou ausente | HTTP 422, `DADOS_INVALIDOS`, erro associado a `cliente.email`. | PASS |
| API-014 | E-mail com espaços externos | HTTP 201; espaços removidos e endereço normalizado. | PASS |
| API-015 | CEP `ABC`, sete dígitos ou hífen malformado | HTTP 422, `DADOS_INVALIDOS`, erro associado a `cliente.cep`. | PASS |
| API-016 | Lista de itens vazia ou cliente ausente | HTTP 422; `ITENS_OBRIGATORIOS` ou `DADOS_INVALIDOS` conforme o caso. | PASS |
| API-017 | Quantidade 0 ou 1,5 | HTTP 422, `QUANTIDADE_INVALIDA`. | PASS |
| API-018 | Quantidade 5 em pedido | HTTP 201; limite superior válido aceito. | PASS |
| API-019 | Quantidade 6 em cálculo | HTTP 200; subtotal R$ 600,00 calculado sem erro. | FAIL — BUG-002 |
| API-020 | Quantidade 6 em pedido | HTTP 201; pedido confirmado com seis unidades. | FAIL — BUG-002 |
| API-021 | Produto inexistente no pedido | HTTP 422, `PRODUTO_NAO_ENCONTRADO`. | PASS |
| API-022 | Produto repetido na lista | HTTP 422, `ITEM_DUPLICADO`. | PASS |
| API-023 | Cupom inválido/expirado em pedido | HTTP 422, `CUPOM_INVALIDO`/`CUPOM_EXPIRADO`. | PASS |
| API-024 | Três camisetas com cupom válido | Subtotal R$ 179,70; desconto R$ 17,97; frete R$ 19,90; total R$ 181,63. | PASS |
| API-025 | JSON inválido em pedido | HTTP 400, `JSON_INVALIDO`. | PASS |
| API-026 | GET em `/api/pedidos` | HTTP 405, `METODO_NAO_PERMITIDO`. | PASS |
| API-027 | E-mail `ana@dominio..com` ou `ana..silva@dominio.com` no pedido | HTTP 201 para ambos; esperado HTTP 422 `DADOS_INVALIDOS` no campo `cliente.email`. A UI bloqueia o primeiro formato. | FAIL — BUG-003 |
| API-028 | Comparar todos os campos de `GET /api/produtos` com a documentação | Oito produtos, nomes, descrições, categorias e preços conferem exatamente. | PASS |
| API-029 | Exemplo oficial de `POST /api/carrinho/calcular` (P002 ×1, P004 ×2, BEMVINDO10) | HTTP 200; subtotal R$ 239,70, desconto R$ 23,97, frete zero, total R$ 215,73 e itens/cupom iguais ao exemplo. | PASS |
| API-030 | Exemplo oficial de `POST /api/pedidos` (P005 ×1, BEMVINDO10) | HTTP 201; subtotal R$ 100,00, desconto R$ 10,00, frete R$ 19,90, total R$ 109,90; CEP normalizado e formato do número/data válidos. | PASS |

## Evidências

As tabelas acima registram entradas, status HTTP, valores e mensagens observados. Os dois relatórios reproduzíveis, com passos completos, impacto e resultado esperado, estão em [BUG-001](../bugs/BUG-001.md) e [BUG-002](../bugs/BUG-002.md). A evidência anterior de frete foi corrigida em [TC-004](../evidence/TC-004.md).

## Automação adicionada

- `tests/api.spec.ts`: catálogo, cálculo, cupons, limites de quantidade, pedido, campos e erros API.
- `tests/checkout-validation.spec.ts`: validações de nome, e-mail e CEP na interface.
- `tests/shipping.spec.ts`: fronteiras de frete e cupom.
- `tests/negative-evidence.spec.ts`: cupons inválido/expirado e CEP inválido, com captura PNG.

A suíte completa foi executada em WSL com `npx playwright test`: **53 testes, 44 aprovados e 9 falhos**. O spec focado da API executou **36 testes: 29 aprovados e 7 falhos**.

- BUG-001: frete no limite exato falha na UI, na API de cálculo, no pedido e nos casos com cupom.
- BUG-002: quantidade 6 é aceita pela API de cálculo e pela API de pedido.
- BUG-003: os dois e-mails malformados são aceitos pela API.

As nove falhas correspondem somente aos três bugs registrados; as outras 42 validações passaram. O HTML de resultados pode ser aberto com `npx playwright show-report`; o Playwright também salvou traces, vídeos e screenshots dos casos que falharam em `test-results/`.

## Escopo não executado

Não foram feitos testes de carga, estresse, segurança, persistência de pedidos ou envio de e-mail/pagamento real, pois esses comportamentos estão fora do escopo ou são simulados pelo ambiente.
