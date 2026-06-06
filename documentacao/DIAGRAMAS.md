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
flowchart LR
    A["Selecionar Cliente"] --> B["Adicionar Produtos"]
    B --> C["Calcular Total"]
    C --> D["Finalizar Venda"]
    D --> E["Reduz Estoque"]
    D --> F["Gera Pendência"]
    F --> G["Registrar Recebimento"]
    G --> H["Marca como Paga"]
```

---

## Diagrama de Classes (Módulo Cadastro)

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
        +listarTodos()
        +buscarPorId(id)
        +cadastrar(usuario)
        +atualizar(usuario)
        +remover(id)
    }

    class ProdutoService {
        -databaseService: DatabaseService
        +listarTodos()
        +buscarPorId(id)
        +cadastrar(produto)
        +atualizar(produto)
        +remover(id)
        +atualizarEstoque(produtoId, quantidade)
        +verificarEstoque(produtoId, quantidade)
    }

    class ClienteService {
        -databaseService: DatabaseService
        +listarTodos()
        +buscarPorId(id)
        +cadastrar(cliente)
        +atualizar(cliente)
        +remover(id)
    }

    UsuarioService --> DatabaseService
    ProdutoService --> DatabaseService
    ClienteService --> DatabaseService
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

