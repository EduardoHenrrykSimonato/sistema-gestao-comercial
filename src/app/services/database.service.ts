import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;
  private isInitialized = false;
  private useFallback = false;
  private readonly DB_NAME = 'gestao_comercial_db';

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  /**
   * Inicializa o banco de dados SQLite.
   * Cria as tabelas e insere dados padrão se necessário.
   */
  async initializeDatabase(): Promise<void> {
    if (this.isInitialized) {
      console.log('Banco já está inicializado.');
      console.log('Banco inicializado');
      return;
    }

    try {
      const platform = Capacitor.getPlatform();
      console.log('Iniciando inicialização do banco. Plataforma:', platform);

      // Para web, inicializa o jeep-sqlite
      if (platform === 'web') {
        console.log('Plataforma Web detectada. Inicializando jeep-sqlite...');
        // Configura timeout de 2 segundos para o web store não travar se o jeep-sqlite falhar
        const initWebPromise = this.initWebStore();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout ao inicializar jeep-sqlite')), 2000)
        );
        await Promise.race([initWebPromise, timeoutPromise]);
        console.log('jeep-sqlite inicializado.');
      }

      console.log('Verificando consistência de conexões...');
      const retCC = (await this.sqlite.checkConnectionsConsistency()).result;
      console.log('Consistência verificada:', retCC);

      console.log('Verificando se conexão existe...');
      const isConnection = (await this.sqlite.isConnection(this.DB_NAME, false)).result;
      console.log('Conexão existe:', isConnection);

      if (retCC && isConnection) {
        console.log('Recuperando conexão existente...');
        this.db = await this.sqlite.retrieveConnection(this.DB_NAME, false);
      } else {
        console.log('Criando nova conexão...');
        this.db = await this.sqlite.createConnection(
          this.DB_NAME,
          false,
          'no-encryption',
          1,
          false
        );
      }

      console.log('Abrindo conexão com o banco...');
      await this.db.open();
      console.log('Conexão aberta com sucesso.');

      console.log('Criando tabelas...');
      await this.createTables();
      console.log('Tabelas verificadas/criadas.');

      console.log('Inserindo dados padrão (se necessário)...');
      await this.seedDefaultData();
      console.log('Dados padrão verificados/inseridos.');

      this.isInitialized = true;
      this.useFallback = false;
      console.log('Banco inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar o banco de dados SQLite:', error);
      console.log('Ativando fallback de banco de dados em LocalStorage...');
      
      this.useFallback = true;
      this.isInitialized = true;
      
      try {
        this.initFallbackDb();
      } catch (fallbackError) {
        console.error('Erro ao inicializar o fallback de banco:', fallbackError);
      }

      console.log('Banco inicializado');
      // Lança erro controlado para que o AuthService saiba que o SQLite falhou
      throw new Error('SQLite não disponível. Fallback ativado.');
    }
  }

  /**
   * Inicializa o web store do jeep-sqlite para uso no browser.
   */
  private async initWebStore(): Promise<void> {
    try {
      await this.sqlite.initWebStore();
    } catch (error) {
      console.error('Erro ao inicializar o web store:', error);
    }
  }

  /**
   * Cria todas as tabelas do sistema.
   */
  private async createTables(): Promise<void> {
    const createTableStatements = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        usuario TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        perfil TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf_cnpj TEXT,
        telefone TEXT,
        email TEXT,
        endereco TEXT
      );

      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        categoria TEXT,
        preco REAL NOT NULL,
        estoque INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        data_venda TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      );

      CREATE TABLE IF NOT EXISTS itens_venda (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        valor_unitario REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (venda_id) REFERENCES vendas(id),
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
      );

      CREATE TABLE IF NOT EXISTS recebimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER NOT NULL,
        data_recebimento TEXT NOT NULL,
        valor REAL NOT NULL,
        forma_pagamento TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (venda_id) REFERENCES vendas(id)
      );
    `;

    await this.db.execute(createTableStatements);
    console.log('📋 Tabelas criadas com sucesso!');
  }

  /**
   * Insere dados padrão no banco (usuário admin).
   */
  private async seedDefaultData(): Promise<void> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM usuarios');
    const count = result.values?.[0]?.count || 0;

    if (count === 0) {
      await this.db.run(
        `INSERT INTO usuarios (nome, usuario, senha, perfil) VALUES (?, ?, ?, ?)`,
        ['Administrador', 'admin', 'admin123', 'Administrador']
      );
      console.log('👤 Usuário admin padrão criado!');
    }
  }

  /**
   * Inicializa o banco fallback em LocalStorage.
   */
  private initFallbackDb(): void {
    const usuariosKey = 'fallback_db_usuarios';
    const existingUsuarios = localStorage.getItem(usuariosKey);
    if (!existingUsuarios) {
      const defaultUsuarios = [
        {
          id: 1,
          nome: 'Administrador',
          usuario: 'admin',
          senha: 'admin123',
          perfil: 'Administrador'
        }
      ];
      localStorage.setItem(usuariosKey, JSON.stringify(defaultUsuarios));
    }

    const tables = ['clientes', 'produtos', 'vendas', 'itens_venda', 'recebimentos'];
    for (const table of tables) {
      const key = `fallback_db_${table}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    }
    console.log('⚠️ Fallback LocalStorage Database inicializado para desenvolvimento web');
  }

  private getFallbackTable(table: string): any[] {
    const key = `fallback_db_${table}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveFallbackTable(table: string, data: any[]): void {
    const key = `fallback_db_${table}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  private fallbackQuery(sql: string, params: any[]): any[] {
    const normalizedSql = sql.toLowerCase().trim();

    if (normalizedSql.includes('from usuarios')) {
      const list = this.getFallbackTable('usuarios');
      if (normalizedSql.includes('usuario = ? and senha = ?')) {
        return list.filter(u => u.usuario === params[0] && u.senha === params[1]);
      }
      if (normalizedSql.includes('id = ?')) {
        return list.filter(u => u.id === Number(params[0]));
      }
      if (normalizedSql.includes('order by nome')) {
        return [...list].sort((a, b) => a.nome.localeCompare(b.nome));
      }
      return list;
    }

    if (normalizedSql.includes('from clientes')) {
      const list = this.getFallbackTable('clientes');
      if (normalizedSql.includes('id = ?')) {
        return list.filter(c => c.id === Number(params[0]));
      }
      if (normalizedSql.includes('order by nome')) {
        return [...list].sort((a, b) => a.nome.localeCompare(b.nome));
      }
      return list;
    }

    if (normalizedSql.includes('from produtos')) {
      const list = this.getFallbackTable('produtos');
      if (normalizedSql.includes('id = ?')) {
        return list.filter(p => p.id === Number(params[0]));
      }
      if (normalizedSql.includes('order by nome')) {
        return [...list].sort((a, b) => a.nome.localeCompare(b.nome));
      }
      return list;
    }

    if (normalizedSql.includes('from vendas')) {
      const list = this.getFallbackTable('vendas');
      if (normalizedSql.includes('where id = ?') || normalizedSql.includes('where v.id = ?')) {
        const id = Number(params[0]);
        const venda = list.find(v => v.id === id);
        if (venda) {
          const clientes = this.getFallbackTable('clientes');
          const cli = clientes.find(c => c.id === venda.cliente_id);
          return [{ ...venda, cliente_nome: cli ? cli.nome : 'Cliente Desconhecido' }];
        }
        return [];
      }
      if (normalizedSql.includes('join clientes')) {
        const clientes = this.getFallbackTable('clientes');
        return list.map(v => {
          const cli = clientes.find(c => c.id === v.cliente_id);
          return { ...v, cliente_nome: cli ? cli.nome : 'Cliente Desconhecido' };
        }).sort((a, b) => b.data_venda.localeCompare(a.data_venda));
      }
      return list;
    }

    if (normalizedSql.includes('from itens_venda')) {
      const list = this.getFallbackTable('itens_venda');
      if (normalizedSql.includes('venda_id = ?') || normalizedSql.includes('iv.venda_id = ?')) {
        const vendaId = Number(params[0]);
        const filtered = list.filter(iv => iv.venda_id === vendaId);
        const produtos = this.getFallbackTable('produtos');
        return filtered.map(iv => {
          const prod = produtos.find(p => p.id === iv.produto_id);
          return { ...iv, produto_nome: prod ? prod.nome : 'Produto Desconhecido' };
        });
      }
      return list;
    }

    if (normalizedSql.includes('from recebimentos')) {
      const list = this.getFallbackTable('recebimentos');
      if (normalizedSql.includes('join vendas')) {
        const vendas = this.getFallbackTable('vendas');
        const clientes = this.getFallbackTable('clientes');
        return list.map(r => {
          const v = vendas.find(venda => venda.id === r.venda_id);
          const cli = v ? clientes.find(c => c.id === v.cliente_id) : null;
          return {
            ...r,
            venda_total: v ? v.total : 0,
            cliente_nome: cli ? cli.nome : 'Cliente Desconhecido'
          };
        }).sort((a, b) => b.data_recebimento.localeCompare(a.data_recebimento));
      }
      return list;
    }

    return [];
  }

  private fallbackRun(sql: string, params: any[]): { lastId: number; changes: number } {
    const normalizedSql = sql.toLowerCase().trim();

    if (normalizedSql.startsWith('insert into')) {
      const match = sql.match(/insert\s+into\s+(\w+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
      if (match) {
        const table = match[1].trim();
        const cols = match[2].split(',').map(c => c.trim());
        const list = this.getFallbackTable(table);
        const lastId = list.length > 0 ? Math.max(...list.map(item => item.id || 0)) + 1 : 1;

        const newItem: any = { id: lastId };
        cols.forEach((col, idx) => {
          newItem[col] = params[idx];
        });

        list.push(newItem);
        this.saveFallbackTable(table, list);
        return { lastId, changes: 1 };
      }
    }

    if (normalizedSql.startsWith('update')) {
      if (normalizedSql.includes('update produtos set estoque = estoque - ?')) {
        const list = this.getFallbackTable('produtos');
        const qty = Number(params[0]);
        const id = Number(params[1]);
        const index = list.findIndex(item => item.id === id);
        if (index !== -1) {
          list[index].estoque = (list[index].estoque || 0) - qty;
          this.saveFallbackTable('produtos', list);
          return { lastId: 0, changes: 1 };
        }
      }

      if (normalizedSql.includes('update produtos set estoque = estoque + ?')) {
        const list = this.getFallbackTable('produtos');
        const qty = Number(params[0]);
        const id = Number(params[1]);
        const index = list.findIndex(item => item.id === id);
        if (index !== -1) {
          list[index].estoque = (list[index].estoque || 0) + qty;
          this.saveFallbackTable('produtos', list);
          return { lastId: 0, changes: 1 };
        }
      }

      const match = sql.match(/update\s+(\w+)\s+set\s+(.+?)\s+where\s+id\s*=\s*\?/i);
      if (match) {
        const table = match[1].trim();
        const setClause = match[2];
        const list = this.getFallbackTable(table);
        const id = Number(params[params.length - 1]);
        const index = list.findIndex(item => item.id === id);

        if (index !== -1) {
          const cols = setClause.split(',').map(part => part.split('=')[0].trim());
          cols.forEach((col, idx) => {
            list[index][col] = params[idx];
          });
          this.saveFallbackTable(table, list);
          return { lastId: 0, changes: 1 };
        }
      }
    }

    if (normalizedSql.startsWith('delete from')) {
      const match = sql.match(/delete\s+from\s+(\w+)\s+where\s+(?:venda_id|id)\s*=\s*\?/i);
      if (match) {
        const table = match[1].trim();
        const list = this.getFallbackTable(table);
        const id = Number(params[0]);

        let filteredList;
        if (sql.includes('venda_id')) {
          filteredList = list.filter(item => item.venda_id !== id);
        } else {
          filteredList = list.filter(item => item.id !== id);
        }

        const changes = list.length - filteredList.length;
        this.saveFallbackTable(table, filteredList);
        return { lastId: 0, changes };
      }
    }

    return { lastId: 0, changes: 0 };
  }

  /**
   * Retorna a conexão com o banco de dados.
   * Garante que o banco foi inicializado antes de retornar.
   */
  async getConnection(): Promise<SQLiteDBConnection> {
    if (!this.isInitialized) {
      await this.initializeDatabase();
    }
    return this.db;
  }

  /**
   * Executa uma query SELECT e retorna os resultados.
   */
  async query(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.isInitialized) {
      await this.initializeDatabase();
    }
    if (this.useFallback) {
      return this.fallbackQuery(sql, params);
    }
    const db = this.db;
    const result = await db.query(sql, params);
    return result.values || [];
  }

  /**
   * Executa uma query INSERT, UPDATE ou DELETE.
   * Retorna o resultado com lastId e changes.
   */
  async run(sql: string, params: any[] = []): Promise<{ lastId: number; changes: number }> {
    if (!this.isInitialized) {
      await this.initializeDatabase();
    }
    if (this.useFallback) {
      return this.fallbackRun(sql, params);
    }
    const db = this.db;
    const result = await db.run(sql, params);
    return {
      lastId: result.changes?.lastId || 0,
      changes: result.changes?.changes || 0
    };
  }

  /**
   * Busca um usuário por credenciais de usuário e senha.
   */
  async buscarUsuarioPorCredenciais(usuario: string, senha: string): Promise<any> {
    try {
      console.log('Buscando usuário por credenciais no banco:', usuario);
      const result = await this.query(
        'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?',
        [usuario, senha]
      );
      if (result && result.length > 0) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário por credenciais:', error);
      return null;
    }
  }

  /**
   * Salva o banco no web store (necessário para web).
   */
  async saveToStore(): Promise<void> {
    if (this.useFallback) {
      return;
    }
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      await this.sqlite.saveToStore(this.DB_NAME);
    }
  }
}
