# 📦 Sistema de Gestão Comercial

Aplicativo de Gestão Comercial desenvolvido como atividade acadêmica, utilizando **Ionic**, **Angular**, **TypeScript**, **SQLite** e **Capacitor**.

## 🎯 Funcionalidades

- **Login** — Autenticação de usuários
- **Cadastro** — Produtos, Clientes e Usuários
- **Estoque** — Controle automático de quantidade
- **Vendas** — Registro de vendas com múltiplos produtos
- **Financeiro** — Contas a receber e controle de pagamentos
- **Relatórios** — Visualização de dados do sistema

## 🛠️ Tecnologias

| Tecnologia | Versão |
|---|---|
| Ionic | 8.x |
| Angular | 20.x |
| TypeScript | 5.9 |
| Capacitor | 8.x |
| SQLite | @capacitor-community/sqlite |

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar no navegador
ionic serve

# Executar no Android
ionic capacitor run android

# Executar no iOS
ionic capacitor run ios
```

## 📁 Estrutura do Projeto

```
src/app/
├── models/          # Interfaces TypeScript
├── services/        # Lógica de negócio e acesso a dados
├── pages/           # Páginas do aplicativo
│   ├── login/
│   ├── home/
│   ├── cadastro/
│   │   ├── usuarios/
│   │   ├── produtos/
│   │   └── clientes/
│   ├── vendas/
│   ├── financeiro/
│   │   └── receber/
│   └── relatorios/
```

## 📚 Documentação

A documentação completa está na pasta [documentacao/](documentacao/).

## 👤 Credenciais Padrão

- **Usuário:** admin
- **Senha:** admin123
