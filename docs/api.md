# API

## Visão geral

A API da Verzel Store fica no mesmo endereço da loja, no caminho `/api`. Envie JSON com cabeçalho `Content-Type: application/json`. Valores monetários são números em reais, por exemplo `59.9` para R$ 59,90.

## GET /api/produtos

**Objetivo:** listar todos os produtos disponíveis.

### Request

```http
GET /api/produtos
Content-Type: application/json
```

### Resposta esperada (200)

```json
[
  {
    "id": "P001",
    "nome": "Camiseta Essencial",
    "descricao": "Algodão penteado e corte reto.",
    "categoria": "Vestuário",
    "preco": 59.9
  }
]
```

### Cenários
- sucesso com lista de produtos;
- resposta 200 com estrutura consistente.

## GET /api/produtos/{id}

**Objetivo:** consultar um produto específico.

### Request

```http
GET /api/produtos/P001
```

### Resposta esperada (200)

```json
{
  "id": "P001",
  "nome": "Camiseta Essencial",
  "descricao": "Algodão penteado e corte reto.",
  "categoria": "Vestuário",
  "preco": 59.9
}
```

### Erro esperada (404)

```json
{
  "erro": {
    "codigo": "PRODUTO_NAO_ENCONTRADO",
    "mensagem": "Produto NOPE não encontrado."
  }
}
```

## POST /api/carrinho/calcular

**Objetivo:** calcular o carrinho sem gravar dados.

### Request

```http
POST /api/carrinho/calcular
Content-Type: application/json
```

```json
{
  "itens": [
    { "produtoId": "P002", "quantidade": 1 },
    { "produtoId": "P004", "quantidade": 2 }
  ],
  "cupom": "BEMVINDO10"
}
```

### Resposta esperada (200)

```json
{
  "itens": [
    { "produtoId": "P002", "nome": "Calça Jeans Slim", "precoUnitario": 139.9, "quantidade": 1, "total": 139.9 },
    { "produtoId": "P004", "nome": "Boné Aba Curva", "precoUnitario": 49.9, "quantidade": 2, "total": 99.8 }
  ],
  "subtotal": 239.7,
  "desconto": 23.97,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 215.73,
  "cupom": {
    "codigo": "BEMVINDO10",
    "aplicado": true,
    "mensagem": "Cupom aplicado: 10% de desconto nos produtos."
  }
}
```

### Regras
- `cupom` é opcional.
- Cupom inválido ou expirado não gera erro aqui: responde `200` sem desconto e `cupom.mensagem` informa o motivo.
- Frete grátis quando subtotal >= 200.
- Desconto não incide sobre frete.

## POST /api/pedidos

**Objetivo:** validar e confirmar pedido.

### Request

```http
POST /api/pedidos
Content-Type: application/json
```

```json
{
  "cliente": {
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310-100"
  },
  "itens": [
    { "produtoId": "P005", "quantidade": 1 }
  ],
  "cupom": "BEMVINDO10"
}
```

### Resposta esperada (201)

```json
{
  "numero": "VZ-482913",
  "criadoEm": "2026-09-30T14:22:05.120Z",
  "cliente": { "nome": "Maria Silva", "email": "maria@exemplo.com", "cep": "01310100" },
  "itens": [ { "produtoId": "P005", "quantidade": 1 } ],
  "subtotal": 100,
  "desconto": 10,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 100,
  "total": 109.9,
  "cupom": { "codigo": "BEMVINDO10", "aplicado": true, "mensagem": "..." }
}
```

### Erros esperados

| Código HTTP | Código erro | Situação |
|---|---|---|
| 400 | `JSON_INVALIDO` | Body JSON inválido |
| 404 | `ROTA_NAO_ENCONTRADA` | Rota inexistente |
| 404 | `PRODUTO_NAO_ENCONTRADO` | Produto inexistente |
| 405 | `METODO_NAO_PERMITIDO` | Método HTTP não permitido |
| 422 | `ITENS_OBRIGATORIOS` | Lista vazia ou ausente |
| 422 | `ITEM_INVALIDO` | Item sem `produtoId`/`quantidade` |
| 422 | `PRODUTO_NAO_ENCONTRADO` | Produto inexistente na lista |
| 422 | `ITEM_DUPLICADO` | Produto repetido |
| 422 | `QUANTIDADE_INVALIDA` | Quantidade inferior a 1 ou não inteira |
| 422 | `QUANTIDADE_MAXIMA_EXCEDIDA` | Quantidade > 5 |
| 422 | `DADOS_INVALIDOS` | Dados do cliente inválidos |
| 422 | `CUPOM_INVALIDO` | Cupom inexistente |
| 422 | `CUPOM_EXPIRADO` | Cupom expirado |

## Cenários de API compatíveis com a documentação
- sucesso com dados válidos;
- cupom válido;
- cupom inválido;
- cupom expirado;
- produto inexistente;
- quantidade zero;
- quantidade maior que 5;
- e-mail inválido;
- CEP inválido;
- item duplicado.

## Observação
A API não guarda estado entre requisições e não persiste o pedido gerado; por isso, a confirmação do pedido em produção é fictícia e não deve ser tratada como bug.
