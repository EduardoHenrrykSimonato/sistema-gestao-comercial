# 📁 Estrutura do Projeto

## Árvore de Diretórios

```
sistema-gestao-comercial/
├── documentacao/                    # Documentação do projeto
│   ├── README.md
│   ├── HISTORICO_ANTIGRAVITY.md
│   ├── REQUISITOS.md
│   ├── ESTRUTURA_PROJETO.md
│   ├── BANCO_DE_DADOS.md
│   ├── DIAGRAMAS.md
│   ├── TELAS_DO_SISTEMA.md
│   ├── COMO_EXECUTAR.md
│   └── GITHUB.md
├── src/
│   ├── app/
│   │   ├── models/                  # Interfaces/modelos de dados
│   │   │   ├── usuario.model.ts
│   │   │   ├── produto.model.ts
│   │   │   ├── cliente.model.ts
│   │   │   ├── venda.model.ts
│   │   │   ├── item-venda.model.ts
│   │   │   └── recebimento.model.ts
│   │   ├── services/                # Lógica de negócio
│   │   │   ├── database.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── usuario.service.ts
│   │   │   ├── produto.service.ts
│   │   │   ├── cliente.service.ts
│   │   │   ├── venda.service.ts
│   │   │   └── financeiro.service.ts
│   │   ├── pages/                   # Páginas do aplicativo
│   │   │   ├── login/
│   │   │   ├── home/
│   │   │   ├── cadastro/
│   │   │   │   ├── usuarios/
│   │   │   │   ├── produtos/
│   │   │   │   └── clientes/
│   │   │   ├── vendas/
│   │   │   ├── financeiro/
│   │   │   │   └── receber/
│   │   │   └── relatorios/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.routes.ts
│   ├── assets/
│   ├── theme/
│   ├── index.html
│   └── main.ts
├── capacitor.config.ts
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Descrição dos Módulos

### Models (`src/app/models/`)
Interfaces TypeScript que representam as entidades do sistema. Cada interface corresponde a uma tabela no banco SQLite.

### Services (`src/app/services/`)
Classes responsáveis pela lógica de negócio e acesso ao banco de dados.

| Service | Responsabilidade |
|---|---|
| `DatabaseService` | Inicialização do SQLite, criação de tabelas, métodos de acesso (com fallback de emulação em LocalStorage para navegadores) |
| `AuthService` | Autenticação (login/logout) e controle de sessão |
| `UsuarioService` | Lógica de CRUD para usuários vinculada ao banco |
| `ProdutoService` | Lógica de CRUD para produtos e controle de quantidade de estoque |
| `ClienteService` | Lógica de CRUD para clientes vinculada ao banco |
| `VendaService` | Lógica de CRUD para vendas e redução de estoque |
| `FinanceiroService` | Lógica de CRUD para recebimentos de vendas |

### Pages (`src/app/pages/`)
Cada pasta contém 3 arquivos por página:
- `*.page.ts` — Componente (lógica)
- `*.page.html` — Template (visual)
- `*.page.scss` — Estilos (aparência)
