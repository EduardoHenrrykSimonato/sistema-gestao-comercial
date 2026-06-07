# 📊 Diagramas do Sistema

Este arquivo contém a documentação visual completa do sistema, contendo diagramas de arquitetura, modelagem de banco de dados, diagramas de classes e fluxogramas operacionais.

---

## 1. Diagrama de Arquitetura do Sistema
Apresenta o fluxo de comunicação de 3 camadas da nossa aplicação Angular/Ionic.

```mermaid
flowchart TD
    subgraph Apresentacao ["Camada de Apresentação (Páginas Angular)"]
        LoginView["Login.page"]
        HomeView["Home.page"]
        CadastroView["Cadastro Subpages"]
        VendasView["Vendas.page"]
        FinanceiroView["Financeiro/Receber.page"]
        RelatoriosView["Relatorios.page"]
    end

    subgraph Servicos ["Camada de Serviços (Lógica & Negócios)"]
        AuthService["AuthService"]
        UsuarioService["UsuarioService"]
        ProdutoService["ProdutoService"]
        CategoriaProdutoService["CategoriaProdutoService"]
        ClienteService["ClienteService"]
        VendaService["VendaService"]
        FinanceiroService["FinanceiroService"]
    end

    subgraph Dados ["Camada de Dados & Persistência"]
        DatabaseService["DatabaseService"]
        SQLite["SQLite DB (Natividade)"]
        FallbackWeb["Fallback Web (LocalStorage)"]
    end

    %% Relações de Apresentação com Serviços
    LoginView --> AuthService & UsuarioService
    HomeView --> AuthService
    CadastroView --> UsuarioService & ProdutoService & ClienteService & CategoriaProdutoService
    VendasView --> VendaService & ClienteService & ProdutoService
    FinanceiroView --> FinanceiroService
    RelatoriosView --> VendaService & FinanceiroService & ProdutoService & ClienteService

    %% Relações de Serviços com Database
    AuthService --> DatabaseService
    UsuarioService --> DatabaseService
    ProdutoService --> DatabaseService
    CategoriaProdutoService --> DatabaseService
    ClienteService --> DatabaseService
    VendaService --> DatabaseService
    FinanceiroService --> DatabaseService

    %% Relações de Database com drivers
    DatabaseService --> SQLite
    DatabaseService --> FallbackWeb
```

---

## 2. Diagrama de Casos de Uso
Mapeia os casos de uso do sistema em torno do ator principal **Usuário**.

```mermaid
flowchart LR
    subgraph Atores
        Usuario["👤 Usuário"]
    end

    subgraph Sistema ["Gestão Comercial"]
        UC_Login(("Fazer login"))
        UC_CriarConta(("Criar nova conta"))
        UC_CadUsu(("Cadastrar usuários"))
        UC_CadCli(("Cadastrar clientes"))
        UC_CadCat(("Cadastrar categorias de produto"))
        UC_CadProd(("Cadastrar produtos"))
        UC_ContEst(("Controlar estoque"))
        UC_Venda(("Realizar venda"))
        UC_VariosProd(("Adicionar vários produtos na venda"))
        UC_ValEst(("Validar estoque"))
        UC_GerRec(("Gerar recebimento pendente"))
        UC_RegRec(("Registrar recebimento"))
        UC_Relat(("Consultar relatórios"))
    end

    Usuario --> UC_Login
    Usuario --> UC_CriarConta
    Usuario --> UC_CadUsu
    Usuario --> UC_CadCli
    Usuario --> UC_CadCat
    Usuario --> UC_CadProd
    Usuario --> UC_Venda
    Usuario --> UC_RegRec
    Usuario --> UC_Relat

    %% Relações de Inclusão / Dependência
    UC_Venda -.->|include| UC_VariosProd
    UC_Venda -.->|include| UC_ValEst
    UC_Venda -.->|include| UC_GerRec
    UC_Venda -.->|include| UC_ContEst
```

---

## 3. Diagrama Entidade-Relacionamento (ER)
Modelagem física da base de dados SQLite local.

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

    CATEGORIAS_PRODUTO {
        int id PK
        text nome
        text descricao
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

    CLIENTES ||--o{ VENDAS : "realiza"
    VENDAS ||--|{ ITENS_VENDA : "possui"
    PRODUTOS ||--|{ ITENS_VENDA : "referenciado"
    VENDAS ||--|| RECEBIMENTOS : "gera"
    CATEGORIAS_PRODUTO ||--o{ PRODUTOS : "classifica"
```

> [!NOTE]
> **Relacionamento Lógico de Categoria:**
> O relacionamento entre `CATEGORIAS_PRODUTO` e `PRODUTOS` é **lógico** (associando o nome da categoria no campo `produtos.categoria` do tipo `TEXT`), e não físico via chave estrangeira. Isso garante a retrocompatibilidade e a simplicidade de portabilidade do fallback web em localStorage.

---

## 4. Diagrama de Classes
Diagrama contendo modelos de dados (Models) e classes de lógica de negócios (Services) do aplicativo.

```mermaid
classDiagram
    class Usuario {
        +id?: number
        +nome: string
        +usuario: string
        +senha: string
        +perfil: string
    }

    class Cliente {
        +id?: number
        +nome: string
        +cpf_cnpj: string
        +telefone: string
        +email: string
        +endereco: string
    }

    class CategoriaProduto {
        +id?: number
        +nome: string
        +descricao?: string
    }

    class Produto {
        +id?: number
        +nome: string
        +categoria: string
        +preco: number
        +estoque: number
    }

    class Venda {
        +id?: number
        +cliente_id: number
        +cliente_nome?: string
        +data_venda: string
        +total: number
        +status: string
        +itens?: ItemVenda[]
    }

    class ItemVenda {
        +id?: number
        +venda_id?: number
        +produto_id: number
        +produto_nome?: string
        +quantidade: number
        +valor_unitario: number
        +subtotal: number
    }

    class Recebimento {
        +id?: number
        +venda_id: number
        +data_recebimento: string
        +valor: number
        +forma_pagamento: string
        +status: string
    }

    class DatabaseService {
        -sqlite: SQLiteConnection
        -db: SQLiteDBConnection
        -isInitialized: boolean
        -useFallback: boolean
        +initializeDatabase(): Promise~void~
        +isWebFallbackAtivo(): boolean
        +ativarFallbackWeb(): void
        +getConnection(): Promise~SQLiteDBConnection~
        +query(sql: string, params: any[]): Promise~any[]~
        +run(sql: string, params: any[]): Promise~any~
        +buscarUsuarioPorCredenciais(usuario: string, senha: string): Promise~any~
        +saveToStore(): Promise~void~
    }

    class UsuarioService {
        -databaseService: DatabaseService
        +inserir(usuario: Usuario): Promise~number~
        +cadastrar(usuario: Usuario): Promise~number~
        +listar(): Promise~Usuario[]~
        +listarTodos(): Promise~Usuario[]~
        +buscarPorId(id: number): Promise~Usuario|null~
        +atualizar(usuario: Usuario): Promise~void~
        +excluir(id: number): Promise~void~
        +remover(id: number): Promise~void~
        +usuarioExiste(usuario: string): Promise~boolean~
    }

    class CategoriaProdutoService {
        -databaseService: DatabaseService
        +inserir(categoria: CategoriaProduto): Promise~void~
        +listar(): Promise~CategoriaProduto[]~
        +buscarPorId(id: number): Promise~CategoriaProduto|null~
        +atualizar(categoria: CategoriaProduto): Promise~void~
        +excluir(id: number): Promise~void~
        +categoriaExiste(nome: string, excluirId?: number): Promise~boolean~
    }

    class ProdutoService {
        -databaseService: DatabaseService
        +inserir(produto: Produto): Promise~void~
        +cadastrar(produto: Produto): Promise~number~
        +listar(): Promise~Produto[]~
        +listarTodos(): Promise~Produto[]~
        +buscarPorId(id: number): Promise~Produto|null~
        +atualizar(produto: Produto): Promise~void~
        +excluir(id: number): Promise~void~
        +remover(id: number): Promise~void~
        +atualizarEstoque(produtoId: number, novoEstoque: number): Promise~void~
        +verificarEstoque(produtoId: number, quantidade: number): Promise~boolean~
    }

    class ClienteService {
        -databaseService: DatabaseService
        +inserir(cliente: Cliente): Promise~number~
        +cadastrar(cliente: Cliente): Promise~number~
        +listar(): Promise~Cliente[]~
        +listarTodos(): Promise~Cliente[]~
        +buscarPorId(id: number): Promise~Cliente|null~
        +atualizar(cliente: Cliente): Promise~void~
        +excluir(id: number): Promise~void~
        +remover(id: number): Promise~void~
    }

    class VendaService {
        -databaseService: DatabaseService
        -clienteService: ClienteService
        -produtoService: ProdutoService
        -financeiroService: FinanceiroService
        +criar(venda: Venda, itens: ItemVenda[]): Promise~number~
        +criarVenda(venda: Venda, itens: ItemVenda[]): Promise~number~
        +listarVendas(): Promise~Venda[]~
        +listarTodas(): Promise~Venda[]~
        +buscarPorId(id: number): Promise~Venda|null~
        +listarItensPorVenda(vendaId: number): Promise~ItemVenda[]~
        +listarPendentes(): Promise~Venda[]~
        +listarVendasPendentes(): Promise~Venda[]~
        +listarPagas(): Promise~Venda[]~
        +listarVendasPagas(): Promise~Venda[]~
        +calcularTotalVendido(): Promise~number~
        +marcarComoPaga(vendaId: number): Promise~void~
        +remover(id: number): Promise~void~
        +validarEstoque(produto_id: number, quantidade: number): Promise~boolean~
        +calcularTotal(itens: ItemVenda[]): number
    }

    class FinanceiroService {
        -databaseService: DatabaseService
        -vendaService: VendaService
        +gerarRecebimentoPendente(venda_id: number, valor: number): Promise~void~
        +listarRecebimentos(): Promise~Recebimento[]~
        +buscarPorId(id: number): Promise~Recebimento|null~
        +registrarRecebimento(recebimento: Recebimento): Promise~number~
        +listarPorVenda(vendaId: number): Promise~Recebimento[]~
        +listarTodosRecebimentos(): Promise~Recebimento[]~
        +listarRecebimentosPendentes(): Promise~Recebimento[]~
        +listarRecebimentosPagos(): Promise~Recebimento[]~
        +calcularTotalRecebido(): Promise~number~
        +calcularTotalPendente(): Promise~number~
        +remover(id: number): Promise~void~
    }

    UsuarioService --> DatabaseService
    UsuarioService ..> Usuario : manipulates
    CategoriaProdutoService --> DatabaseService
    CategoriaProdutoService ..> CategoriaProduto : manipulates
    ProdutoService --> DatabaseService
    ProdutoService ..> Produto : manipulates
    ClienteService --> DatabaseService
    ClienteService ..> Cliente : manipulates
    VendaService --> DatabaseService
    VendaService --> ClienteService
    VendaService --> ProdutoService
    VendaService --> FinanceiroService
    VendaService ..> Venda : manipulates
    FinanceiroService --> DatabaseService
    FinanceiroService ..> Recebimento : manipulates

    Cliente "1" -- "0..*" Venda : realiza
    Venda "1" -- "1..*" ItemVenda : possui
    ItemVenda "0..*" -- "1" Produto : referencia
    Venda "1" -- "1" Recebimento : gera
    CategoriaProduto "1" -- "0..*" Produto : categoriza
    Produto "1" -- "1" Produto : possui controle de estoque
```

---

## 5. Fluxo de Navegação
Estrutura geral de rotas e navegação entre as telas do sistema.

```mermaid
flowchart TD
    A["Login"] --> B["Home"]
    B --> C["Cadastro"]
    B --> D["Vendas (PDV)"]
    B --> E["Financeiro (Receber)"]
    B --> F["Relatórios"]
    B --> G["Sair → Login"]

    C --> C1["Produtos"]
    C --> C2["Clientes"]
    C --> C3["Usuários"]
    C --> C4["Categorias de Produto"]

    E --> E1["Contas a Receber"]
```

---

## 6. Fluxograma de Login e Criação de Conta
Fluxo de entrada e registro de novos operadores no sistema comercial.

```mermaid
flowchart TD
    Start["Entrar no App"] --> Login["Tela de Login"]
    Login --> |"Clicar em Criar conta"| FormCad["Alternar Modo: Form de Cadastro"]
    FormCad --> |"Preencher Nome/Login/Senha/Perfil"| ValidCad{"Validar Campos e Duplicidade"}
    ValidCad -- "Vazio ou Inválido" --> AlertCadErr["alert de Erro"] --> FormCad
    ValidCad -- "Usuário Já Existe" --> AlertDup["alert: Usuário já cadastrado"] --> FormCad
    ValidCad -- "Sucesso" --> InsertCad["INSERT usuarios (SQLite/Fallback)"]
    InsertCad --> AlertSucCad["alert: Conta criada com sucesso"]
    AlertSucCad --> ClearCad["Limpar Campos e Voltar para Login"] --> Login
    Login --> |"Inserir Login/Senha"| Authenticate{"Autenticar com o Banco"}
    Authenticate -- "Inválido" --> AlertErrLogin["alert: Usuário ou senha inválidos"] --> Login
    Authenticate -- "Sucesso" --> Home["Entrar na Home"]
```

---

## 7. Fluxograma de Cadastro Geral
Fluxo geral de cadastros (Usuários, Clientes e Produtos).

```mermaid
flowchart TD
    Start["Home"] --> Cadastro["Módulo de Cadastro"]
    Cadastro --> Menu{"Escolher Opção"}
    
    Menu --> |"Usuários"| CadUsu["Cadastro de Usuários (CRUD)"]
    Menu --> |"Clientes"| CadCli["Cadastro de Clientes (CRUD com Validações)"]
    Menu --> |"Categorias de Produto"| CadCat["Cadastro de Categorias (CRUD com Nome Único)"]
    Menu --> |"Produtos"| CadProd["Cadastro de Produtos"]

    CadProd --> Step1["Cadastrar/Selecionar Categoria"]
    Step1 --> Step2["Informar Dados do Produto"]
    Step2 --> Step3["Informar Preço em R$ (ex: 10,50)"]
    Step3 --> Step4["Informar Estoque"]
    Step4 --> ValFields{"Validar Campos?"}
    
    ValFields -- Não --> AlertErr["Exibir alert() de erro"] --> CadProd
    ValFields -- Sim --> SaveProd["Salvar Produto (SQLite/Fallback)"]
    SaveProd --> ListProd["Listar Produto com Preço formatado"]
```

---

## 8. Fluxo de Cadastro de Categorias de Produto
Módulo de cadastro das categorias selecionáveis.

```mermaid
flowchart TD
    Start["Home"] --> Cadastro["Módulo de Cadastro"]
    Cadastro --> Menu{"Escolher Opção"}
    Menu --> |"Categorias de Produto"| CadCat["Tela de Categorias"]
    CadCat --> InputFields["Informar Nome e Descrição"]
    InputFields --> ValFields{"Validar Nome Preenchido?"}
    ValFields -- Não --> AlertErr["Exibir alert: Nome é obrigatório"] --> CadCat
    ValFields -- Sim --> CheckDup{"Verificar Duplicidade no Banco?"}
    CheckDup -- "Já Existe" --> AlertDup["Exibir alert: Categoria já cadastrada"] --> CadCat
    CheckDup -- "Único" --> SaveCat["Salvar Categoria (SQLite/Fallback)"]
    SaveCat --> ListCat["Listar Categoria na Tela"]
```

---

## 9. Fluxograma de Venda (PDV)
Montagem reativa do carrinho, baixa de itens e integração com contas a receber.

```mermaid
flowchart TD
    Login["Login"] --> Home["Home"]
    Home --> Venda["Tela de Vendas"]
    Venda --> SelCliente["Selecionar Cliente"]
    SelCliente --> SelProd["Selecionar Produto"]
    SelProd --> InfQtd["Informar Quantidade"]
    InfQtd --> ValEst{"Validar Estoque?"}
    ValEst -- Não --> AlertEst["Alert: Estoque Insuficiente"] --> SelProd
    ValEst -- Sim --> AddProd["Adicionar Produto ao Carrinho"]
    AddProd --> CalcSub["Calcular Subtotal do Item"]
    CalcSub --> Loop{"Adicionar mais produtos?"}
    Loop -- Sim --> SelProd
    Loop -- Não --> CalcTotal["Calcular Total Geral da Venda"]
    CalcTotal --> FinVenda["Finalizar Venda"]
    FinVenda --> BaixEst["Baixar Estoque no Banco"]
    FinVenda --> GerReceb["Gerar Recebimento Pendente no Financeiro"]
    GerReceb --> ListVendas["Listar Venda Realizada no Histórico"]
```

---

## 10. Fluxograma de Recebimento
Baixa financeira e liquidação de vendas.

```mermaid
flowchart TD
    Login["Login"] --> Home["Home"]
    Home --> Fin["Módulo Financeiro"]
    Fin --> Receber["Contas a Receber"]
    Receber --> ListPend["Listar Recebimentos Pendentes"]
    ListPend --> SelRec["Selecionar Recebimento"]
    SelRec --> InfForma["Informar Forma de Pagamento"]
    InfForma --> ConfPag["Confirmar Recebimento"]
    ConfPag --> AtuRec["Atualizar Recebimento para Pago/Recebido"]
    AtuRec --> AtuVenda["Atualizar Venda para Paga"]
    AtuVenda --> ListPag["Listar Recebimentos Pagos na aba Recebidos"]
```

---

## 11. Fluxograma de Relatórios
Mapeamento dos relatórios e painéis dinâmicos de resumo.

```mermaid
flowchart TD
    Login["Login"] --> Home["Home"]
    Home --> Relatorios["Módulo de Relatórios"]
    Relatorios --> SelTipo["Selecionar Tipo de Relatório"]
    
    SelTipo --> |"Resumo geral"| QueryRes["Consultar Resumo Geral"]
    SelTipo --> |"Produtos"| QueryProd["Consultar Produtos (Estoque Baixo)"]
    SelTipo --> |"Clientes"| QueryCli["Consultar Clientes"]
    SelTipo --> |"Vendas"| QueryVen["Consultar Vendas (Status)"]
    SelTipo --> |"Recebimentos"| QueryRec["Consultar Recebimentos (Status)"]
    
    QueryRes & QueryProd & QueryCli & QueryVen & QueryRec --> Filter["Aplicar Filtros (Busca / Status)"]
    Filter --> Render["Exibir resultados na tela"]
```
