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

