import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private databaseService: DatabaseService) {}

  /**
   * Cadastra um novo produto (Inserir).
   */
  async inserir(produto: Produto): Promise<number> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const id = this.databaseService.produtoId++;
      const novo = { ...produto, id };
      this.databaseService.produtosFallback.push(novo);
      return id;
    }
    const result = await this.databaseService.run(
      'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)',
      [produto.nome, produto.categoria, produto.preco, produto.estoque]
    );
    return result.lastId;
  }

  /**
   * Alias para cadastrar (retrocompatibilidade).
   */
  async cadastrar(produto: Produto): Promise<number> {
    return this.inserir(produto);
  }

  /**
   * Lista todos os produtos (Listar).
   */
  async listar(): Promise<Produto[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      return [...this.databaseService.produtosFallback];
    }
    return await this.databaseService.query('SELECT * FROM produtos ORDER BY nome');
  }

  /**
   * Alias para listarTodos (retrocompatibilidade).
   */
  async listarTodos(): Promise<Produto[]> {
    return this.listar();
  }

  /**
   * Busca um produto pelo ID.
   */
  async buscarPorId(id: number): Promise<Produto | null> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const prod = this.databaseService.produtosFallback.find(p => p.id === id);
      return prod ? { ...prod } : null;
    }
    const result = await this.databaseService.query('SELECT * FROM produtos WHERE id = ?', [id]);
    return result.length > 0 ? result[0] as Produto : null;
  }

  /**
   * Atualiza um produto existente.
   */
  async atualizar(produto: Produto): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.databaseService.produtosFallback.findIndex(p => p.id === produto.id);
      if (index !== -1) {
        this.databaseService.produtosFallback[index] = { ...produto };
      }
      return;
    }
    await this.databaseService.run(
      'UPDATE produtos SET nome = ?, categoria = ?, preco = ?, estoque = ? WHERE id = ?',
      [produto.nome, produto.categoria, produto.preco, produto.estoque, produto.id]
    );
  }

  /**
   * Remove um produto pelo ID (Excluir).
   */
  async excluir(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.databaseService.produtosFallback = this.databaseService.produtosFallback.filter(p => p.id !== id);
      return;
    }
    await this.databaseService.run('DELETE FROM produtos WHERE id = ?', [id]);
  }

  /**
   * Alias para remover (retrocompatibilidade).
   */
  async remover(id: number): Promise<void> {
    return this.excluir(id);
  }

  /**
   * Atualiza o estoque de um produto (define a quantidade ou novo estoque).
   */
  async atualizarEstoque(produtoId: number, novoEstoque: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.databaseService.produtosFallback.findIndex(p => p.id === produtoId);
      if (index !== -1) {
        this.databaseService.produtosFallback[index].estoque = novoEstoque;
      }
      return;
    }
    await this.databaseService.run(
      'UPDATE produtos SET estoque = ? WHERE id = ?',
      [novoEstoque, produtoId]
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
