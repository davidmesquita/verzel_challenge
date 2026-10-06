Feature: Checkout

  Scenario: Confirmar pedido com dados válidos
    Given que o usuário possui um carrinho com itens válidos
    And preenche nome, e-mail e CEP corretos
    When finaliza a compra
    Then a confirmação do pedido deve ser exibida
    And o número do pedido deve seguir o padrão VZ-000000

  Scenario: Rejeitar compra com e-mail inválido
    Given que o usuário está no checkout
    When informa um e-mail com formato inválido
    Then o sistema deve bloquear a confirmação do pedido
    And deve mostrar erro de dados inválidos
