Feature: Carrinho de compras

  Scenario: Adicionar um produto ao carrinho
    Given que o usuário acessa a página inicial da loja
    When adiciona o produto Camiseta Essencial ao carrinho
    Then o carrinho deve exibir 1 item
    And o subtotal deve refletir o valor do produto

  Scenario: Limitar a quantidade por produto em 5 unidades
    Given que o usuário possui um item no carrinho
    When tenta aumentar a quantidade até 6
    Then a interface deve bloquear o incremento além de 5
    And o valor exibido deve permanecer em 5 unidades
