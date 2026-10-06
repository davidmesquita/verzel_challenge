# Ambiguidades e decisões adotadas

| ID | Ambiguidade | Decisão adotada |
|---|---|---|
| AMB-001 | O cupom `VERAO2026` é expirado em qual data exata? | Seguiu-se a documentação, que informa a data de expiração como `31/03/2026`. |
| AMB-002 | O carrinho deve ser compartilhado entre abas? | Não; a documentação define que ele fica apenas na aba do navegador. |
| AMB-003 | A quantidade máxima deve ser validada na UI e na API? | A documentação informa que vale para interface e API. |
| AMB-004 | O valor faltante para frete grátis deve ser sempre calculado sobre subtotal sem desconto? | Sim; a documentação explicitamente define que a regra considera subtotal antes do desconto. |
| AMB-005 | O pedido final deve conter um número fictício? | Sim; a documentação informa que os pedidos não são armazenados e o número gerado é fictício. |

> Em todos os casos ambíguos, a documentação oficial foi priorizada sobre inferências de interface ou comportamento implícito da aplicação.
