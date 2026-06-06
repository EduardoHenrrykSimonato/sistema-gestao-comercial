import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Recebimento } from '../models/recebimento.model';
import { VendaService } from './venda.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  constructor(
    private databaseService: DatabaseService,
    private vendaService: VendaService
  ) {}

  /**
   * Lista todos os recebimentos.
   */
  async listarRecebimentos(): Promise<Recebimento[]> {
    return await this.databaseService.query(
      'SELECT * FROM recebimentos ORDER BY data_recebimento DESC'
    );
  }

  /**
   * Busca um recebimento pelo ID.
   */
  async buscarPorId(id: number): Promise<Recebimento | null> {
    const result = await this.databaseService.query(
      'SELECT * FROM recebimentos WHERE id = ?',
      [id]
    );
    return result.length > 0 ? result[0] as Recebimento : null;
  }

  /**
   * Registra um recebimento e marca a venda como paga.
   */
  async registrarRecebimento(recebimento: Recebimento): Promise<number> {
    const result = await this.databaseService.run(
      'INSERT INTO recebimentos (venda_id, data_recebimento, valor, forma_pagamento, status) VALUES (?, ?, ?, ?, ?)',
      [
        recebimento.venda_id,
        recebimento.data_recebimento,
        recebimento.valor,
        recebimento.forma_pagamento,
        'recebido'
      ]
    );

    // Marca a venda como paga
    await this.vendaService.marcarComoPaga(recebimento.venda_id);

    return result.lastId;
  }

  /**
   * Lista recebimentos por venda.
   */
  async listarPorVenda(vendaId: number): Promise<Recebimento[]> {
    return await this.databaseService.query(
      'SELECT * FROM recebimentos WHERE venda_id = ? ORDER BY data_recebimento DESC',
      [vendaId]
    );
  }

  /**
   * Remove um recebimento pelo ID.
   */
  async remover(id: number): Promise<void> {
    await this.databaseService.run('DELETE FROM recebimentos WHERE id = ?', [id]);
  }
}
