# 📊 Diagramas do Sistema

## Diagrama Entidade-Relacionamento (ER)

```mermaid
erDiagram
    USUARIOS {
        int id PK
        text nome
        text usuario
        text senha
        text perfil
    }

    CLIENTES {
        int id PK
        text nome
        text cpf_cnpj
        text telefone
        text email
        text endereco
    }

    PRODUTOS {
        int id PK
        text nome
        text categoria
        real preco
        int estoque
    }

    VENDAS {
        int id PK
        int cliente_id FK
        text data_venda
        real total
        text status
    }

    ITENS_VENDA {
        int id PK
        int venda_id FK
        int produto_id FK
        int quantidade
        real valor_unitario
        real subtotal
    }

    RECEBIMENTOS {
        int id PK
        int venda_id FK
        text data_recebimento
        real valor
        text forma_pagamento
        text status
    }

    CLIENTES ||--o{ VENDAS : "possui"
    VENDAS ||--o{ ITENS_VENDA : "contém"
    PRODUTOS ||--o{ ITENS_VENDA : "referenciado em"
    VENDAS ||--o{ RECEBIMENTOS : "gera"
```

## Fluxo de Navegação

```mermaid
flowchart TD
    A["Login"] --> B["Home"]
    B --> C["Cadastro"]
    B --> D["Vendas"]
    B --> E["Financeiro"]
    B --> F["Relatórios"]
    B --> G["Sair → Login"]

    C --> C1["Produtos"]
    C --> C2["Clientes"]
    C --> C3["Usuários"]

    E --> E1["Contas a Receber"]
```

## Fluxo de Venda

```mermaid
flowchart TD
    Login["Login"] --> Home["Home"]
    Home --> Venda["Venda"]
    Venda --> SelCliente["Selecionar Cliente"]
    SelCliente --> SelProd["Selecionar Produto"]
    SelProd --> InfQtd["Informar Quantidade"]
    InfQtd --> ValEst{"Validar Estoque?"}
    ValEst -- Sim --> AddProd["Adicionar Produto"]
    ValEst -- Não --> AlertEst["Alert: Estoque Insuficiente"] --> InfQtd
    AddProd --> CalcTotal["Calcular Total"]
    CalcTotal --> FinVenda["Finalizar Venda"]
    FinVenda --> BaixEst["Baixar Estoque"]
    FinVenda --> GerReceb["Gerar Recebimento Pendente"]
```

---

## Diagrama de Classes (Módulos Cadastro, Vendas e Financeiro)

```mermaid
classDiagram
    class DatabaseService {
        +sqlite: SQLiteConnection
        +db: SQLiteDBConnection
        +isInitialized: boolean
        +useFallback: boolean
        +initializeDatabase()
        +getConnection()
        +query(sql, params)
        +run(sql, params)
    }

    class UsuarioService {
        -databaseService: DatabaseService
        +listar()
        +buscarPorId(id)
        +inserir(usuario)
        +atualizar(usuario)
        +excluir(id)
    }

    class ProdutoService {
        -databaseService: DatabaseService
        +listar()
        +buscarPorId(id)
        +inserir(produto)
        +atualizar(produto)
        +excluir(id)
        +atualizarEstoque(produtoId, quantidade)
        +verificarEstoque(produtoId, quantidade)
    }

    class ClienteService {
        -databaseService: DatabaseService
        +listar()
        +buscarPorId(id)
        +inserir(cliente)
        +atualizar(cliente)
        +excluir(id)
    }

    class VendaService {
        -databaseService: DatabaseService
        -clienteService: ClienteService
        -produtoService: ProdutoService
        -financeiroService: FinanceiroService
        +criarVenda(venda, itens)
        +listarVendas()
        +listarPendentes()
        +listarPagas()
        +listarVendasPendentes()
        +listarVendasPagas()
        +listarItensPorVenda(venda_id)
        +calcularTotal(itens)
        +calcularTotalVendido()
        +validarEstoque(produto_id, quantidade)
        +baixarEstoque(produto_id, quantidade)
        +marcarComoPaga(vendaId)
    }

    class FinanceiroService {
        -databaseService: DatabaseService
        -vendaService: VendaService
        +gerarRecebimentoPendente(venda_id, valor)
        +listarRecebimentos()
        +listarTodosRecebimentos()
        +listarRecebimentosPendentes()
        +listarRecebimentosPagos()
        +buscarPorId(id)
        +registrarRecebimento(recebimento)
        +listarPorVenda(vendaId)
        +remover(id)
        +calcularTotalRecebido()
        +calcularTotalPendente()
    }

    UsuarioService --> DatabaseService
    ProdutoService --> DatabaseService
    ClienteService --> DatabaseService
    VendaService --> DatabaseService
    VendaService --> ClienteService
    VendaService --> ProdutoService
    VendaService --> FinanceiroService
    FinanceiroService --> DatabaseService
    FinanceiroService --> VendaService
```

---

## Fluxo do Módulo de Cadastro

```mermaid
flowchart TD
    Start["Entrar em Cadastro"] --> Menu["Escolher Usuários, Produtos ou Clientes"]
    Menu --> Form["Carregar Formulário e Lista de Itens"]
    Form --> Add["Inserir Dados → Clicar Salvar"]
    Add --> Valid{"Campos Válidos?"}
    Valid -- Não --> Alert["Exibir alert() de erro"] --> Form
    Valid -- Sim --> Query["Executar INSERT no Banco"]
    Query --> AlertSuccess["Exibir alert() de sucesso"] --> Refresh["Recarregar Lista"] --> Form

    Form --> Edit["Clicar Editar no Item"]
    Edit --> FillForm["Preencher Form com dados do Item"] --> EditSave["Alterar e Clicar Atualizar"]
    EditSave --> ValidEdit{"Campos Válidos?"}
    ValidEdit -- Não --> AlertEdit["Exibir alert() de erro"] --> FillForm
    ValidEdit -- Sim --> QueryUpdate["Executar UPDATE no Banco"]
    QueryUpdate --> AlertEditSuccess["Exibir alert() de sucesso"] --> Refresh

    Form --> Del["Clicar Excluir no Item"]
    Del --> Confirm{"confirm() para Excluir?"}
    Confirm -- Não --> Form
    Confirm -- Sim --> QueryDel["Executar DELETE no Banco"] --> Refresh
```

---

## Fluxo do Módulo Financeiro / Receber

```mermaid
flowchart TD
    Home["Home"] --> Fin["Financeiro"]
    Fin --> Receber["Contas a Receber"]
    Receber --> ListaPend["Listar Recebimentos Pendentes"]
    Receber --> ListaPag["Listar Recebimentos Pagos"]

    ListaPend --> SelRec["Selecionar Recebimento Pendente"]
    SelRec --> FormPag["Abrir Formulário de Pagamento"]
    FormPag --> InfForma["Informar Forma de Pagamento"]
    InfForma --> InfData["Informar Data de Recebimento"]
    InfData --> ValidPag{"Dados Válidos?"}
    ValidPag -- Não --> AlertErr["Exibir alert() de erro"] --> FormPag
    ValidPag -- Sim --> ConfPag["Confirmar Recebimento"]
    ConfPag --> AtuRec["Atualizar Recebimento → Status: Recebido"]
    AtuRec --> AtuVenda["Marcar Venda como Paga"]
    AtuVenda --> AlertSuc["Exibir alert() de sucesso"]
    AlertSuc --> Reload["Recarregar Listas"] --> Receber
```

---

## Fluxo do Módulo de Relatórios

```mermaid
flowchart TD
    Login["Login"] --> Home["Home"]
    Home --> Relatorios["Relatórios"]
    Relatorios --> SelTipo["Selecionar Tipo de Relatório"]
    SelTipo --> Query["Consultar Dados (SQLite / Fallback)"]
    Query --> ShowData["Exibir Informações"]
    ShowData --> Filter["Aplicar Filtros (Busca / Status)"] --> ShowData
```
