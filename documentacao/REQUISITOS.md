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
- Possui fallback funcional em memória para execução de CRUD completo no navegador.

### RF03 — Cadastro de Produtos `[✅ Atendido — Etapa 2]`
- O sistema deve permitir cadastrar, consultar/listar, editar e excluir produtos.
- Campos: nome, categoria, preço, estoque.
- Destaque claro do controle de estoque e de estoque baixo (<= 5).
- Possui fallback funcional em memória para execução de CRUD completo no navegador.

### RF04 — Cadastro de Clientes `[✅ Atendido — Etapa 2]`
- O sistema deve permitir cadastrar, consultar/listar, editar e excluir clientes.
- Campos: nome, CPF/CNPJ, telefone, e-mail, endereço.
- Possui fallback funcional em memória para execução de CRUD completo no navegador.

### RF05 — Controle de Estoque `[✅ Atendido — Etapa 2 & Etapa 3]`
- O estoque deve ser reduzido automaticamente ao realizar uma venda.
- O sistema não deve permitir vender produto com estoque insuficiente.

### RF06 — Registro de Vendas `[✅ Atendido — Etapa 3]`
- Uma venda deve estar vinculada a um cliente.
- Uma venda pode conter um ou mais produtos.
- Cada item deve ter: produto, quantidade, valor unitário e subtotal.
- O sistema deve calcular o total da venda automaticamente.
- Ao finalizar, a venda deve gerar um valor a receber.

### RF07 — Financeiro (Receber) `[✅ Atendido — Etapa 4]`
- O sistema deve controlar vendas pendentes e pagas.
- Ao registrar o recebimento, a venda deve ser marcada como paga.
- O recebimento deve registrar: valor, data e forma de pagamento.
- Formas de pagamento disponíveis: Dinheiro, Cartão Crédito, Cartão Débito, PIX, Boleto, Transferência.
- Possui fallback funcional em memória para execução completa no navegador.

### RF08 — Relatórios `[✅ Atendido — Etapa 5]`
- Relatório de produtos cadastrados (com indicação visual para estoque baixo <= 5).
- Relatório de clientes cadastrados.
- Relatório de vendas realizadas (filtradas por status: Todas, Pendentes, Pagas).
- Relatório de recebimentos (filtrados por status: Todos, Pendentes, Pagos).
- Resumo geral consolidado (totalizadores de produtos, clientes, vendas por status e faturamento/caixa geral).
- Campo de busca unificado para filtrar dados por nome de produto/categoria ou nome de cliente.

---

## Requisitos Não-Funcionais

### RNF01 — Tecnologia `[✅ Atendido]`
- O sistema deve ser desenvolvido com Ionic, Angular e TypeScript.
- O sistema deve utilizar Capacitor como runtime.

### RNF02 — Banco de Dados `[✅ Atendido]`
- O sistema deve utilizar SQLite como banco de dados local.
- Possui fallback em memória funcional automático para desenvolvimento e testes em navegadores.

### RNF03 — Arquitetura `[✅ Atendido]`
- O sistema deve utilizar services separados para cada módulo.
- O acesso ao banco deve ser centralizado no DatabaseService.

### RNF04 — Interface `[✅ Atendido]`
- O sistema deve ter interface responsiva e mobile-friendly.
- O design deve seguir os padrões do Ionic Framework com gradientes premium e glassmorphism.

### RNF05 — Código `[✅ Atendido]`
- O código deve ser limpo, organizado e bem documentado.
- O sistema deve ser fácil de explicar em apresentação acadêmica.

---

## 🏁 Checklist Final de Requisitos

Abaixo está o checklist de entrega atestando a conclusão e conformidade dos requisitos do projeto:

- [x] Login
- [x] Cadastro de usuários
- [x] Cadastro de produtos
- [x] Controle de estoque
- [x] Cadastro de clientes
- [x] Venda com vários produtos
- [x] Baixa automática de estoque
- [x] Financeiro / Receber
- [x] Relatórios
- [x] SQLite
- [x] Documentação Markdown
- [x] GitHub


