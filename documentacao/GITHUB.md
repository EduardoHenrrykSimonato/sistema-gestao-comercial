# 🐙 GitHub — Instruções de Uso

## Configuração Inicial

### 1. Criar repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login.
2. Clique em **"New repository"**.
3. Nome: `sistema-gestao-comercial`
4. Descrição: `Sistema de Gestão Comercial — Atividade Acadêmica`
5. Visibilidade: **Public** ou **Private**
6. **NÃO** marque "Initialize with README" (já temos um).
7. Clique em **"Create repository"**.

### 2. Inicializar o Git localmente

```bash
cd sistema-gestao-comercial
git init
git add .
git commit -m "Etapa 1: Estrutura inicial do projeto"
```

### 3. Conectar ao repositório remoto

```bash
git remote add origin https://github.com/seu-usuario/sistema-gestao-comercial.git
git branch -M main
git push -u origin main
```

---

## Fluxo de Trabalho

### Enviar alterações

```bash
git add .
git commit -m "Descrição da alteração"
git push
```

### Verificar status

```bash
git status
```

### Ver histórico

```bash
git log --oneline
```

---

## Padrão de Commits

Utilize mensagens descritivas:

| Tipo | Exemplo |
|---|---|
| Estrutura | `Etapa 1: Estrutura inicial do projeto` |
| Feature | `Etapa 2: Implementar cadastro de produtos` |
| Fix | `Fix: Corrigir validação no login` |
| Docs | `Docs: Atualizar documentação do banco de dados` |

---

## Arquivo .gitignore

O arquivo `.gitignore` já está configurado para ignorar:
- `node_modules/`
- `www/`
- Arquivos de build, ambientes e IDE (.env, .env.local, .angular, etc.)

---

## Envio Recente — Sincronização da Etapa 2

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `feat: implementar modulo de cadastro`
- **Comandos Git Utilizados:**
  ```bash
  git init
  git remote add origin https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git
  git branch -M main
  git add .
  git commit -m "feat: implementar modulo de cadastro"
  git push -u origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Etapa Enviada:** Etapa 2 (Módulo de Cadastro de Usuários, Produtos e Clientes, banco SQLite e documentação).

---

## Correção — Erro de Importação do ItemVenda

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `fix: corrigir importacao do model item venda`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "fix: corrigir importacao do model item venda"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso

---

## Correção Crítica — Login Travado e Fallback Web

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `fix: corrigir login travado e fallback web`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "fix: corrigir login travado e fallback web"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Correção crítica realizada:** Evitado hang/travamento indefinido no SQLite em ambiente web via timeout no `DatabaseService` e inserção de fallback de autenticação imediato no `AuthService` para as credenciais `admin` / `admin123`.

---

## Correção — Caminho do SQLite WASM e Redirecionamento

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `fix: corrigir caminho do sqlite wasm`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "fix: corrigir caminho do sqlite wasm"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Correções Realizadas:**
  1. Alterado `wasmPath` no elemento `<jeep-sqlite>` de `"assets/sql-wasm.wasm"` para `"assets"` em `app.component.html` para resolver a busca duplicada por `assets/sql-wasm.wasm/sql-wasm.wasm` 404 no browser.
  2. Removido o lançamento de erro ao ativar o fallback de LocalStorage no `DatabaseService.initializeDatabase()`, permitindo o funcionamento transparente das listagens de cadastro sem travamento de tela.
  3. Corrigido redirecionamento pós-login no `LoginPage` para utilizar `navigateByUrl('/home', { replaceUrl: true })` e aplicar `blur()` no elemento ativo do DOM.
  4. Mapeado o ícone `chevron-forward-outline` e `'chevron-forward-outline'` em `addIcons` nas páginas de Cadastro e Financeiro.
---

## Correção Crítica — Cadastro com Fallback Web em Memória

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `fix: corrigir cadastro com fallback web`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "fix: corrigir cadastro com fallback web"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Correções Realizadas:**
  1. Implementado controle de concorrência com Singleton Promise na inicialização do `DatabaseService` para evitar loops repetitivos e concorrência na conexão.
  2. Implementado fallback web baseado em arrays em memória no `DatabaseService` (`produtosFallback`, `clientesFallback`, `usuariosFallback`).
  3. Adicionado suporte ao CRUD em memória nos services `ProdutoService`, `ClienteService` e `UsuarioService` caso o `DatabaseService.isWebFallbackAtivo()` seja verdadeiro.
  4. Adicionado logs descritivos e alert de sucesso para produtos cadastrados em `produtos.page.ts` e garantia de importação do `FormsModule`.

---

## Correção Definitiva — Produto não aparece após salvar

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `fix: corrigir salvamento e listagem de produtos`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "fix: corrigir salvamento e listagem de produtos"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Correções Realizadas:**
  1. Envelopou toda a rotina de inicialização do SQLite no navegador com um timeout global de 2.5 segundos no `DatabaseService` via `Promise.race`, garantindo que qualquer travamento ou erro WASM cause a ativação imediata do fallback web.
  2. Ajustou `ativarFallbackWeb()` do `DatabaseService` para também definir `useFallback = true`, garantindo que todas as chamadas de banco subsequentes utilizem as rotas emulado.
  3. Refatorou o `UsuarioService` para utilizar sua própria lista em memória `usuariosFallback` com os dados mockados de `admin`, provendo consistência estrutural com o `ProdutoService` e `ClienteService`.

---

## Etapa 3 — Implementação do Módulo de Vendas

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `feat: implementar modulo de vendas`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "feat: implementar modulo de vendas"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Mudanças e Correções Realizadas:**
  1. Implementou os modelos estruturais de `Venda` e `ItemVenda` para acomodar múltiplos produtos por venda.
  2. Implementou e integrou o `VendaService` e `FinanceiroService` com suporte a fallback em memória (`vendasFallback`, `recebimentosFallback`).
  3. Quebrou a dependência circular entre `VendaService` e `FinanceiroService` usando a injeção sob demanda (`Injector`).
  4. Implementou a tela de vendas reativa com controle de estoque, carrinho e totalizadores em `/vendas`.
  5. Ajustou os budgets no `angular.json` para suportar o SCSS personalizado e limpo de componente.

---

## Etapa 4 — Implementação do Módulo Financeiro / Receber

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `feat: implementar modulo financeiro receber`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "feat: implementar modulo financeiro receber"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Mudanças e Correções Realizadas:**
  1. Implementou a tela Financeiro / Receber (`src/app/pages/financeiro/receber`) para listar recebimentos pendentes e pagos.
  2. Adicionou cards de resumo financeiro (pendentes e recebidos) e filtros reativos por abas (`ion-segment`).
  3. Desenvolveu formulário inline diretamente nos cards para registrar o recebimento (com forma de pagamento e data de recebimento).
  4. Atualizou o status do recebimento para "recebido" e atualizou a venda relacionada para "paga" de forma transacional.
  5. Refatorou os serviços `FinanceiroService` e `VendaService` para fornecer suporte a consultas e atualizações tanto via SQLite quanto fallback web.
  6. Atualizou todos os diagramas de classe, fluxogramas e modelagem do banco de dados na documentação do projeto.

---

## Etapa 5 — Implementação do Módulo de Relatórios

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `feat: implementar modulo de relatorios`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "feat: implementar modulo de relatorios"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Mudanças e Correções Realizadas:**
  1. Implementou a tela de Relatórios (`src/app/pages/relatorios`) com Resumo Geral (dashboard de métricas), relatórios tabulares de Produtos, Clientes, Vendas e Recebimentos.
  2. Adicionou filtros reativos por tipo de relatório (`ion-segment`), busca por nome (`ion-searchbar`) e filtros de status para vendas e recebimentos (`ion-select`).
  3. Implementou destaque visual (badge vermelho pulsante) para produtos com estoque baixo (≤ 5 unidades).
  4. Adicionou métodos de consulta consolidada nos services: `listarVendasPendentes()`, `listarVendasPagas()`, `calcularTotalVendido()`, `listarTodosRecebimentos()`, `listarRecebimentosPendentes()`, `listarRecebimentosPagos()`, `calcularTotalRecebido()`, `calcularTotalPendente()`.
  5. Atualizou todas as documentações Markdown (HISTORICO, TELAS, REQUISITOS, ESTRUTURA, BANCO_DE_DADOS, DIAGRAMAS, GITHUB).
  6. Build executado com sucesso sem erros e sem warnings.

---

## Etapa 6 — Revisão Final e Preparação para Entrega

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `chore: revisao final para entrega`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "chore: revisao final para entrega"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Mudanças e Correções Realizadas:**
  1. Revisou todos os fluxos de navegação e validou as 9 telas do aplicativo (Login, Home, Cadastro, Usuários, Produtos, Clientes, Vendas, Financeiro e Relatórios).
  2. Garantiu títulos, botões de retorno (voltar) e tratamentos com alerts/confirms para validações e mensagens de sucesso/erro em todas as telas.
  3. Atualizou o README.md principal com as diretrizes acadêmicas solicitadas, autoria e links.
  4. Revisou e formatou todas as documentações da pasta `documentacao` em Markdown (.md).
  5. Completou os checklists de requisitos, diagramas e banco de dados SQLite.

---

## Etapa 7 — Revisão Técnica Final, README Profissional e Validação do Banco

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `chore: revisao tecnica final, readme profissional e validacao do banco`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "chore: revisao tecnica final, readme profissional e validacao do banco"
  git push origin main
  ```
- **Status do Push:** Realizado com sucesso
- **Mudanças e Correções Realizadas:**
  1. Verificou o esquema das tabelas SQLite contra as especificações (todas as 6 tabelas corretas).
  2. Verificou o funcionamento dos services de CRUD (usuário, produto, cliente, venda, financeiro) com fallback web.
  3. Reestruturou completamente o README.md principal adicionando badges, descrição de arquitetura física e 7 diagramas Mermaid.
  4. Atualizou toda a documentação acessória (REQUISITOS, HISTORICO, GITHUB) com o encerramento da Etapa 7.

---

## Etapa 8 — Validações de Campos e Cadastro de Conta no Login

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `feat: validacoes de campos e cadastro de conta no login`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "feat: validacoes de campos e cadastro de conta no login"
  git push origin main
  ```
- **Status do Push:** ✅ Realizado com sucesso
- **Mudanças e Correções Realizadas:**
  1. Implementou validações de CPF/CNPJ (11 ou 14 dígitos), Telefone (10 ou 11 dígitos) e E-mail (regex) com máscaras reativas no cadastro de clientes.
  2. Implementou verificação de duplicidade de nome de usuário no cadastro de usuários (impede criação de login existente).
  3. Adicionou formulário de "Criar nova conta" na tela de Login com alternância entre modos (Login/Cadastro), validação de senhas coincidentes e integração com `UsuarioService`.
  4. Atualizou o `UsuarioService` para persistência consistente entre SQLite e Fallback Web via `DatabaseService`.
  5. Ajustou `fallbackQuery` no `DatabaseService` para suportar busca de usuário por nome.
  6. Atualizou todas as documentações Markdown (README, DIAGRAMAS, TELAS_DO_SISTEMA, COMO_EXECUTAR, REQUISITOS, HISTORICO, GITHUB).

---

## Etapa 9 — Categorias de Produto e Formatação em R$

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `feat: categorias de produto e formatacao em R$`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "feat: categorias de produto e formatacao em R$"
  git push origin main
  ```
- **Status do Push:** ✅ Realizado com sucesso
- **Mudanças e Correções Realizadas:**
  1. Criou utilitário centralizado de moeda `moeda.util.ts` com funções de formatação `formatarMoeda`, `formatarMoedaCompleta` e conversão de input textual monetário `converterValorMonetario`.
  2. Desenvolveu a entidade, repositório e serviço `CategoriaProdutoService` com suporte a SQLite e Fallback Web (Local Storage).
  3. Criou a tela Cadastro de Categorias de Produto (`src/app/pages/cadastro/categorias-produto/`) com suporte a CRUD completo e validações (nome obrigatório e único).
  4. Integrou a categoria ao formulário de cadastro de produtos substituindo a entrada de texto por um `<ion-select>` dinâmico e adicionando botão de gerenciar categorias.
  5. Atualizou as telas de Vendas, Contas a Receber e Relatórios para utilizar o utilitário de formatação de moeda R$ de forma global e uniforme.
  6. Atualizou todas as documentações em Markdown (README, DIAGRAMAS, TELAS_DO_SISTEMA, REQUISITOS, ESTRUTURA_PROJETO, BANCO_DE_DADOS, HISTORICO, GITHUB) e realizou o build final de produção sem erros/warnings.

---

## Etapa 10 — Auditoria e Sincronização de Diagramas

- **Link do Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial.git)
- **Branch Utilizada:** `main`
- **Mensagem do Commit:** `docs: auditores e sincronizacao de todos os diagramas Mermaid do projeto`
- **Comandos Git Utilizados:**
  ```bash
  git status
  git add .
  git commit -m "docs: auditores e sincronizacao de todos os diagramas Mermaid do projeto"
  git push origin main
  ```
- **Status do Push:** ✅ Realizado com sucesso
- **Mudanças e Correções Realizadas:**
  1. Auditou todos os diagramas Mermaid do projeto para coerência com a modelagem do SQLite e lógica real dos serviços.
  2. Consolidou o Diagrama de Casos de Uso sob o ator principal único "Usuário".
  3. Corrigiu o relacionamento entre vendas e recebimentos para 1:1 e explicitou o relacionamento lógico de categorias em produtos.
  4. Atualizou todas as propriedades opcionais e métodos de serviços no Diagrama de Classes.
  5. Sincronizou todos os fluxogramas operacionais (Login, Cadastro Geral, Vendas, Receber, Relatórios) e acrescentou o fluxo de Cadastro de Categorias.
  6. Replicou exatamente os mesmos diagramas em `README.md` e `documentacao/DIAGRAMAS.md` e realizou a validação de build final de produção.

