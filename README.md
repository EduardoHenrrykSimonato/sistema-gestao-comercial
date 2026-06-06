# 📦 Sistema de Gestão Comercial

Aplicativo de Gestão Comercial móvel e web desenvolvido como atividade acadêmica para fins de consolidação das etapas de aprendizagem prática.

- **Autor:** Eduardo Henrryk Simonato
- **Repositório:** [https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial](https://github.com/EduardoHenrrykSimonato/sistema-gestao-comercial)
- **Status do Projeto:** ✅ Concluído (Todas as Etapas 1 a 6 implementadas e revisadas)

---

## 🎯 Objetivo e Descrição Geral

O projeto consiste em um sistema comercial simplificado de PDV (Ponto de Venda) e controle interno. O objetivo é permitir que pequenos estabelecimentos ou profissionais gerenciem seus usuários internos, produtos, clientes, efetuem vendas de múltiplos produtos com baixa automática de estoque, acompanhem recebimentos de pagamentos de forma simplificada no financeiro e gerem estatísticas e relatórios em tempo real.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade / Detalhes |
|---|---|
| **Ionic 8** | Framework de interface para componentes reativos híbridos e mobile-friendly |
| **Angular 20** | Framework SPA principal para modularização, roteamento e injeção de dependências |
| **TypeScript 5.9** | Linguagem para tipagem estática e lógica dos serviços e componentes |
| **Capacitor 8** | Bridge nativa para empacotamento em plataformas móveis (Android/iOS) |
| **SQLite (@capacitor-community/sqlite)** | Banco de dados local relacional para persistência nativa |
| **Fallback Web em Memória** | Mecanismo automático para permitir testes e execução completos diretamente no navegador |

---

## 🚀 Funcionalidades Principais

1. **Autenticação (Login):** Validação de credenciais e controle de sessão ativa.
2. **Cadastro Geral (CRUD):** 
   - Usuários (com perfis Administrador / Operador).
   - Clientes (com dados de contato e documento CPF/CNPJ).
   - Produtos (com preço de venda e quantidade de estoque inicial).
3. **Controle de Estoque:** Redução automática na finalização de vendas e alertas visuais de estoque baixo (<= 5 unidades).
4. **Módulo de Venda:** Carrinho reativo que aceita múltiplos produtos, calcula subtotais e totais, valida e desconta estoque, e gera recebimento financeiro correspondente.
5. **Financeiro / Receber:** Listagem de faturamento pendente por venda, com opção de registro de recebimento (forma de pagamento e data) e atualização do status da venda para paga.
6. **Painel de Relatórios:** Dashboard consolidado (resumo geral financeiro de caixa e vendas), relatórios filtrados por status, busca por texto unificado e empty states interativos.

---

## 📁 Estrutura de Pastas

```text
sistema-gestao-comercial/
├── documentacao/            # Pasta com toda a documentação Markdown do projeto
├── src/
│   ├── app/
│   │   ├── models/          # Modelos de dados (Interfaces TypeScript)
│   │   ├── services/        # Serviços do Angular (SQLite, Fallback, Lógica)
│   │   ├── pages/           # Telas e componentes visuais do app
│   │   │   ├── login/       # Tela de Autenticação
│   │   │   ├── home/        # Dashboard principal / Menu de navegação
│   │   │   ├── cadastro/    # CRUD de Clientes, Produtos e Usuários
│   │   │   ├── vendas/      # Fluxo de PDV / Carrinho
│   │   │   ├── financeiro/  # Módulo de Contas a Receber
│   │   │   └── relatorios/  # Módulo de Relatórios e Métricas
```

---

## 💾 Persistência de Dados e Fallback Web

- **SQLite:** Banco de dados relacional oficial utilizado ao executar o aplicativo no celular ou emuladores através do Capacitor.
- **Fallback Web:** Quando executado no navegador (`ionic serve`), o sistema detecta que a plataforma é web e direciona as consultas para uma estrutura de arrays reativos em memória, eliminando a dependência de drivers nativos e permitindo a simulação completa de todos os fluxos.

---

## ⚙️ Instalação e Execução

### Pré-requisitos
Instale o **Node.js (v18+)**, o **npm** e, globalmente, o Ionic CLI:
```bash
npm install -g @ionic/cli
```

### Instalar dependências
```bash
npm install
```

### Executar no Navegador (Modo Desenvolvimento)
```bash
ionic serve
```
Acesse `http://localhost:8100` para testar no navegador.

### Compilar e Build (Produção)
```bash
ionic build
```

---

## 👤 Credenciais de Acesso Padrão

Para acessar o sistema em qualquer ambiente (SQLite ou Fallback Web), utilize:

- **Usuário:** `admin`
- **Senha:** `admin123`
