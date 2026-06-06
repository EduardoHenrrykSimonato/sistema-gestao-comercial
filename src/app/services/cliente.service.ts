import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private databaseService: DatabaseService) {}

  /**
   * Cadastra um novo cliente (Inserir).
   */
  async inserir(cliente: Cliente): Promise<number> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const id = this.databaseService.clienteId++;
      const novo = { ...cliente, id };
      this.databaseService.clientesFallback.push(novo);
      return id;
    }
    const result = await this.databaseService.run(
      'INSERT INTO clientes (nome, cpf_cnpj, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)',
      [cliente.nome, cliente.cpf_cnpj, cliente.telefone, cliente.email, cliente.endereco]
    );
    return result.lastId;
  }

  /**
   * Alias para cadastrar (retrocompatibilidade).
   */
  async cadastrar(cliente: Cliente): Promise<number> {
    return this.inserir(cliente);
  }

  /**
   * Lista todos os clientes (Listar).
   */
  async listar(): Promise<Cliente[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      return [...this.databaseService.clientesFallback];
    }
    return await this.databaseService.query('SELECT * FROM clientes ORDER BY nome');
  }

  /**
   * Alias para listarTodos (retrocompatibilidade).
   */
  async listarTodos(): Promise<Cliente[]> {
    return this.listar();
  }

  /**
   * Busca um cliente pelo ID.
   */
  async buscarPorId(id: number): Promise<Cliente | null> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const c = this.databaseService.clientesFallback.find(cli => cli.id === id);
      return c ? { ...c } : null;
    }
    const result = await this.databaseService.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return result.length > 0 ? result[0] as Cliente : null;
  }

  /**
   * Atualiza um cliente existente.
   */
  async atualizar(cliente: Cliente): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.databaseService.clientesFallback.findIndex(c => c.id === cliente.id);
      if (index !== -1) {
        this.databaseService.clientesFallback[index] = { ...cliente };
      }
      return;
    }
    await this.databaseService.run(
      'UPDATE clientes SET nome = ?, cpf_cnpj = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?',
      [cliente.nome, cliente.cpf_cnpj, cliente.telefone, cliente.email, cliente.endereco, cliente.id]
    );
  }

  /**
   * Remove um cliente pelo ID (Excluir).
   */
  async excluir(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.databaseService.clientesFallback = this.databaseService.clientesFallback.filter(c => c.id !== id);
      return;
    }
    await this.databaseService.run('DELETE FROM clientes WHERE id = ?', [id]);
  }

  /**
   * Alias para remover (retrocompatibilidade).
   */
  async remover(id: number): Promise<void> {
    return this.excluir(id);
  }
}
