import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Venda } from '../models/venda.model';
import { ItemVenda } from '../models/item-venda.model';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  constructor(private databaseService: DatabaseService) {}

  /**
   * Lista todas as vendas com o nome do cliente.
   */
  async listarTodas(): Promise<Venda[]> {
    return await this.databaseService.query(
      `SELECT v.*, c.nome as cliente_nome
       FROM vendas v
       INNER JOIN clientes c ON v.cliente_id = c.id
       ORDER BY v.data_venda DESC`
    );
  }

  /**
   * Busca uma venda pelo ID com seus itens.
   */
  async buscarPorId(id: number): Promise<Venda | null> {
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
  }

  /**
   * Lista os itens de uma venda.
   */
  async listarItensPorVenda(vendaId: number): Promise<ItemVenda[]> {
    return await this.databaseService.query(
      `SELECT iv.*, p.nome as produto_nome
       FROM itens_venda iv
       INNER JOIN produtos p ON iv.produto_id = p.id
       WHERE iv.venda_id = ?`,
      [vendaId]
    );
  }

  /**
   * Cria uma nova venda com seus itens.
   * Reduz o estoque dos produtos automaticamente.
   */
  async criar(venda: Venda, itens: ItemVenda[]): Promise<number> {
    // Insere a venda
    const result = await this.databaseService.run(
      'INSERT INTO vendas (cliente_id, data_venda, total, status) VALUES (?, ?, ?, ?)',
      [venda.cliente_id, venda.data_venda, venda.total, 'pendente']
    );

    const vendaId = result.lastId;

    // Insere os itens e atualiza o estoque
    for (const item of itens) {
      await this.databaseService.run(
        'INSERT INTO itens_venda (venda_id, produto_id, quantidade, valor_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [vendaId, item.produto_id, item.quantidade, item.valor_unitario, item.subtotal]
      );

      // Reduz o estoque do produto
      await this.databaseService.run(
        'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
        [item.quantidade, item.produto_id]
      );
    }

    return vendaId;
  }

  /**
   * Lista vendas pendentes (não pagas).
   */
  async listarPendentes(): Promise<Venda[]> {
    return await this.databaseService.query(
      `SELECT v.*, c.nome as cliente_nome
       FROM vendas v
       INNER JOIN clientes c ON v.cliente_id = c.id
       WHERE v.status = 'pendente'
       ORDER BY v.data_venda DESC`
    );
  }

  /**
   * Lista vendas pagas.
   */
  async listarPagas(): Promise<Venda[]> {
    return await this.databaseService.query(
      `SELECT v.*, c.nome as cliente_nome
       FROM vendas v
       INNER JOIN clientes c ON v.cliente_id = c.id
       WHERE v.status = 'paga'
       ORDER BY v.data_venda DESC`
    );
  }

  /**
   * Marca uma venda como paga.
   */
  async marcarComoPaga(vendaId: number): Promise<void> {
    await this.databaseService.run(
      "UPDATE vendas SET status = 'paga' WHERE id = ?",
      [vendaId]
    );
  }

  /**
   * Remove uma venda e seus itens.
   */
  async remover(id: number): Promise<void> {
    await this.databaseService.run('DELETE FROM itens_venda WHERE venda_id = ?', [id]);
    await this.databaseService.run('DELETE FROM vendas WHERE id = ?', [id]);
  }
}
