# 📱 Telas do Sistema

Documentação das telas do sistema, atualizada a cada etapa do desenvolvimento.

## Telas Implementadas

### 1. Login (`/login`)

- **Descrição:** Tela de autenticação do sistema com suporte a criação de nova conta.
- **Modo Login:**
  - **Campos:** Usuário (input de texto), Senha (input de senha).
  - **Ações:** Botão "Entrar" (`onLogin()`), link "Criar nova conta" (alterna para modo cadastro).
  - **Validações:** Campos vazios exibem `alert('Preencha usuário e senha.')`.
  - **Mensagens de erro:** Credenciais incorretas exibem `alert('Usuário ou senha inválidos.')`. Falhas de sistema exibem `alert('Erro ao realizar login. Tente novamente.')`.
- **Modo Cadastro de Nova Conta:**
  - **Campos:** Nome Completo, Usuário (login), Senha, Confirmar Senha, Perfil (Administrador, Vendedor, Financeiro).
  - **Ações:** Botão "Cadastrar Conta" (`onCriarConta()`), link "Já tenho conta / Voltar" (retorna ao modo login).
  - **Validações:** Todos os campos são obrigatórios. Senhas devem coincidir. O nome de usuário deve ser único no banco (caso contrário exibe `alert('Usuário já cadastrado.')`).
  - **Sucesso:** Exibe `alert('Conta criada com sucesso. Faça login para acessar o sistema.')`, limpa o formulário e retorna ao modo login.
- **Redirecionamento:** Após sucesso na autenticação, o foco do elemento ativo do DOM é removido (`activeElement.blur()`) para evitar avisos de acessibilidade do navegador e a navegação segura é realizada através de `this.router.navigateByUrl('/home', { replaceUrl: true })`.
- **Observação sobre Fallback Web:** O aplicativo conta com um mecanismo de fallback web que permite acesso imediato usando as credenciais padrão (`admin` / `admin123`) e também permite criar novas contas que ficam salvas no localStorage.
- **Status:** ✅ Implementada com fallback web, cadastro de conta e navegação segura (Etapa 8)

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

- **Descrição:** Submenu de cadastro com opções para navegar até os cadastros de Usuários, Clientes, Categorias de Produto e Produtos.
- **Ações:** Botões/Cards para cada módulo de cadastro, com reordenação visual e botão Voltar para Home.
- **Status:** ✅ Atualizada (Etapa 9)

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

- **Objetivo da tela:** Cadastrar, consultar, editar, excluir e monitorar a quantidade em estoque dos produtos, classificando-os por categoria e validando preços em moeda brasileira.
- **Campos disponíveis:**
  - Nome do Produto (`nome`)
  - Categoria (`categoria`) (Seleção dinâmica via `<ion-select>` a partir das categorias cadastradas)
  - Preço de Venda (R$) (`preco`) (Formatação e conversão do padrão brasileiro `R$ 0,00`)
  - Quantidade em Estoque (`estoque`)
- **Botões existentes:**
  - Limpar (Reseta o formulário)
  - Salvar / Atualizar (Envia dados para o SQLite/Fallback)
  - Editar (Carrega os dados do item no formulário)
  - Excluir (Remove o item após confirmação)
  - Gerenciar Categorias (Navega para a tela de gerenciamento de categorias)
- **Validações:**
  - Nome do produto obrigatório.
  - Seleção de categoria obrigatória.
  - Preço obrigatório, numérico e maior que zero (> 0) (suporta formatos como `"12,50"`, `"R$ 12,50"`, `"1.250,90"`).
  - Estoque obrigatório, numérico e maior ou igual a zero (>= 0).
- **Ações disponíveis:** CRUD completo, destaque de estoque controlado, indicador visual de estoque baixo (<= 5) e integração dinâmica com categorias.
- **Status:** ✅ Implementada com integração dinâmica de categorias e validação/máscara de R$ (Etapa 9)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 6. Cadastro de Categorias de Produto (`/cadastro/categorias-produto`)

- **Objetivo da tela:** Gerenciar categorias para classificação de produtos.
- **Campos disponíveis:**
  - Nome da Categoria (`nome`)
  - Descrição (`descricao`)
- **Botões existentes:**
  - Limpar (Reseta o formulário)
  - Salvar / Atualizar (Envia dados para o SQLite/Fallback)
  - Editar (Carrega os dados da categoria no formulário)
  - Excluir (Remove a categoria após confirmação)
- **Validações:**
  - Nome obrigatório.
  - Nome único (valida duplicidades via `categoriaExiste` impedindo cadastros com o mesmo nome).
- **Status:** ✅ Implementada com CRUD completo e validações em SQLite/Fallback (Etapa 9)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 7. Cadastro de Clientes (`/cadastro/clientes`)

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
  - CPF/CNPJ: máscara reativa (`000.000.000-00` para CPF, `00.000.000/0000-00` para CNPJ), valida 11 dígitos (CPF) ou 14 dígitos (CNPJ)
  - Telefone: máscara reativa (`(00) 0000-0000` ou `(00) 00000-0000`), valida 10 ou 11 dígitos
  - E-mail: validação por regex (`nome@dominio.ext`)
- **Ações disponíveis:** CRUD completo com campos opcionais estruturados de contato e validações com alertas descritivos.
- **Status:** ✅ Implementada com fallback web, validações de CPF/CNPJ, Telefone e E-mail (Etapa 8)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 8. Vendas (`/vendas`)

- **Objetivo da tela:** Registrar novas vendas, selecionar clientes e produtos, gerenciar itens no carrinho, baixar estoques e gerar contas a receber.
- **Campos disponíveis:**
  - Cliente da Venda (Select com clientes cadastrados)
  - Produto (Select com produtos disponíveis, preço unitário reformatado em R$ e estoque atual)
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
- **Carrinho de Compras:** Exibe lista reativa contendo nome do produto, quantidade, preço unitário (formatado em R$), subtotal e botão para exclusão individual de itens.
- **Totais:** Exibe o valor do Total Geral (formatado em R$) somando os subtotais de forma reativa.
- **Vendas Realizadas:** Listagem reativa contendo código da venda, nome do cliente, data do registro, quantidade total de itens, total geral formatado em R$ e badge colorido de status (`Pendente` ou `Paga`).
- **Status:** ✅ Implementada com fallback web, baixa de estoque e formatação monetária centralizada (Etapa 9)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 9. Financeiro (`/financeiro`)

- **Objetivo da tela:** Submenu do módulo financeiro com acesso ao módulo Contas a Receber.
- **Ações:** Card/botão para navegar até Contas a Receber e botão Voltar para Home.
- **Status:** ✅ Implementada (Etapa 4)

---

### 10. Contas a Receber (`/financeiro/receber`)

- **Objetivo da tela:** Listar recebimentos pendentes e pagos, registrar pagamentos de vendas.
- **Resumo Financeiro:** Exibe dois cards resumo no topo com contadores de pendentes e recebidos.
- **Abas (Segment):** Aba "Pendentes" e aba "Recebidos" com badge de contagem.
- **Cards de Recebimento Pendente:**
  - Exibe número da venda, nome do cliente, data da venda, quantidade de produtos e valor total formatado em R$.
  - Badge visual de status "Pendente" (vermelho).
  - Botão "Registrar" para abrir formulário inline de confirmação de pagamento.
- **Formulário de Confirmação (Inline):**
  - Forma de pagamento (select: Dinheiro, Cartão Crédito, Cartão Débito, PIX, Boleto, Transferência).
  - Data de recebimento (input date, pré-preenchido com data atual).
  - Botões "Cancelar" e "Confirmar".
- **Cards de Recebimento Pago:**
  - Exibe número da venda, nome do cliente, data de recebimento, forma de pagamento e valor recebido formatado em R$.
  - Badge visual de status "Recebido" (verde).
- **Validações:**
  - Forma de pagamento obrigatória.
  - Data de recebimento obrigatória.
- **Ações ao confirmar:**
  - Atualiza o recebimento com forma de pagamento, data e status "recebido".
  - Marca a venda correspondente como "paga".
  - Recarrega ambas as listas automaticamente.
- **Status:** ✅ Implementada com fallback web e formatação de moeda R$ (Etapa 9)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

### 11. Relatórios (`/relatorios`)

- **Objetivo da tela:** Permitir ao gestor visualizar consolidados operacionais e financeiros detalhados do sistema.
- **Seções Disponíveis:**
  - **Resumo Geral (Dashboard)**: Cards com estatísticas consolidadas contendo contagem de produtos e clientes cadastrados, total de vendas realizadas (com detalhe de pagas vs pendentes), faturamento bruto acumulado, total recebido em caixa e total pendente de recebimento (todos formatados em R$).
  - **Relatório de Produtos**: Lista exibindo código (ID), nome, categoria, preço formatado em R$, quantidade em estoque e status. Adiciona realce em vermelho e badge animado de alerta para estoques baixos (estoque <= 5).
  - **Relatório de Clientes**: Lista exibindo código (ID), nome, CPF/CNPJ, telefone e e-mail.
  - **Relatório de Vendas**: Lista com código da venda, nome do cliente, data da venda, quantidade de itens inclusos, valor total formatado em R$ e badge com status (Paga ou Pendente).
  - **Relatório de Recebimentos**: Histórico mostrando o código, código da venda associada, nome do cliente, data do recebimento (ou indicação de pendente), forma de pagamento, valor total formatado em R$ e badge do status financeiro (Recebido ou Pendente).
- **Filtros e Busca:**
  - *Filtro por Tipo*: Permite selecionar uma aba específica para ocultar as demais (Todos, Resumo, Produtos, Clientes, Vendas, Recebimentos).
  - *Barra de Busca*: Permite digitar o nome do produto/categoria ou nome do cliente para filtrar dinamicamente as tabelas de listagem.
  - *Filtros de Status*: Filtros popover específicos para vendas (Todas, Pendentes, Pagas) e recebimentos (Todos, Pendentes, Pagos).
- **Mensagens para Ausência de Dados (Empty States):** Exibição de um estado vazio personalizado (ícone descritivo e texto instrutivo) caso a listagem selecionada não possua registros correspondentes na base ou fallback (ex: "Nenhum produto cadastrado").
- **Status:** ✅ Implementada com fallback web e formatação de moeda R$ (Etapa 9)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

## Telas Pendentes

| Tela | Rota | Etapa Prevista |
|---|---|---|
| (Todas as telas obrigatórias foram implementadas com sucesso) | - | - |
