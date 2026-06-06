import { Injectable, Injector } from '@angular/core';
import { DatabaseService } from './database.service';
import { Recebimento } from '../models/recebimento.model';
import { VendaService } from './venda.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private recebimentosFallback: Recebimento[] = [];
  private proximoId = 1;
  private vendaService!: VendaService;

  constructor(
    private databaseService: DatabaseService,
    private injector: Injector
  ) {}

  private getVendaService(): VendaService {
    if (!this.vendaService) {
      this.vendaService = this.injector.get(VendaService);
    }
    return this.vendaService;
  }

  /**
   * Gera um recebimento pendente para uma venda finalizada.
   */
  async gerarRecebimentoPendente(venda_id: number, valor: number): Promise<void> {
    const dataAtual = new Date().toISOString().split('T')[0];

    if (this.databaseService.isWebFallbackAtivo()) {
      const novoRecebimento: Recebimento = {
        id: this.proximoId++,
        venda_id,
        data_recebimento: dataAtual,
        valor,
        forma_pagamento: 'Pendente',
        status: 'pendente'
      };
      this.recebimentosFallback.push(novoRecebimento);
      console.log('Recebimento pendente gerado no fallback web:', novoRecebimento);
      console.log('Lista recebimentos fallback atual:', this.recebimentosFallback);
      return;
    }

    try {
      await this.databaseService.run(
        'INSERT INTO recebimentos (venda_id, data_recebimento, valor, forma_pagamento, status) VALUES (?, ?, ?, ?, ?)',
        [venda_id, dataAtual, valor, 'Pendente', 'pendente']
      );
      console.log(`Recebimento pendente gerado no SQLite para venda ${venda_id}.`);
    } catch (error) {
      console.error('Erro ao gerar recebimento pendente no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const novoRecebimento: Recebimento = {
        id: this.proximoId++,
        venda_id,
        data_recebimento: dataAtual,
        valor,
        forma_pagamento: 'Pendente',
        status: 'pendente'
      };
      this.recebimentosFallback.push(novoRecebimento);
    }
  }

  /**
   * Lista todos os recebimentos.
   */
  async listarRecebimentos(): Promise<Recebimento[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      console.log('Listando recebimentos do fallback web:', this.recebimentosFallback);
      return [...this.recebimentosFallback];
    }
    
    try {
      return await this.databaseService.query(
        'SELECT * FROM recebimentos ORDER BY data_recebimento DESC'
      );
    } catch (error) {
      console.error('Erro ao listar recebimentos no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      return [...this.recebimentosFallback];
    }
  }

  /**
   * Busca um recebimento pelo ID.
   */
  async buscarPorId(id: number): Promise<Recebimento | null> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const r = this.recebimentosFallback.find(rec => rec.id === id);
      return r ? { ...r } : null;
    }

    try {
      const result = await this.databaseService.query(
        'SELECT * FROM recebimentos WHERE id = ?',
        [id]
      );
      return result.length > 0 ? result[0] as Recebimento : null;
    } catch (error) {
      console.error('Erro ao buscar recebimento por ID no SQLite, usando fallback:', error);
      const r = this.recebimentosFallback.find(rec => rec.id === id);
      return r ? { ...r } : null;
    }
  }

  /**
   * Registra um recebimento (efetua o pagamento) e marca a venda como paga.
   */
  async registrarRecebimento(recebimento: Recebimento): Promise<number> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.recebimentosFallback.findIndex(r => r.venda_id === recebimento.venda_id);
      if (index !== -1) {
        this.recebimentosFallback[index] = {
          ...this.recebimentosFallback[index],
          data_recebimento: recebimento.data_recebimento,
          forma_pagamento: recebimento.forma_pagamento,
          status: 'recebido'
        };
      } else {
        const id = this.proximoId++;
        this.recebimentosFallback.push({
          ...recebimento,
          id,
          status: 'recebido'
        });
      }
      
      // Marca a venda como paga
      await this.getVendaService().marcarComoPaga(recebimento.venda_id);
      console.log('Recebimento registrado no fallback web:', recebimento);
      return recebimento.id || 0;
    }

    try {
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
      await this.getVendaService().marcarComoPaga(recebimento.venda_id);

      return result.lastId;
    } catch (error) {
      console.error('Erro ao registrar recebimento no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();

      const index = this.recebimentosFallback.findIndex(r => r.venda_id === recebimento.venda_id);
      if (index !== -1) {
        this.recebimentosFallback[index] = {
          ...this.recebimentosFallback[index],
          data_recebimento: recebimento.data_recebimento,
          forma_pagamento: recebimento.forma_pagamento,
          status: 'recebido'
        };
      }
      await this.getVendaService().marcarComoPaga(recebimento.venda_id);
      return recebimento.id || 0;
    }
  }

  /**
   * Lista recebimentos por venda.
   */
  async listarPorVenda(vendaId: number): Promise<Recebimento[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      return this.recebimentosFallback.filter(r => r.venda_id === vendaId);
    }
    
    try {
      return await this.databaseService.query(
        'SELECT * FROM recebimentos WHERE venda_id = ? ORDER BY data_recebimento DESC',
        [vendaId]
      );
    } catch (error) {
      console.error('Erro ao listar recebimentos por venda no SQLite:', error);
      this.databaseService.ativarFallbackWeb();
      return this.recebimentosFallback.filter(r => r.venda_id === vendaId);
    }
  }

  /**
   * Lista todos os recebimentos do sistema.
   */
  async listarTodosRecebimentos(): Promise<Recebimento[]> {
    return await this.listarRecebimentos();
  }

  /**
   * Lista recebimentos com status pendente.
   */
  async listarRecebimentosPendentes(): Promise<Recebimento[]> {
    const todos = await this.listarRecebimentos();
    return todos.filter(r => r.status === 'pendente');
  }

  /**
   * Lista recebimentos com status recebido (pago).
   */
  async listarRecebimentosPagos(): Promise<Recebimento[]> {
    const todos = await this.listarRecebimentos();
    return todos.filter(r => r.status === 'recebido');
  }

  /**
   * Calcula o valor total recebido (pagos).
   */
  async calcularTotalRecebido(): Promise<number> {
    const pagos = await this.listarRecebimentosPagos();
    return pagos.reduce((total, r) => total + r.valor, 0);
  }

  /**
   * Calcula o valor total pendente.
   */
  async calcularTotalPendente(): Promise<number> {
    const pendentes = await this.listarRecebimentosPendentes();
    return pendentes.reduce((total, r) => total + r.valor, 0);
  }

  /**
   * Remove um recebimento pelo ID.
   */
  async remover(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.recebimentosFallback = this.recebimentosFallback.filter(r => r.id !== id);
      return;
    }
    
    try {
      await this.databaseService.run('DELETE FROM recebimentos WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao remover recebimento no SQLite:', error);
      this.databaseService.ativarFallbackWeb();
      this.recebimentosFallback = this.recebimentosFallback.filter(r => r.id !== id);
    }
  }
}
