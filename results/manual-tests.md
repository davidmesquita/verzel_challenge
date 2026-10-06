# Execução dos testes manuais

| ID | Cenário | Resultado | Evidência | Bug |
|---|---|---|---|---|
| TC-001 | Listagem dos produtos | PASS | [EV-001](../evidence/TC-001.md) | — |
| TC-002 | Adição de produto ao carrinho | PASS | [EV-002](../evidence/TC-002.md) | — |
| TC-003 | Aplicação do cupom `BEMVINDO10` | PASS | [EV-003](../evidence/TC-003.md) | — |
| TC-004 | Frete grátis com subtotal exatamente R$ 200,00 | FAIL | [EV-004](../evidence/TC-004.md) | [BUG-001](../bugs/BUG-001.md) |
| TC-005 | Limite de 5 unidades por produto | UI PASS; API FAIL | [EV-005](../evidence/TC-005.md) | [BUG-002](../bugs/BUG-002.md) |
| TC-006 | Pedido confirmado com dados válidos | PASS | [EV-006](../evidence/TC-006.md) | — |
| TC-007 | Dados inválidos no checkout | PASS | [EV-007](../evidence/TC-007.md) | — |
| TC-015 | Frete grátis acima do limite (R$ 209,90) | PASS | Verificação exploratória | — |
| TC-016 | Frete grátis em R$ 200,00 com cupom | FAIL | Verificação exploratória | [BUG-001](../bugs/BUG-001.md) |

## Observações
- A documentação oficial foi a fonte de verdade.
- As simplificações do ambiente foram respeitadas e não classificadas como bugs.
- Os cenários principais foram validados em navegador real.
