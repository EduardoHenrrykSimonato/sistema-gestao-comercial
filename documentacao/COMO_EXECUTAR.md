# ▶️ Como Executar o Projeto

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

---

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
O SQLite roda nativamente em aparelhos físicos/emuladores móveis. Para desenvolvimento web no browser (`ionic serve`), o sistema foi dotado de um **Fallback em Memória funcional**. Se a inicialização do SQLite ou do WebAssembly (`sql-wasm.wasm`) falhar no navegador (como erros de `LinkError` no Chrome), o sistema ativará automaticamente os arrays em memória. Isso elimina problemas de carregamento/linkagem de dependências Wasm e permite testar todo o CRUD do fluxo de cadastro imediatamente no navegador.
* **Nota sobre o Login:** Para testes no navegador com `ionic serve`, o login com `admin` / `admin123` sempre funcionará por meio do fallback web.
* **Nota sobre o sql-wasm.wasm:** O arquivo `sql-wasm.wasm` deve ser servido a partir de `assets/sql-wasm.wasm`.
* **Nota sobre os dados em memória:** Em caso de uso de fallback em memória para os testes acadêmicos, lembre-se de que os dados cadastrados em memória são perdidos ao atualizar a página (refresh) no navegador.

### Erro de porta em uso
Se a porta 8100 estiver em uso, o Ionic vai sugerir outra porta automaticamente.
