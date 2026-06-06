import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private databaseService: DatabaseService) {}

  /**
   * Lista todos os produtos.
   */
  async listarTodos(): Promise<Produto[]> {
    return await this.databaseService.query('SELECT * FROM produtos ORDER BY nome');
  }

  /**
   * Busca um produto pelo ID.
   */
  async buscarPorId(id: number): Promise<Produto | null> {
    const result = await this.databaseService.query('SELECT * FROM produtos WHERE id = ?', [id]);
    return result.length > 0 ? result[0] as Produto : null;
  }

  /**
   * Cadastra um novo produto.
   */
  async cadastrar(produto: Produto): Promise<number> {
    const result = await this.databaseService.run(
      'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)',
      [produto.nome, produto.categoria, produto.preco, produto.estoque]
    );
    return result.lastId;
  }

  /**
   * Atualiza um produto existente.
   */
  async atualizar(produto: Produto): Promise<void> {
    await this.databaseService.run(
      'UPDATE produtos SET nome = ?, categoria = ?, preco = ?, estoque = ? WHERE id = ?',
      [produto.nome, produto.categoria, produto.preco, produto.estoque, produto.id]
    );
  }

  /**
   * Remove um produto pelo ID.
   */
  async remover(id: number): Promise<void> {
    await this.databaseService.run('DELETE FROM produtos WHERE id = ?', [id]);
  }

  /**
   * Atualiza o estoque de um produto (reduz a quantidade).
   */
  async atualizarEstoque(produtoId: number, quantidade: number): Promise<void> {
    await this.databaseService.run(
      'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
      [quantidade, produtoId]
    );
  }

  /**
   * Verifica se o produto tem estoque suficiente.
   */
  async verificarEstoque(produtoId: number, quantidade: number): Promise<boolean> {
    const produto = await this.buscarPorId(produtoId);
    if (!produto) return false;
    return produto.estoque >= quantidade;
  }
}
