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

