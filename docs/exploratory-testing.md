# Testes exploratórios

## Sessão EXP-001 — Carrinho

### Objetivo
Investigar o comportamento do carrinho além dos cenários básicos.

### Áreas investigadas
- adição e remoção de itens;
- alteração de quantidade;
- double click em botão de adicionar;
- estado vazio e preenchido;
- frete grátis e valor faltante;
- persistência por aba.

### Heurísticas utilizadas
- valores de fronteira;
- ajustes de quantidade;
- repetição de ações;
- navegação entre páginas;
- recuperação após erro.

### Resultado
O limite de cinco unidades foi respeitado pela interface; a API, porém, aceitou seis unidades nos endpoints de cálculo e pedido. O comportamento documentado de não persistência entre abas foi observado.

### Bugs encontrados
- BUG-002 — API aceita quantidade superior a cinco unidades por produto.

## Sessão EXP-002 — Cupom e frete

### Objetivo
Verificar se a aplicação aplica cupom e frete conforme as regras da documentação.

### Áreas investigadas
- cupom inválido;
- cupom expirado;
- cupom válido;
- subtotal exato de 200;
- subtotal abaixo de 200;
- subtotal acima de 200.

### Resultado
Os cupons válido, inválido e expirado tiveram os resultados documentados. Abaixo e acima de R$ 200,00, a regra de frete foi aplicada; no limite exato de R$ 200,00, UI e API cobraram frete indevido.

### Bugs encontrados
- BUG-001 — frete de R$ 19,90 cobrado para subtotal exatamente R$ 200,00, inclusive após cupom.

## Sessão EXP-003 — Checkout

### Objetivo
Validar o fluxo de confirmação e as regras de dados do cliente.

### Áreas investigadas
- nome sem sobrenome;
- CEP com hífen e sem hífen;
- email válido e inválido;
- pedido com e-mail errado.

### Resultado
Nome, e-mail inválido simples e CEP foram validados. A interface bloqueou e-mail com domínio malformado, mas a API confirmou o pedido com e-mails que contêm pontos consecutivos inválidos.

### Bugs encontrados
- BUG-003 — API aceita e-mails malformados com pontos consecutivos.
