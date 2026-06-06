# 📋 Requisitos do Sistema

## Requisitos Funcionais

### RF01 — Login `[✅ Atendido — Etapa 1 & Correção Crítica]`
- O sistema deve permitir login com usuário e senha.
- O sistema possui um usuário padrão obrigatório (`admin` / `admin123`, perfil `Administrador`).
- O sistema valida as credenciais no banco SQLite.
- Em ambiente web de desenvolvimento (`ionic serve`), existe um fallback web temporário para permitir o teste imediato do fluxo sem travar o sistema.

### RF02 — Cadastro de Usuários `[✅ Atendido — Etapa 2]`
- O sistema deve permitir cadastrar, consultar/listar, editar e excluir usuários.
- Campos: nome, usuário (login), senha, perfil.
- O campo "usuário" deve ser único.
- Limpeza e validação completa de campos vazios com alertas.

### RF03 — Cadastro de Produtos `[✅ Atendido — Etapa 2]`
- O sistema deve permitir cadastrar, consultar/listar, editar e excluir produtos.
- Campos: nome, categoria, preço, estoque.
- Destaque claro do controle de estoque e de estoque baixo (<= 5).

### RF04 — Cadastro de Clientes `[✅ Atendido — Etapa 2]`
- O sistema deve permitir cadastrar, consultar/listar, editar e excluir clientes.
- Campos: nome, CPF/CNPJ, telefone, e-mail, endereço.

### RF05 — Controle de Estoque `[📋 Parcialmente Atendido (CRUD/UI) — Etapa 2 / Lógica de Vendas na Etapa 3]`
- O estoque deve ser reduzido automaticamente ao realizar uma venda.
- O sistema não deve permitir vender produto com estoque insuficiente.

### RF06 — Registro de Vendas `[📋 Pendente — Etapa 3]`
- Uma venda deve estar vinculada a um cliente.
- Uma venda pode conter um ou mais produtos.
- Cada item deve ter: produto, quantidade, valor unitário e subtotal.
- O sistema deve calcular o total da venda automaticamente.
- Ao finalizar, a venda deve gerar um valor a receber.

### RF07 — Financeiro (Receber) `[📋 Pendente — Etapa 4]`
- O sistema deve controlar vendas pendentes e pagas.
- Ao registrar o recebimento, a venda deve ser marcada como paga.
- O recebimento deve registrar: valor, data e forma de pagamento.

### RF08 — Relatórios `[📋 Pendente — Etapa 5]`
- Relatório de produtos cadastrados.
- Relatório de clientes cadastrados.
- Relatório de vendas realizadas.
- Relatório de vendas pendentes.
- Relatório de recebimentos.

---

## Requisitos Não-Funcionais

### RNF01 — Tecnologia `[✅ Atendido]`
- O sistema deve ser desenvolvido com Ionic, Angular e TypeScript.
- O sistema deve utilizar Capacitor como runtime.

### RNF02 — Banco de Dados `[✅ Atendido]`
- O sistema deve utilizar SQLite como banco de dados local.
- Possui fallback LocalStorage automático para desenvolvimento em navegadores.

### RNF03 — Arquitetura `[✅ Atendido]`
- O sistema deve utilizar services separados para cada módulo.
- O acesso ao banco deve ser centralizado no DatabaseService.

### RNF04 — Interface `[✅ Atendido]`
- O sistema deve ter interface responsiva e mobile-friendly.
- O design deve seguir os padrões do Ionic Framework com gradientes premium e glassmorphism.

### RNF05 — Código `[✅ Atendido]`
- O código deve ser limpo, organizado e bem documentado.
- O sistema deve ser fácil de explicar em apresentação acadêmica.

