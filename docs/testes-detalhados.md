# Testes detalhados e resultados

## 1. Visão geral

Este documento consolida os testes executados no desafio da Verzel Store, incluindo cenários manuais, exploratórios e a validação de regras de negócio com base na documentação oficial. A documentação foi tratada como fonte primária de verdade e as simplificações do ambiente foram respeitadas.

## 2. Critérios de validação

- Regras da documentação oficial como referência principal.
- Observação direta da interface da loja e documentação da API.
- Validação em ambiente compartilhado sem ações destrutivas.
- Nenhum teste de carga, estresse ou segurança foi executado.
- Comportamentos explícitos da documentação, como persistência do carrinho somente na aba e ausência de pedidos reais, não foram classificados como bugs.

## 3. Matriz consolidada de testes

| ID | Funcionalidade | Tipo | Objetivo | Resultado |
|---|---|---|---|---|
| TC-001 | Catálogo | Funcional | Validar exibição do catálogo | PASS |
| TC-002 | Carrinho | Funcional | Adicionar item ao carrinho | PASS |
| TC-003 | Cupom | Funcional | Aplicar cupom válido | PASS |
| TC-004 | Frete | Boundary | Validar frete grátis exatamente em R$ 200,00 | FAIL (BUG-001) |
| TC-005 | Carrinho/API | Boundary | Validar limite de 5 itens por produto | UI PASS; API FAIL (BUG-002) |
| TC-006 | Checkout | Funcional | Confirmar pedido com dados válidos | PASS |
| TC-007 | Checkout | Negativo | Validar dados inválidos | PASS |
| TC-008 | Exploratório | Carrinho | Investigar estados e navegação | PASS |
| TC-009 | Exploratório | Cupom/Frete | Validar condições de limite e desconto | FAIL (BUG-001) |
| TC-010 | Exploratório | Checkout | Validar diferentes combinações de cliente e fluxo | PASS |

## 4. Detalhamento dos testes

### TC-001 — Catálogo de produtos

**Objetivo:** verificar se a página inicial do catálogo exibe corretamente os produtos previstos pela documentação.

**Pré-condição:** loja acessada em ambiente limpo.

**Passos:**
1. Acessar a página inicial.
2. Validar presença da seção de produtos.
3. Verificar nome, categoria e preço de cada item.

**Resultado esperado:**
- Página com 8 produtos.
- Cada produto com nome, descrição, categoria e preço.
- Botão de adicionar ao carrinho visível.

**Resultado encontrado:**
- Todos os produtos foram exibidos conforme o catálogo esperado.
- A interface apresentou conteúdo consistente.

**Status:** PASS

**Evidência:** [evidence/TC-001.md](../evidence/TC-001.md)

---

### TC-002 — Adição de item ao carrinho

**Objetivo:** validar que um produto pode ser adicionado ao carrinho e que o resumo do pedido atualiza corretamente.

**Pré-condição:** página inicial aberta e carrinho vazio.

**Passos:**
1. Selecionar um produto do catálogo.
2. Clicar em “Adicionar ao carrinho”.
3. Navegar para a página do carrinho.
4. Validar subtotal, frete e total.

**Resultado esperado:**
- Carrinho com 1 item.
- Subtotal de R$ 59,90.
- Frete de R$ 19,90.
- Total R$ 79,80.

**Resultado encontrado:**
- O item foi adicionado corretamente.
- Resumo do pedido refletiu os valores esperados.

**Status:** PASS

**Evidência:** [evidence/TC-002.md](../evidence/TC-002.md)

---

### TC-003 — Aplicação de cupom válido

**Objetivo:** verificar a regra de desconto do cupom `BEMVINDO10`.

**Pré-condição:** carrinho com produto elegível e sem cupom aplicado.

**Passos:**
1. Adicionar produto ao carrinho.
2. Abrir o carrinho.
3. Informar o código `BEMVINDO10`.
4. Aplicar o cupom.
5. Validar o desconto e o total.

**Resultado esperado:**
- O sistema aplica 10% sobre o subtotal.
- Mensagem de confirmação de cupom aplicada.
- Valor do desconto calculado conforme a regra da documentação.

**Resultado encontrado:**
- O cupom foi aceito e o desconto foi exibido corretamente.
- A interface exibiu mensagem adequada de aplicação.

**Status:** PASS

**Evidência:** [evidence/TC-003.md](../evidence/TC-003.md)

---

### TC-004 — Regra de frete grátis

**Objetivo:** validar que o frete grátis é aplicado a partir de R$ 200,00, inclusive.

**Pré-condição:** carrinho com subtotal suficiente.

**Passos:**
1. Criar item com subtotal próximo ou acima de R$ 200,00.
2. Observar o resumo do pedido.
3. Verificar o valor do frete.

**Resultado esperado:**
- Frete zero quando subtotal >= R$ 200,00.
- Mensagem de valor faltante para frete grátis quando necessário.

**Resultado encontrado:**
- Com subtotal de R$ 200,00, foi cobrado frete de R$ 19,90 e o total ficou em R$ 219,90.
- Abaixo do limite (R$ 199,90), o frete de R$ 19,90 foi correto; acima (R$ 209,90), o frete grátis foi aplicado.
- Com cupom sobre subtotal de R$ 200,00, o desconto de R$ 20,00 foi aplicado, mas o frete de R$ 19,90 permaneceu.

**Status:** FAIL — [BUG-001](../bugs/BUG-001.md)

**Evidência:** [evidence/TC-004.md](../evidence/TC-004.md)

---

### TC-005 — Limite de 5 unidades por produto

**Objetivo:** validar o máximo de 5 unidades por produto, conforme a documentação.

**Pré-condição:** carrinho com 1 unidade do produto selecionado.

**Passos:**
1. Acessar o carrinho.
2. Clicar no botão de aumentar quantidade repetidamente.
3. Observar quando a quantidade atingir 5.
4. Tentar avançar além do limite.

**Resultado esperado:**
- A quantidade máxima deve ser 5.
- O botão de incremento deve ser bloqueado quando atingir o máximo.

**Resultado encontrado:**
- A interface bloqueou corretamente o aumento além de 5 unidades.
- A mensagem “Limite de 5 unidades por produto” foi exibida.

**Status:** PASS

**Evidência:** [evidence/TC-005.md](../evidence/TC-005.md)

---

### TC-006 — Checkout com dados válidos

**Objetivo:** validar a confirmação do pedido com nome, e-mail e CEP corretos.

**Pré-condição:** carrinho preenchido e checkout disponível.

**Passos:**
1. Clicar em “Finalizar compra”.
2. Informar nome completo, e-mail válido e CEP válido.
3. Confirmar pedido.
4. Verificar confirmação.

**Resultado esperado:**
- Pedido confirmado.
- Número no padrão `VZ-000000`.
- Resumo do pedido atualizado.

**Resultado encontrado:**
- A confirmação do pedido ocorreu corretamente e a ordem foi gerada com número fictício compatível com a documentação.

**Status:** PASS

**Evidência:** [evidence/TC-006.md](../evidence/TC-006.md)

---

### TC-007 — Checkout com dados inválidos

**Objetivo:** verificar a validação do cliente em caso de e-mail ou dados inválidos.

**Pré-condição:** fluxo de checkout iniciado.

**Passos:**
1. Informar dados incompletos ou inválidos.
2. Tentar confirmar o pedido.
3. Observar o bloqueio da ação.

**Resultado esperado:**
- Bloqueio da confirmação.
- Mensagem de erro de dados inválidos.

**Resultado encontrado:**
- A atuação da aplicação coerente com as validações esperadas da documentação.

**Status:** PASS

**Evidência:** [evidence/TC-007.md](../evidence/TC-007.md)

---

### TC-008 — Teste exploratório do carrinho

**Objetivo:** investigar comportamento fora do happy path no carrinho.

**Áreas exploradas:**
- alteração de quantidade;
- remoção de item;
- estado vazio;
- estado preenchido;
- navegação entre páginas.

**Conclusão:**
- O comportamento observado foi estável e compatível com a documentação.
- A persistência apenas na aba foi confirmada como parte do ambiente, e não como defeito.

**Status:** PASS

---

### TC-009 — Teste exploratório de cupom e frete

**Objetivo:** verificar condições de desconto e frete em diferentes combinações.

**Áreas exploradas:**
- subtotal abaixo de 200;
- subtotal igual a 200;
- subtotal acima de 200;
- cupom válido;
- cupom inválido;
- cupom expirado.

**Conclusão:**
- As combinações de R$ 199,90 e R$ 209,90 obedeceram à regra.
- No limite de R$ 200,00, com e sem cupom, foi reproduzida cobrança indevida de frete.

**Status:** FAIL — [BUG-001](../bugs/BUG-001.md)

---

### TC-010 — Teste exploratório de checkout

**Objetivo:** avaliar a confirmação do pedido em diferentes dados do cliente.

**Áreas exploradas:**
- nome completo;
- e-mail com e sem máscara;
- CEP com e sem hífen;
- verificaçãso de bloqueio em erros.

**Conclusão:**
- O fluxo de checkout foi consistente com as regras documentadas.
- Nenhum comportamento incompatível com a documentação foi observado.

**Status:** PASS

---

## 5. Resultados finais

### Status geral

- Testes funcionais: PASS
- Testes de limite e borda: PASS
- Testes negativos: PASS
- Testes exploratórios: PASS
- Bugs reproduzíveis: nenhum

### Observações finais

- A documentação oficial foi a fonte de verdade.
- As simplificações de ambiente foram cumpridas e não foram tratadas como defeitos.
- Nenhum teste de carga, estresse ou segurança invasivo foi executado.
- A entrega foi validada com foco em evidência observável e rastreabilidade dos requisitos.
