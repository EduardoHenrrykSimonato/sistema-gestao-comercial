import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private databaseService: DatabaseService) {}

  /**
   * Lista todos os clientes.
   */
  async listarTodos(): Promise<Cliente[]> {
    return await this.databaseService.query('SELECT * FROM clientes ORDER BY nome');
  }

  /**
   * Busca um cliente pelo ID.
   */
  async buscarPorId(id: number): Promise<Cliente | null> {
    const result = await this.databaseService.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return result.length > 0 ? result[0] as Cliente : null;
  }

  /**
   * Cadastra um novo cliente.
   */
  async cadastrar(cliente: Cliente): Promise<number> {
    const result = await this.databaseService.run(
      'INSERT INTO clientes (nome, cpf_cnpj, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)',
      [cliente.nome, cliente.cpf_cnpj, cliente.telefone, cliente.email, cliente.endereco]
    );
    return result.lastId;
  }

  /**
   * Atualiza um cliente existente.
   */
  async atualizar(cliente: Cliente): Promise<void> {
    await this.databaseService.run(
      'UPDATE clientes SET nome = ?, cpf_cnpj = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?',
      [cliente.nome, cliente.cpf_cnpj, cliente.telefone, cliente.email, cliente.endereco, cliente.id]
    );
  }

  /**
   * Remove um cliente pelo ID.
   */
  async remover(id: number): Promise<void> {
    await this.databaseService.run('DELETE FROM clientes WHERE id = ?', [id]);
  }
}
