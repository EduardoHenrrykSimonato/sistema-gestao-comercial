import { Injectable, Injector } from '@angular/core';
import { DatabaseService } from './database.service';
import { Venda } from '../models/venda.model';
import { ItemVenda } from '../models/item-venda.model';
import { ClienteService } from './cliente.service';
import { ProdutoService } from './produto.service';
import { FinanceiroService } from './financeiro.service';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  private vendasFallback: Venda[] = [];
  private itensVendaFallback: ItemVenda[] = [];
  private proximoId = 1;
  private proximoItemId = 1;

  private financeiroService!: FinanceiroService;

  constructor(
    private databaseService: DatabaseService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private injector: Injector
  ) {}

  private getFinanceiroService(): FinanceiroService {
    if (!this.financeiroService) {
      this.financeiroService = this.injector.get(FinanceiroService);
    }
    return this.financeiroService;
  }

  /**
   * Valida se o produto possui estoque suficiente.
   */
  async validarEstoque(produto_id: number, quantidade: number): Promise<boolean> {
    const produto = await this.produtoService.buscarPorId(produto_id);
    if (!produto) return false;
    return produto.estoque >= quantidade;
  }

  /**
   * Baixa a quantidade vendida do estoque do produto.
   */
  async baixarEstoque(produto_id: number, quantidade: number): Promise<void> {
    const produto = await this.produtoService.buscarPorId(produto_id);
    if (!produto) return;
    const novoEstoque = produto.estoque - quantidade;
    await this.produtoService.atualizarEstoque(produto_id, novoEstoque);
    console.log(`Estoque do produto ${produto_id} atualizado. Antigo: ${produto.estoque}, Novo: ${novoEstoque}`);
  }

  /**
   * Calcula o total geral somando os subtotais dos itens.
   */
  calcularTotal(itens: ItemVenda[]): number {
    return itens.reduce((sum, item) => sum + item.subtotal, 0);
  }

  /**
   * Cria uma nova venda (Inserir).
   */
  async criar(venda: Venda, itens: ItemVenda[]): Promise<number> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const vendaId = this.proximoId++;
      const novaVenda: Venda = {
        ...venda,
        id: vendaId,
        status: 'pendente'
      };

      this.vendasFallback.push(novaVenda);

      for (const item of itens) {
        const itemId = this.proximoItemId++;
        const novoItem: ItemVenda = {
          ...item,
          id: itemId,
          venda_id: vendaId
        };
        this.itensVendaFallback.push(novoItem);
        
        // Baixa o estoque do produto no fallback
        await this.baixarEstoque(item.produto_id, item.quantidade);
      }

      // Cria recebimento pendente no financeiro
      await this.getFinanceiroService().gerarRecebimentoPendente(vendaId, venda.total);

      console.log('Venda salva no fallback web:', novaVenda);
      return vendaId;
    }

    try {
      // Insere a venda
      const result = await this.databaseService.run(
        'INSERT INTO vendas (cliente_id, data_venda, total, status) VALUES (?, ?, ?, ?)',
        [venda.cliente_id, venda.data_venda, venda.total, 'pendente']
      );

      const vendaId = result.lastId;

      // Insere os itens e baixa o estoque
      for (const item of itens) {
        await this.databaseService.run(
          'INSERT INTO itens_venda (venda_id, produto_id, quantidade, valor_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
          [vendaId, item.produto_id, item.quantidade, item.valor_unitario, item.subtotal]
        );

        // Baixa o estoque
        await this.baixarEstoque(item.produto_id, item.quantidade);
      }

      // Cria recebimento pendente no financeiro
      await this.getFinanceiroService().gerarRecebimentoPendente(vendaId, venda.total);

      return vendaId;
    } catch (error) {
      console.error('Erro ao criar venda no SQLite, ativando fallback:', error);
      this.databaseService.ativarFallbackWeb();

      // Executa fallback
      const vendaId = this.proximoId++;
      const novaVenda: Venda = {
        ...venda,
        id: vendaId,
        status: 'pendente'
      };
      this.vendasFallback.push(novaVenda);

      for (const item of itens) {
        const itemId = this.proximoItemId++;
        const novoItem: ItemVenda = {
          ...item,
          id: itemId,
          venda_id: vendaId
        };
        this.itensVendaFallback.push(novoItem);
        await this.baixarEstoque(item.produto_id, item.quantidade);
      }

      await this.getFinanceiroService().gerarRecebimentoPendente(vendaId, venda.total);
      return vendaId;
    }
  }

  /**
   * Alias de criar para manter retrocompatibilidade e atender o roteiro da etapa.
   */
  async criarVenda(venda: Venda, itens: ItemVenda[]): Promise<number> {
    return await this.criar(venda, itens);
  }

  /**
   * Lista todas as vendas realizadas.
   */
  async listarVendas(): Promise<Venda[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const list: Venda[] = [];
      for (const v of this.vendasFallback) {
        const cli = await this.clienteService.buscarPorId(v.cliente_id);
        const itens = await this.listarItensPorVenda(v.id!);
        list.push({
          ...v,
          cliente_nome: cli ? cli.nome : 'Cliente Desconhecido',
          itens
        });
      }
      return list.sort((a, b) => b.data_venda.localeCompare(a.data_venda));
    }

    try {
      const sales = await this.databaseService.query(
        `SELECT v.*, c.nome as cliente_nome
         FROM vendas v
         INNER JOIN clientes c ON v.cliente_id = c.id
         ORDER BY v.data_venda DESC`
      ) as Venda[];

      for (const sale of sales) {
        sale.itens = await this.listarItensPorVenda(sale.id!);
      }
      return sales;
    } catch (error) {
      console.error('Erro ao listar vendas no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();

      const list: Venda[] = [];
      for (const v of this.vendasFallback) {
        const cli = await this.clienteService.buscarPorId(v.cliente_id);
        const itens = await this.listarItensPorVenda(v.id!);
        list.push({
          ...v,
          cliente_nome: cli ? cli.nome : 'Cliente Desconhecido',
          itens
        });
      }
      return list.sort((a, b) => b.data_venda.localeCompare(a.data_venda));
    }
  }

  /**
   * Alias para listarTodas para manter retrocompatibilidade.
   */
  async listarTodas(): Promise<Venda[]> {
    return await this.listarVendas();
  }

  /**
   * Busca uma venda pelo ID com seus itens.
   */
  async buscarPorId(id: number): Promise<Venda | null> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const venda = this.vendasFallback.find(v => v.id === id);
      if (!venda) return null;
      const cli = await this.clienteService.buscarPorId(venda.cliente_id);
      return {
        ...venda,
        cliente_nome: cli ? cli.nome : 'Cliente Desconhecido',
        itens: await this.listarItensPorVenda(id)
      };
    }

    try {
      const vendas = await this.databaseService.query(
        `SELECT v.*, c.nome as cliente_nome
         FROM vendas v
         INNER JOIN clientes c ON v.cliente_id = c.id
         WHERE v.id = ?`,
        [id]
      );

      if (vendas.length === 0) return null;

      const venda = vendas[0] as Venda;
      venda.itens = await this.listarItensPorVenda(id);
      return venda;
    } catch (error) {
      console.error('Erro ao buscar venda no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();

      const venda = this.vendasFallback.find(v => v.id === id);
      if (!venda) return null;
      const cli = await this.clienteService.buscarPorId(venda.cliente_id);
      return {
        ...venda,
        cliente_nome: cli ? cli.nome : 'Cliente Desconhecido',
        itens: await this.listarItensPorVenda(id)
      };
    }
  }

  /**
   * Lista os itens de uma venda.
   */
  async listarItensPorVenda(vendaId: number): Promise<ItemVenda[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const filtered = this.itensVendaFallback.filter(item => item.venda_id === vendaId);
      const list: ItemVenda[] = [];
      for (const item of filtered) {
        const prod = await this.produtoService.buscarPorId(item.produto_id);
        list.push({
          ...item,
          produto_nome: prod ? prod.nome : 'Produto Desconhecido'
        });
      }
      return list;
    }

    try {
      return await this.databaseService.query(
        `SELECT iv.*, p.nome as produto_nome
         FROM itens_venda iv
         INNER JOIN produtos p ON iv.produto_id = p.id
         WHERE iv.venda_id = ?`,
        [vendaId]
      );
    } catch (error) {
      console.error('Erro ao listar itens da venda no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();

      const filtered = this.itensVendaFallback.filter(item => item.venda_id === vendaId);
      const list: ItemVenda[] = [];
      for (const item of filtered) {
        const prod = await this.produtoService.buscarPorId(item.produto_id);
        list.push({
          ...item,
          produto_nome: prod ? prod.nome : 'Produto Desconhecido'
        });
      }
      return list;
    }
  }

  /**
   * Lista vendas pendentes (não pagas).
   */
  async listarPendentes(): Promise<Venda[]> {
    const todas = await this.listarVendas();
    return todas.filter(v => v.status === 'pendente');
  }

  /**
   * Lista vendas pagas.
   */
  async listarPagas(): Promise<Venda[]> {
    const todas = await this.listarVendas();
    return todas.filter(v => v.status === 'paga');
  }

  /**
   * Marca uma venda como paga.
   */
  async marcarComoPaga(vendaId: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.vendasFallback.findIndex(v => v.id === vendaId);
      if (index !== -1) {
        this.vendasFallback[index].status = 'paga';
      }
      console.log(`Venda ${vendaId} marcada como paga no fallback.`);
      return;
    }

    try {
      await this.databaseService.run(
        "UPDATE vendas SET status = 'paga' WHERE id = ?",
        [vendaId]
      );
      console.log(`Venda ${vendaId} marcada como paga no SQLite.`);
    } catch (error) {
      console.error('Erro ao marcar venda como paga no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const index = this.vendasFallback.findIndex(v => v.id === vendaId);
      if (index !== -1) {
        this.vendasFallback[index].status = 'paga';
      }
    }
  }

  /**
   * Remove uma venda e seus itens.
   */
  async remover(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.vendasFallback = this.vendasFallback.filter(v => v.id !== id);
      this.itensVendaFallback = this.itensVendaFallback.filter(item => item.venda_id !== id);
      return;
    }

    try {
      await this.databaseService.run('DELETE FROM itens_venda WHERE venda_id = ?', [id]);
      await this.databaseService.run('DELETE FROM vendas WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao remover venda no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      this.vendasFallback = this.vendasFallback.filter(v => v.id !== id);
      this.itensVendaFallback = this.itensVendaFallback.filter(item => item.venda_id !== id);
    }
  }
}
