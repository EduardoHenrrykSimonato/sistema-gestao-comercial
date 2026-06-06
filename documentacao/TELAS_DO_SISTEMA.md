# 📱 Telas do Sistema

Documentação das telas do sistema, atualizada a cada etapa do desenvolvimento.

## Telas Implementadas

### 1. Login (`/login`)

- **Descrição:** Tela de autenticação do sistema.
- **Campos:** Usuário (input de texto), Senha (input de senha).
- **Ações:** Botão "Entrar" (`onLogin()`).
- **Validações:** Campos vazios exibem `alert('Preencha usuário e senha.')`.
- **Mensagens de erro:** Credenciais incorretas exibem `alert('Usuário ou senha inválidos.')`. Falhas de sistema exibem `alert('Erro ao realizar login. Tente novamente.')`.
- **Redirecionamento:** Após sucesso na autenticação, o foco do elemento ativo do DOM é removido (`activeElement.blur()`) para evitar avisos de acessibilidade do navegador e a navegação segura é realizada através de `this.router.navigateByUrl('/home', { replaceUrl: true })`, garantindo que o usuário seja levado à tela Home de forma limpa.
- **Observação sobre Fallback Web:** O aplicativo conta com um mecanismo de fallback web que permite acesso imediato usando as credenciais padrão (`admin` / `admin123`) caso o banco de dados SQLite não esteja disponível no navegador durante a execução via `ionic serve`.
- **Status:** ✅ Implementada com fallback web e navegação segura corrigida (Etapa 2)

---

### 2. Home (`/home`)

- **Descrição:** Tela principal com menu de navegação.
- **Menu:**
  - Cadastro (Produtos, Clientes, Usuários)
  - Vendas
  - Financeiro
  - Relatórios
  - Sair
- **Status:** ✅ Implementada (Etapa 1)

---

### 3. Cadastro (`/cadastro`)

- **Descrição:** Submenu de cadastro com opções para navegar até os cadastros de Produtos, Clientes e Usuários.
- **Ações:** Botões/Cards para Produtos, Clientes e Usuários, e botão Voltar para Home.
- **Status:** ✅ Implementada (Etapa 2)

---

### 4. Cadastro de Usuários (`/cadastro/usuarios`)

- **Objetivo da tela:** Cadastrar, consultar, editar e excluir os usuários que possuem acesso ao sistema.
- **Campos disponíveis:**
  - Nome Completo (`nome`)
  - Nome de Usuário (Login) (`usuario`)
  - Senha de Acesso (`senha`)
  - Perfil de Acesso (`perfil`) (Administrador, Vendedor, Financeiro)
- **Botões existentes:**
  - Limpar (Reseta o formulário)
  - Salvar / Atualizar (Envia dados para o SQLite/Fallback)
  - Editar (Carrega os dados do item no formulário)
  - Excluir (Remove o item após confirmação)
- **Validações:**
  - Nome completo obrigatório
  - Nome de usuário obrigatório
  - Senha de acesso obrigatória
  - Perfil de acesso obrigatório (select)
- **Ações disponíveis:** CRUD completo com persistência imediata e atualização automática da listagem.
- **Status:** ✅ Implementada com fallback web em memória para testes no browser (Etapa 2)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 5. Cadastro de Produtos (`/cadastro/produtos`)

- **Objetivo da tela:** Cadastrar, consultar, editar, excluir e monitorar a quantidade em estoque dos produtos.
- **Campos disponíveis:**
  - Nome do Produto (`nome`)
  - Categoria (`categoria`)
  - Preço de Venda (R$) (`preco`)
  - Quantidade em Estoque (`estoque`)
- **Botões existentes:**
  - Limpar (Reseta o formulário)
  - Salvar / Atualizar (Envia dados para o SQLite/Fallback)
  - Editar (Carrega os dados do item no formulário)
  - Excluir (Remove o item após confirmação)
- **Validações:**
  - Nome obrigatório
  - Preço obrigatório, numérico e maior que zero (> 0)
  - Estoque obrigatório, numérico e maior ou igual a zero (>= 0)
- **Ações disponíveis:** CRUD completo, destaque visual para produtos com estoque controlado e indicador visual para estoque baixo (<= 5).
- **Status:** ✅ Implementada com fallback web em memória para testes no browser e estoque baixo (Etapa 2)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 6. Cadastro de Clientes (`/cadastro/clientes`)

- **Objetivo da tela:** Cadastrar, consultar, editar e excluir os clientes do estabelecimento.
- **Campos disponíveis:**
  - Nome Completo (`nome`)
  - CPF ou CNPJ (`cpf_cnpj`)
  - Telefone de Contato (`telefone`)
  - E-mail (`email`)
  - Endereço Completo (`endereco`)
- **Botões existentes:**
  - Limpar (Reseta o formulário)
  - Salvar / Atualizar (Envia dados para o SQLite/Fallback)
  - Editar (Carrega os dados do item no formulário)
  - Excluir (Remove o item após confirmação)
- **Validações:**
  - Nome completo obrigatório
- **Ações disponíveis:** CRUD completo com campos opcionais estruturados de contato.
- **Status:** ✅ Implementada com fallback web em memória para testes no browser (Etapa 2)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 7. Vendas (`/vendas`)

- **Objetivo da tela:** Registrar novas vendas, selecionar clientes e produtos, gerenciar itens no carrinho e baixar estoques e gerar contas a receber.
- **Campos disponíveis:**
  - Cliente da Venda (Select com clientes cadastrados)
  - Produto (Select com produtos disponíveis, preço unitário e estoque atual)
  - Quantidade (Input numérico, inteiro, obrigatório e maior que zero)
- **Botões existentes:**
  - Adicionar (Botão "+" para inserir produto selecionado no carrinho)
  - Cancelar (Reseta o formulário/carrinho)
  - Finalizar Venda (Processa e grava a venda e itens)
  - Remover Item (Botão de lixeira na lista do carrinho)
- **Validações:**
  - Cliente obrigatório para finalizar.
  - Pelo menos um item no carrinho para finalizar.
  - Quantidade do item no carrinho não pode exceder o estoque disponível do produto.
  - Bloqueio de inserção de itens com quantidade vazia, negativa ou nula.
- **Carrinho de Compras:** Exibe lista reativa contendo nome do produto, quantidade, preço unitário, subtotal e botão para exclusão individual de itens.
- **Totais:** Exibe o valor do Total Geral somando os subtotais de forma reativa.
- **Vendas Realizadas:** Listagem reativa contendo código da venda, nome do cliente, data do registro, quantidade total de itens, total geral em reais e badge colorido de status (`Pendente` ou `Paga`).
- **Status:** ✅ Implementada com fallback web em memória e baixa de estoque reativa (Etapa 3)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 8. Financeiro (`/financeiro`)

- **Objetivo da tela:** Submenu do módulo financeiro com acesso ao módulo Contas a Receber.
- **Ações:** Card/botão para navegar até Contas a Receber e botão Voltar para Home.
- **Status:** ✅ Implementada (Etapa 4)

---

### 9. Contas a Receber (`/financeiro/receber`)

- **Objetivo da tela:** Listar recebimentos pendentes e pagos, registrar pagamentos de vendas.
- **Resumo Financeiro:** Exibe dois cards resumo no topo com contadores de pendentes e recebidos.
- **Abas (Segment):** Aba "Pendentes" e aba "Recebidos" com badge de contagem.
- **Cards de Recebimento Pendente:**
  - Exibe número da venda, nome do cliente, data da venda, quantidade de produtos e valor total.
  - Badge visual de status "Pendente" (vermelho).
  - Botão "Registrar" para abrir formulário inline de confirmação de pagamento.
- **Formulário de Confirmação (Inline):**
  - Forma de pagamento (select: Dinheiro, Cartão Crédito, Cartão Débito, PIX, Boleto, Transferência).
  - Data de recebimento (input date, pré-preenchido com data atual).
  - Botões "Cancelar" e "Confirmar".
- **Cards de Recebimento Pago:**
  - Exibe número da venda, nome do cliente, data de recebimento, forma de pagamento e valor recebido.
  - Badge visual de status "Recebido" (verde).
- **Validações:**
  - Forma de pagamento obrigatória.
  - Data de recebimento obrigatória.
- **Ações ao confirmar:**
  - Atualiza o recebimento com forma de pagamento, data e status "recebido".
  - Marca a venda correspondente como "paga".
  - Recarrega ambas as listas automaticamente.
- **Status:** ✅ Implementada com fallback web em memória para testes no browser (Etapa 4)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

## Telas Pendentes

| Tela | Rota | Etapa Prevista |
|---|---|---|
| Relatórios | `/relatorios` | Etapa 5 |

