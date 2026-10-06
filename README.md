# Verzel Store — QA Technical Test

## Sobre

Este repositório reúne a documentação, os cenários, os testes manuais, os testes exploratórios e a automação do desafio técnico de QA Júnior da Verzel Store.

## Objetivo

Validar a aplicação contra a documentação oficial, mapear regras de negócio e automatizar cenários de alto valor com Playwright, sem ignorar as simplificações intencionais do ambiente compartilhado.

## Stack

- Playwright
- TypeScript
- Gherkin
- Git
- Markdown

## Como executar

### Instalação

```bash
npm install
npx playwright install
```

> Em ambientes WSL/Ubuntu, pode ser necessário instalar as dependências do sistema do Chromium caso o navegador não inicialize.

### Testes

```bash
npx playwright test
```

### Relatório

```bash
npx playwright show-report
```

## Estrutura do repositório

- [docs/requisitos.md](docs/requisitos.md) — requisitos, regras e validações.
- [docs/api.md](docs/api.md) — endpoints e regras da API.
- [docs/test-matrix.md](docs/test-matrix.md) — matriz de teste.
- [docs/testes-detalhados.md](docs/testes-detalhados.md) — testes detalhados com resultados completos.
- [results/full-regression.md](results/full-regression.md) — execução manual e exploratória da UI e API, com resultado por cenário.
- [docs/exploratory-testing.md](docs/exploratory-testing.md) — testes exploratórios.
- [docs/ambiguities.md](docs/ambiguities.md) — ambiguidades e decisões.
- [features/](features/) — cenários em Gherkin.
- [results/manual-tests.md](results/manual-tests.md) — execução dos testes manuais.
- [bugs/](bugs/) — relatório de problemas e observações.
- [evidence/](evidence/) — registros de evidência por cenário.
- [tests/](tests/) — automação Playwright.

## Cenários

- Catálogo de produtos
- Carrinho de compras
- Cupom de desconto
- Frete grátis
- Checkout

## Bugs

Foram reproduzidos três defeitos: [frete cobrado no limite de R$ 200,00](bugs/BUG-001.md), [API aceitando mais de cinco unidades](bugs/BUG-002.md) e [API aceitando e-mails malformados](bugs/BUG-003.md).

## Evidências

A pasta [evidence/](evidence/) contém registros por cenário. Os resultados e os valores observados nesta varredura estão em [results/full-regression.md](results/full-regression.md).

### Cenários positivos

![Catálogo](evidence/positivos/catalogo.png)

![Carrinho](evidence/positivos/carrinho.png)

![Cupom válido](evidence/positivos/cupom.png)

![Checkout confirmado](evidence/positivos/checkout.png)

### Cenários negativos

![Cupom inválido](evidence/negativos/cupom-invalido.png)

![Cupom expirado](evidence/negativos/cupom-expirado.png)

![CEP inválido](evidence/negativos/cep-invalido.png)

## Automação

Os testes do Playwright cobrem catálogo, carrinho, cupons, frete, checkout, validações de campos e endpoints da API. Execute `npx playwright test`; as regressões que reproduzem BUG-001, BUG-002 e BUG-003 devem falhar até a correção da aplicação.

## Decisões e ambiguidades

As decisões de interpretação foram registradas em [docs/ambiguities.md](docs/ambiguities.md), seguindo a regra de precedência da documentação oficial.

## Uso de IA

A IA foi usada como apoio para:

- leitura e organização da documentação;
- mapeamento inicial de requisitos;
- sugestão de cenários e valores de fronteira;
- estruturação dos arquivos Gherkin e dos testes Playwright;
- revisão textual da documentação e do README.

A validação final dos comportamentos e das evidências foi feita contra o ambiente real e contra a documentação oficial, sem depender da IA como fonte única de decisão.

## Limitações

- O ambiente é compartilhado entre candidatos, então não foram realizados testes de carga, estresse ou segurança.
- O carrinho persiste apenas na aba do navegador, conforme a documentação.
- A loja é um ambiente fictício; nenhum pedido ou cobrança real é processado.

## Conclusão

A entrega cobre os requisitos documentados, prioriza regressão em regras de negócio críticas, inclui cenários Gherkin e organiza a evidência em um único repositório. A aplicação foi validada com foco em comportamentos observáveis e regras do documento oficial.
