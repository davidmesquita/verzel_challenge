Feature: Cupom de desconto

  Scenario: Aplicar um cupom válido
    Given que o usuário adiciona produtos suficientes para o desconto
    When informa o cupom BEMVINDO10
    And confirma a aplicação do cupom
    Then o subtotal deve reduzir em 10%
    And a mensagem do cupom deve indicar aplicação bem-sucedida

  Scenario: Rejeitar cupom inválido
    Given que o usuário possui produtos no carrinho
    When tenta aplicar o cupom INVALIDO99
    Then a mensagem Cupom inválido. deve ser exibida
    And o desconto deve permanecer em zero

  Scenario: Rejeitar cupom expirado
    Given que o usuário possui produtos no carrinho
    When aplica o cupom VERAO2026
    Then a mensagem Cupom expirado. deve ser exibida
    And o desconto deve permanecer em zero
