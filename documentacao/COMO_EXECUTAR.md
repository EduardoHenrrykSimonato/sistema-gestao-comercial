# ▶️ Como Executar o Projeto (Revisado para Entrega Final)

## Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** (v18 ou superior) — [https://nodejs.org](https://nodejs.org)
- **npm** (incluído com Node.js)
- **Ionic CLI** — `npm install -g @ionic/cli`

## Passo a Passo

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/sistema-gestao-comercial.git
cd sistema-gestao-comercial
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar no navegador (desenvolvimento)

```bash
ionic serve
```

O aplicativo será aberto automaticamente em `http://localhost:8100`.

### 4. Credenciais de acesso

| Campo | Valor |
|---|---|
| Usuário | admin |
| Senha | admin123 |

### 5. Criando uma nova conta

Na tela de login, clique em **"Criar nova conta"**. Preencha os campos obrigatórios (Nome Completo, Usuário, Senha, Confirmar Senha e Perfil) e clique em **"Cadastrar Conta"**. Após a criação, utilize o login e senha informados para acessar o sistema.

## Executar em Dispositivo Móvel

### Android

```bash
# Adicionar plataforma Android
ionic capacitor add android

# Sincronizar e abrir no Android Studio
ionic capacitor run android
```

### iOS (apenas macOS)

```bash
# Adicionar plataforma iOS
ionic capacitor add ios

# Sincronizar e abrir no Xcode
ionic capacitor run ios
```

---

## Comandos Úteis

| Comando | Descrição |
|---|---|
| `ionic serve` | Executa no navegador |
| `ionic build` | Gera build de produção |
| `ionic capacitor sync` | Sincroniza com plataformas nativas |
| `npm test` | Executa testes unitários |

---

## Possíveis Problemas

### Execução de Banco de Dados no Navegador (Desenvolvimento)
O SQLite roda nativamente em aparelhos físicos/emuladores móveis. Para desenvolvimento web no navegador (`ionic serve`), o sistema foi dotado de um **Fallback Web funcional baseado em LocalStorage**. Se a inicialização do SQLite ou do WebAssembly (`sql-wasm.wasm`) falhar no navegador (como erros de `LinkError` no Chrome), o sistema ativará automaticamente este fallback. Isso permite testar todos os fluxos de cadastros, vendas e relatórios de forma persistente no navegador.
* **Nota sobre o Login:** Para testes no navegador com `ionic serve`, o login com `admin` / `admin123` (ou qualquer nova conta criada na tela de login) funcionará por meio do fallback web.
* **Nota sobre o sql-wasm.wasm:** O arquivo `sql-wasm.wasm` deve ser servido a partir de `assets/sql-wasm.wasm`.
* **Nota sobre a persistência:** Os dados cadastrados no fallback web são armazenados no `LocalStorage` do navegador, ou seja, permanecem persistidos mesmo que a página seja atualizada (refresh) ou recarregada.

### Erro de porta em uso
Se a porta 8100 estiver em uso, o Ionic vai sugerir outra porta automaticamente.
