# 📱 Telas do Sistema

Documentação das telas do sistema, atualizada a cada etapa do desenvolvimento.

## Telas Implementadas

### 1. Login (`/login`)

- **Descrição:** Tela de autenticação do sistema.
- **Campos:** Usuário, Senha.
- **Ações:** Botão "Entrar".
- **Credenciais padrão:** admin / admin123.
- **Status:** ✅ Implementada (Etapa 1)

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
- **Status:** ✅ Implementada (Etapa 2)
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
- **Status:** ✅ Implementada (Etapa 2)
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
- **Status:** ✅ Implementada (Etapa 2)
- **Screenshots/Prints futuros:** (Reservado para capturas de tela)

---

## Telas Pendentes

| Tela | Rota | Etapa Prevista |
|---|---|---|
| Módulo de Vendas | `/vendas` | Etapa 3 |
| Financeiro | `/financeiro` | Etapa 4 |
| Contas a Receber | `/financeiro/receber` | Etapa 4 |
| Relatórios | `/relatorios` | Etapa 5 |
