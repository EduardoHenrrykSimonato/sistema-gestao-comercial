import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private produtosFallback: Produto[] = [];
  private proximoId = 1;

  constructor(private databaseService: DatabaseService) {}

  /**
   * Cadastra um novo produto (Inserir).
   */
  async inserir(produto: Produto): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const novoProduto = {
        ...produto,
        id: this.proximoId++
      };
      this.produtosFallback.push(novoProduto);
      console.log('Produto salvo no fallback web:', novoProduto);
      console.log('Lista fallback atual:', this.produtosFallback);
      return;
    }
    
    try {
      await this.databaseService.run(
        'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)',
        [produto.nome, produto.categoria, produto.preco, produto.estoque]
      );
    } catch (error) {
      console.error('Erro ao salvar produto no SQLite, ativando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const novoProduto = {
        ...produto,
        id: this.proximoId++
      };
      this.produtosFallback.push(novoProduto);
      console.log('Produto salvo no fallback web (após erro):', novoProduto);
    }
  }

  /**
   * Alias para cadastrar (retrocompatibilidade).
   */
  async cadastrar(produto: Produto): Promise<number> {
    const isFallback = this.databaseService.isWebFallbackAtivo();
    await this.inserir(produto);
    if (isFallback) {
      return this.proximoId - 1;
    }
    try {
      const result = await this.databaseService.run(
        'INSERT INTO produtos (nome, categoria, preco, estoque) VALUES (?, ?, ?, ?)',
        [produto.nome, produto.categoria, produto.preco, produto.estoque]
      );
      return result.lastId;
    } catch (error) {
      return this.proximoId - 1;
    }
  }

  /**
   * Lista todos os produtos (Listar).
   */
  async listar(): Promise<Produto[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      console.log('Listando produtos do fallback web:', this.produtosFallback);
      return [...this.produtosFallback];
    }
    
    try {
      return await this.databaseService.query('SELECT * FROM produtos ORDER BY nome');
    } catch (error) {
      console.error('Erro ao listar produtos no SQLite, ativando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      return [...this.produtosFallback];
    }
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
      const prod = this.produtosFallback.find(p => p.id === id);
      return prod ? { ...prod } : null;
    }
    try {
      const result = await this.databaseService.query('SELECT * FROM produtos WHERE id = ?', [id]);
      return result.length > 0 ? result[0] as Produto : null;
    } catch (error) {
      console.error('Erro ao buscar produto por ID no SQLite, usando fallback:', error);
      const prod = this.produtosFallback.find(p => p.id === id);
      return prod ? { ...prod } : null;
    }
  }

  /**
   * Atualiza um produto existente.
   */
  async atualizar(produto: Produto): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.produtosFallback.findIndex(p => p.id === produto.id);
      if (index !== -1) {
        this.produtosFallback[index] = { ...produto };
      }
      console.log('Produto atualizado no fallback web:', produto);
      console.log('Lista fallback atual:', this.produtosFallback);
      return;
    }
    
    try {
      await this.databaseService.run(
        'UPDATE produtos SET nome = ?, categoria = ?, preco = ?, estoque = ? WHERE id = ?',
        [produto.nome, produto.categoria, produto.preco, produto.estoque, produto.id]
      );
    } catch (error) {
      console.error('Erro ao atualizar produto no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const index = this.produtosFallback.findIndex(p => p.id === produto.id);
      if (index !== -1) {
        this.produtosFallback[index] = { ...produto };
      }
    }
  }

  /**
   * Remove um produto pelo ID (Excluir).
   */
  async excluir(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.produtosFallback = this.produtosFallback.filter(p => p.id !== id);
      console.log('Produto excluído no fallback web. ID:', id);
      console.log('Lista fallback atual:', this.produtosFallback);
      return;
    }
    
    try {
      await this.databaseService.run('DELETE FROM produtos WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao excluir produto no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      this.produtosFallback = this.produtosFallback.filter(p => p.id !== id);
    }
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
      const index = this.produtosFallback.findIndex(p => p.id === produtoId);
      if (index !== -1) {
        this.produtosFallback[index].estoque = novoEstoque;
      }
      return;
    }
    
    try {
      await this.databaseService.run(
        'UPDATE produtos SET estoque = ? WHERE id = ?',
        [novoEstoque, produtoId]
      );
    } catch (error) {
      console.error('Erro ao atualizar estoque no SQLite, usando fallback:', error);
      const index = this.produtosFallback.findIndex(p => p.id === produtoId);
      if (index !== -1) {
        this.produtosFallback[index].estoque = novoEstoque;
      }
    }
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
