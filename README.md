# 📦 Sistema de Gestão Comercial

[![Ionic](https://img.shields.io/badge/Ionic-8.0-blue.svg?logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-20.0-red.svg?logo=angular&logoColor=white)](https://angular.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen.svg)](#)

Aplicativo híbrido móvel e web de **Gestão Comercial** desenvolvido como atividade acadêmica para fins de consolidação de práticas de desenvolvimento SPA e persistência local.

---

## 👥 Autoria e Repositório
* **Autor:** Eduardo Henrryk Simonato
* **Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial)
* **Status do Projeto:** ✅ Concluído (Todas as Etapas 1 a 7 implementadas, testadas e revisadas)

---

## 🎯 Objetivo e Descrição Geral
O projeto consiste em um sistema comercial simplificado de **Ponto de Venda (PDV)** e controle administrativo interno. Permite que pequenos estabelecimentos gerenciem usuários internos (com diferentes perfis de acesso), controlem o estoque de produtos, mantenham cadastros de clientes, realizem vendas com múltiplos itens (com baixa de estoque em tempo real), gerenciem o fluxo financeiro de contas a receber e visualizem um painel dinâmico de relatórios e métricas.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade / Detalhes |
|---|---|
| **Ionic 8** | Framework UI para criação de componentes nativos híbridos e mobile-friendly com design Dark Premium. |
| **Angular 20** | Framework SPA principal utilizando estrutura Standalone para melhor desempenho e injeção de dependências limpa. |
| **TypeScript 5.9** | Linguagem para tipagem estática e lógica dos serviços e componentes. |
| **Capacitor 8** | Bridge nativa para empacotamento em plataformas móveis (Android/iOS). |
| **SQLite (@capacitor-community/sqlite)** | Banco de dados local relacional para persistência nativa oficial. |
| **Fallback Web (LocalStorage/Memória)** | Mecanismo automático de desvio para permitir simulação e testes de todos os fluxos e CRUDs no navegador sem travar a aplicação. |

---

## 🏗️ Arquitetura do Sistema

O sistema foi estruturado seguindo o padrão de **Services Centralizados** e **Views Reativas**. Toda a manipulação de dados é feita por serviços especializados injetados nas páginas Angular, isolando a lógica de negócios da camada de apresentação. A persistência local se apoia no `DatabaseService`, que expõe os wrappers de execução SQL do SQLite ou redireciona as transações para a emulação em memória/localstorage se detectada a plataforma web.

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
    LoginView --> AuthService
    HomeView --> AuthService
    CadastroView --> UsuarioService & ProdutoService & ClienteService
    VendasView --> VendaService & ClienteService & ProdutoService
    FinanceiroView --> FinanceiroService
    RelatoriosView --> VendaService & FinanceiroService & ProdutoService & ClienteService

    %% Relações de Serviços com Database
    AuthService --> DatabaseService
    UsuarioService --> DatabaseService
    ProdutoService --> DatabaseService
    ClienteService --> DatabaseService
    VendaService --> DatabaseService
    FinanceiroService --> DatabaseService

    %% Relações de Database com drivers
    DatabaseService --> SQLite
    DatabaseService --> FallbackWeb
```

---

## 📊 Diagramas do Sistema

### 1. Diagrama de Casos de Uso
Define os atores e o escopo de suas respectivas interações dentro do sistema de gestão comercial.

```mermaid
flowchart LR
    subgraph Atores
        Admin["👤 Administrador"]
        Op["👤 Operador"]
    end

    subgraph Sistema ["Gestão Comercial"]
        UC_Login(("Login"))
        UC_CadUsu(("Cadastrar Usuários"))
        UC_CadProd(("Cadastrar Produtos"))
        UC_CadCli(("Cadastrar Clientes"))
        UC_Venda(("Registrar Vendas"))
        UC_Receber(("Controlar Recebimentos"))
        UC_Relat(("Consultar Relatórios"))
    end

    Admin --> UC_Login
    Admin --> UC_CadUsu
    Admin --> UC_CadProd
    Admin --> UC_CadCli
    Admin --> UC_Venda
    Admin --> UC_Receber
    Admin --> UC_Relat

    Op --> UC_Login
    Op --> UC_CadCli
    Op --> UC_Venda
```

### 2. Diagrama Entidade-Relacionamento (ER)
Modelagem lógica do banco de dados relacional que armazena os dados do aplicativo.

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

### 3. Diagrama de Classes (Serviços e Dependências)
Estrutura de métodos e atributos expostos pelas classes de serviços principais.

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
        +isWebFallbackAtivo()
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
        +listarItensPorVenda(venda_id)
        +validarEstoque(produto_id, quantidade)
        +marcarComoPaga(vendaId)
    }

    class FinanceiroService {
        -databaseService: DatabaseService
        +gerarRecebimentoPendente(venda_id, valor)
        +listarRecebimentos()
        +listarTodosRecebimentos()
        +listarRecebimentosPendentes()
        +listarRecebimentosPagos()
        +registrarRecebimento(recebimento)
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
```

### 4. Fluxo de Navegação de Telas
Mapeamento de rotas e fluxo geral de transições do aplicativo móvel/web.

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
```

### 5. Fluxo de Negócio — Registro de Vendas e Estoque
Processamento reativo desde a montagem do carrinho de compras até a baixa automática de estoque.

```mermaid
flowchart TD
    Venda["Entrar em Vendas"] --> SelCliente["Selecionar Cliente"]
    SelCliente --> SelProd["Selecionar Produto"]
    SelProd --> InfQtd["Informar Quantidade"]
    InfQtd --> ValEst{"Estoque Disponível?"}
    ValEst -- Sim --> AddProd["Adicionar ao Carrinho"]
    ValEst -- Não --> AlertEst["Alert: Estoque Insuficiente"] --> InfQtd
    AddProd --> CalcTotal["Calcular Subtotais e Total Geral"]
    CalcTotal --> Loop{"Mais itens?"}
    Loop -- Sim --> SelProd
    Loop -- Não --> FinVenda["Finalizar Venda"]
    FinVenda --> BaixEst["UPDATE produtos SET estoque = estoque - Qtd"]
    FinVenda --> GerReceb["INSERT recebimentos (Status: pendente)"]
    GerReceb --> AlertSuc["Alert: Venda finalizada!"]
    AlertSuc --> Clear["Limpar Carrinho e Atualizar View"]
```

### 6. Fluxo de Negócio — Confirmação Financeira (Receber)
Processo de liquidação de contas a receber e alteração de status da transação de forma coordenada.

```mermaid
flowchart TD
    Fin["Entrar em Financeiro"] --> Receber["Listar Recebimentos Pendentes"]
    Receber --> SelRec["Registrar Pagamento"]
    SelRec --> FormPag["Exibir Formulário Inline"]
    FormPag --> InfForma["Selecionar Forma de Pagamento"]
    InfForma --> InfData["Selecionar Data de Recebimento"]
    InfData --> ConfPag["Confirmar Pagamento"]
    ConfPag --> AtuRec["UPDATE recebimentos SET status = 'recebido'"]
    AtuRec --> AtuVenda["UPDATE vendas SET status = 'paga'"]
    AtuVenda --> AlertSuc["Alert: Recebimento registrado!"]
    AlertSuc --> Reload["Recarregar abas Pendentes e Recebidos"]
```

### 7. Fluxo de Negócio — Painel de Relatórios
Coleta de faturamento, estoque baixo e relatórios operacionais consolidados.

```mermaid
flowchart TD
    Relatorios["Entrar em Relatórios"] --> SelTipo["Selecionar Aba de Relatório"]
    SelTipo --> ResumoGeral["Resumo Geral: Totalizadores Financeiros e de Cadastro"]
    SelTipo --> RelProdutos["Produtos: Destaque de Estoque Baixo (<= 5)"]
    SelTipo --> RelClientes["Clientes: Listagem de Contatos"]
    SelTipo --> RelVendas["Vendas: Faturamento filtrado por Pagas/Pendentes"]
    SelTipo --> RelReceber["Recebimentos: Fluxos de Caixa por Status e Formas de Pagamento"]
    ResumoGeral & RelProdutos & RelClientes & RelVendas & RelReceber --> Filter["Buscar por Texto (Nome/Categoria/Cliente)"]
    Filter --> Render["Renderizar Tabelas e Empty States interativos"]
```

---

## 🗄️ Detalhes do Banco de Dados SQLite

O banco oficial de persistência local chama-se **`gestao_comercial_db`**. Ele é composto por 6 tabelas principais:

1. **`usuarios`**: Contém registros cadastrais dos operadores e administradores do sistema.
2. **`clientes`**: Armazena informações dos clientes para faturamento das vendas.
3. **`produtos`**: Registra itens em estoque, preço unitário e categoria.
4. **`vendas`**: Cabeçalho de vendas, registrando data, total e status.
5. **`itens_venda`**: Registra a associação N:N entre vendas e produtos, armazenando quantidade, valor unitário cobrado e subtotal.
6. **`recebimentos`**: Controla o fluxo de caixa a receber gerado automaticamente por cada venda.

---

## ⚙️ Instalação e Execução

### Pré-requisitos
Certifique-se de possuir o **Node.js (v18+)**, o gerenciador **npm** instalados, e instale o Ionic CLI globalmente:
```bash
npm install -g @ionic/cli
```

### Instalar dependências do projeto
```bash
npm install
```

### Executar no Navegador (Modo Desenvolvimento / Fallback Web)
```bash
ionic serve
```
Acesse `http://localhost:8100` no seu navegador. O console registrará a ativação do fallback de banco caso o driver nativo SQLite do Capacitor não esteja presente (comum no browser).

### Compilar e Build (Produção)
Para rodar a compilação completa do Angular e gerar o pacote pronto para deploy/distribuição móvel:
```bash
ionic build
```

---

## 👤 Credenciais de Acesso Padrão

Para realizar o login inicial e testar as funcionalidades do sistema:

* **Usuário:** `admin`
* **Senha:** `admin123`
