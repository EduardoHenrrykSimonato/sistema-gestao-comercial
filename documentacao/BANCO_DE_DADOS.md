# 🗄️ Banco de Dados

O sistema utiliza **SQLite** como banco de dados local e principal, acessado via plugin `@capacitor-community/sqlite`.

> [!NOTE]
> **Fallback Web (Ambiente de Desenvolvimento):**
> Para evitar travamentos ou problemas de compatibilidade Wasm no navegador durante a execução com `ionic serve`, o sistema implementa um fallback web temporário em `LocalStorage` que emula a persistência e a consulta de dados. Esse fallback é usado exclusivamente no browser e não substitui o SQLite, que continua sendo o banco principal e definitivo do aplicativo em dispositivos físicos ou emuladores.

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

## Relacionamentos

- `vendas.cliente_id` → `clientes.id`
- `itens_venda.venda_id` → `vendas.id`
- `itens_venda.produto_id` → `produtos.id`
- `recebimentos.venda_id` → `vendas.id`

## SQL de Criação

As tabelas são criadas automaticamente pelo `DatabaseService` ao inicializar o aplicativo. O código fonte está em:

```
src/app/services/database.service.ts
```
