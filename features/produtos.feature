Feature: Catálogo de produtos

  Scenario: Visualizar a listagem inicial de produtos
    Given que o usuário acessa a página inicial da loja
    Then ele deve ver uma seção de produtos
    And deve visualizar pelo menos 8 itens no catálogo
    And cada produto deve apresentar nome, categoria e preço

  Scenario: Consultar um produto por identificador
    Given que o usuário consulta a API do catálogo
    When solicita o produto P001
    Then a API deve responder com status 200
    And deve retornar os campos id, nome, categoria e preco
