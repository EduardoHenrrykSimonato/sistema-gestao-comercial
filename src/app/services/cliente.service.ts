import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clientesFallback: Cliente[] = [];
  private proximoId = 1;

  constructor(private databaseService: DatabaseService) {}

  /**
   * Cadastra um novo cliente (Inserir).
   */
  async inserir(cliente: Cliente): Promise<number> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const id = this.proximoId++;
      const novo = { ...cliente, id };
      this.clientesFallback.push(novo);
      console.log('Cliente salvo no fallback web:', novo);
      console.log('Lista fallback atual:', this.clientesFallback);
      return id;
    }
    
    try {
      const result = await this.databaseService.run(
        'INSERT INTO clientes (nome, cpf_cnpj, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)',
        [cliente.nome, cliente.cpf_cnpj, cliente.telefone, cliente.email, cliente.endereco]
      );
      return result.lastId;
    } catch (error) {
      console.error('Erro ao salvar cliente no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const id = this.proximoId++;
      const novo = { ...cliente, id };
      this.clientesFallback.push(novo);
      return id;
    }
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
      console.log('Listando clientes do fallback web:', this.clientesFallback);
      return [...this.clientesFallback];
    }
    
    try {
      return await this.databaseService.query('SELECT * FROM clientes ORDER BY nome');
    } catch (error) {
      console.error('Erro ao listar clientes no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      return [...this.clientesFallback];
    }
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
      const c = this.clientesFallback.find(cli => cli.id === id);
      return c ? { ...c } : null;
    }
    try {
      const result = await this.databaseService.query('SELECT * FROM clientes WHERE id = ?', [id]);
      return result.length > 0 ? result[0] as Cliente : null;
    } catch (error) {
      console.error('Erro ao buscar cliente por ID no SQLite, usando fallback:', error);
      const c = this.clientesFallback.find(cli => cli.id === id);
      return c ? { ...c } : null;
    }
  }

  /**
   * Atualiza um cliente existente.
   */
  async atualizar(cliente: Cliente): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.clientesFallback.findIndex(c => c.id === cliente.id);
      if (index !== -1) {
        this.clientesFallback[index] = { ...cliente };
      }
      console.log('Cliente atualizado no fallback web:', cliente);
      console.log('Lista fallback atual:', this.clientesFallback);
      return;
    }
    
    try {
      await this.databaseService.run(
        'UPDATE clientes SET nome = ?, cpf_cnpj = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?',
        [cliente.nome, cliente.cpf_cnpj, cliente.telefone, cliente.email, cliente.endereco, cliente.id]
      );
    } catch (error) {
      console.error('Erro ao atualizar cliente no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const index = this.clientesFallback.findIndex(c => c.id === cliente.id);
      if (index !== -1) {
        this.clientesFallback[index] = { ...cliente };
      }
    }
  }

  /**
   * Remove um cliente pelo ID (Excluir).
   */
  async excluir(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.clientesFallback = this.clientesFallback.filter(c => c.id !== id);
      console.log('Cliente excluído no fallback web. ID:', id);
      console.log('Lista fallback atual:', this.clientesFallback);
      return;
    }
    
    try {
      await this.databaseService.run('DELETE FROM clientes WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao excluir cliente no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      this.clientesFallback = this.clientesFallback.filter(c => c.id !== id);
    }
  }

  /**
   * Alias para remover (retrocompatibilidade).
   */
  async remover(id: number): Promise<void> {
    return this.excluir(id);
  }
}
