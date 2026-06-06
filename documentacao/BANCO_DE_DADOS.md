# 🗄️ Banco de Dados

O sistema utiliza **SQLite** como banco de dados local e principal, acessado via plugin `@capacitor-community/sqlite`.

> [!NOTE]
> **SQLite Web / WASM e Fallback Web (Ambiente de Desenvolvimento):**
> - O SQLite continua sendo o banco de dados principal e definitivo do aplicativo em dispositivos físicos ou emuladores (Android/iOS).
> - No navegador, o SQLite Web utiliza WebAssembly (`sql.js`) para simular o banco local. O arquivo `sql-wasm.wasm` fica localizado no diretório `/assets/sql-wasm.wasm` para carregamento correto.
> - Se o SQLite Web falhar ou houver problemas em ambiente de navegador, o sistema ativa automaticamente um fallback temporário baseado em `LocalStorage` que emula as tabelas e o CRUD de dados de forma transparente, permitindo que todas as telas carreguem e testem sem quebras ou travamentos.

## Nome do Banco

`gestao_comercial_db`

## Tabelas

### 1. `usuarios`

**Finalidade:** Armazena os usuários autorizados a acessar o sistema, registrando suas credenciais e perfis de permissão.

| Coluna | Tipo | Restrição |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| nome | TEXT | NOT NULL |
| usuario | TEXT | NOT NULL UNIQUE |
| senha | TEXT | NOT NULL |
| perfil | TEXT | NOT NULL |

**Regras da tabela:**
- `nome`, `usuario`, `senha` e `perfil` são obrigatórios (não nulos).
- A coluna `usuario` deve ser única (UNIQUE) no banco de dados para evitar logins duplicados.
- Perfis aceitos na interface: Administrador, Vendedor, Financeiro.
- **Dados padrão:** Um usuário admin (`admin` / `admin123`, perfil `Administrador`) é inserido na primeira execução.

---

### 2. `clientes`

**Finalidade:** Armazena os registros cadastrais dos clientes que realizam compras no estabelecimento.

| Coluna | Tipo | Restrição |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| nome | TEXT | NOT NULL |
| cpf_cnpj | TEXT | — |
| telefone | TEXT | — |
| email | TEXT | — |
| endereco | TEXT | — |

**Regras da tabela:**
- O `nome` é o único campo estritamente obrigatório.
- CPF/CNPJ, Telefone, E-mail e Endereço são opcionais e salvos como texto livre.

---

### 3. `produtos`

**Finalidade:** Armazena os itens disponíveis para venda e mantém o controle de estoque de cada um.

| Coluna | Tipo | Restrição |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| nome | TEXT | NOT NULL |
| categoria | TEXT | — |
| preco | REAL | NOT NULL |
| estoque | INTEGER | NOT NULL |

**Regras da tabela:**
- `nome`, `preco` e `estoque` são obrigatórios.
- O preço (`preco`) deve ser maior do que zero (> 0).
- O estoque (`estoque`) deve ser maior ou igual a zero (>= 0).
- A categoria é de preenchimento opcional.

---

### 4. `vendas`

Registra as vendas realizadas.

| Coluna | Tipo | Restrição |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| cliente_id | INTEGER | NOT NULL, FK → clientes(id) |
| data_venda | TEXT | NOT NULL |
| total | REAL | NOT NULL |
| status | TEXT | NOT NULL (`pendente` ou `paga`) |

---

### 5. `itens_venda`

Registra os itens de cada venda.

| Coluna | Tipo | Restrição |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| venda_id | INTEGER | NOT NULL, FK → vendas(id) |
| produto_id | INTEGER | NOT NULL, FK → produtos(id) |
| quantidade | INTEGER | NOT NULL |
| valor_unitario | REAL | NOT NULL |
| subtotal | REAL | NOT NULL |

---

### 6. `recebimentos`

Registra os recebimentos (pagamentos de vendas).

| Coluna | Tipo | Restrição |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| venda_id | INTEGER | NOT NULL, FK → vendas(id) |
| data_recebimento | TEXT | NOT NULL |
| valor | REAL | NOT NULL |
| forma_pagamento | TEXT | NOT NULL |
| status | TEXT | NOT NULL |

---

## Relacionamentos e Fluxo de Dados

### 1. Relacionamento entre Venda e Cliente
- Uma venda é vinculada a um único cliente por meio da chave estrangeira `vendas.cliente_id` que aponta para `clientes.id` (relação 1:N, onde um cliente pode ter várias vendas, mas uma venda pertence a apenas um cliente).

### 2. Relacionamento entre Venda e Itens da Venda (`itens_venda`)
- Uma venda pode conter um ou vários produtos. A tabela `itens_venda` funciona como uma tabela associativa contendo a chave estrangeira `venda_id` referenciando `vendas.id` (relação 1:N, onde uma venda tem vários itens detalhados).

### 3. Relacionamento entre Itens da Venda (`itens_venda`) e Produtos
- Cada item registrado no carrinho possui a chave estrangeira `itens_venda.produto_id` apontando para `produtos.id`, armazenando também uma cópia estática do `valor_unitario` e `quantidade` no momento exato da transação comercial.

### 4. Relação entre Venda e Recebimento
- Ao finalizar uma venda com status `"pendente"`, o sistema gera automaticamente um registro associado na tabela `recebimentos` referenciando `recebimentos.venda_id` -> `vendas.id` (relação 1:1) com o valor total da venda e status `"pendente"`. Isso alimenta o fluxo de caixa a receber.

### 5. Baixa de Estoque
- Durante o fluxo de finalização da venda, para cada item de produto em `itens_venda`, o estoque é reduzido diretamente da tabela `produtos` executando a instrução SQL:
  `UPDATE produtos SET estoque = estoque - ? WHERE id = ?`
- A interface de vendas bloqueia qualquer adição caso a quantidade desejada exceda a quantidade disponível em `produtos.estoque`.

### 6. Confirmação de Recebimento
- Ao registrar o recebimento de uma venda pendente na tela Contas a Receber, o sistema executa duas operações:
  1. **Atualizar Recebimento**: O registro na tabela `recebimentos` é atualizado com `status = 'recebido'`, `forma_pagamento` preenchida (Dinheiro, Cartão Crédito, Cartão Débito, PIX, Boleto ou Transferência) e `data_recebimento` informada.
  2. **Marcar Venda como Paga**: O registro correspondente na tabela `vendas` é atualizado com `status = 'paga'` através do SQL:
     `UPDATE vendas SET status = 'paga' WHERE id = ?`
- Formas de pagamento disponíveis: Dinheiro, Cartão Crédito, Cartão Débito, PIX, Boleto, Transferência.

### 7. Consultas de Relatórios
O módulo de relatórios lê dados consolidados a partir de todas as principais entidades da base de dados:
- **Produtos (`produtos`)**: Carrega dados gerais (`SELECT * FROM produtos ORDER BY nome`) para o relatório de estoque, filtrando itens com estoque baixo (`estoque <= 5`).
- **Clientes (`clientes`)**: Lista todos os clientes cadastrados (`SELECT * FROM clientes ORDER BY nome`).
- **Vendas (`vendas`)**: Consulta os registros de faturamento (`SELECT v.*, c.nome as cliente_nome FROM vendas v INNER JOIN clientes c ON v.cliente_id = c.id`) para alimentar os totais de vendas gerais, pagas e pendentes.
- **Itens da Venda (`itens_venda`)**: Conta a quantidade de itens associados a cada venda para exibir no relatório analítico.
- **Recebimentos (`recebimentos`)**: Mapeia os fluxos de caixa recebidos e pendentes (`SELECT * FROM recebimentos`) para totalizar as receitas de caixa líquidas vs. faturamento em aberto.

## SQL de Criação

As tabelas são criadas automaticamente pelo `DatabaseService` ao inicializar o aplicativo. O código fonte está em:

```
src/app/services/database.service.ts
```
