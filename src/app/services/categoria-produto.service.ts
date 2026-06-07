import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { CategoriaProduto } from '../models/categoria-produto.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProdutoService {

  private categoriasFallback: CategoriaProduto[] = [];
  private proximoId = 1;

  constructor(private databaseService: DatabaseService) {}

  /**
   * Insere uma nova categoria de produto.
   */
  async inserir(categoria: CategoriaProduto): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const novaCategoria: CategoriaProduto = {
        ...categoria,
        id: this.proximoId++
      };
      this.categoriasFallback.push(novaCategoria);
      console.log('Categoria salva no fallback web:', novaCategoria);
      return;
    }

    try {
      await this.databaseService.run(
        'INSERT INTO categorias_produto (nome, descricao) VALUES (?, ?)',
        [categoria.nome, categoria.descricao || '']
      );
    } catch (error) {
      console.error('Erro ao salvar categoria no SQLite, ativando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const novaCategoria: CategoriaProduto = {
        ...categoria,
        id: this.proximoId++
      };
      this.categoriasFallback.push(novaCategoria);
    }
  }

  /**
   * Lista todas as categorias de produto.
   */
  async listar(): Promise<CategoriaProduto[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      console.log('Listando categorias do fallback web:', this.categoriasFallback);
      return [...this.categoriasFallback];
    }

    try {
      return await this.databaseService.query('SELECT * FROM categorias_produto ORDER BY nome');
    } catch (error) {
      console.error('Erro ao listar categorias no SQLite, ativando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      return [...this.categoriasFallback];
    }
  }

  /**
   * Busca uma categoria pelo ID.
   */
  async buscarPorId(id: number): Promise<CategoriaProduto | null> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const cat = this.categoriasFallback.find(c => c.id === id);
      return cat ? { ...cat } : null;
    }
    try {
      const result = await this.databaseService.query('SELECT * FROM categorias_produto WHERE id = ?', [id]);
      return result.length > 0 ? result[0] as CategoriaProduto : null;
    } catch (error) {
      console.error('Erro ao buscar categoria por ID no SQLite:', error);
      const cat = this.categoriasFallback.find(c => c.id === id);
      return cat ? { ...cat } : null;
    }
  }

  /**
   * Atualiza uma categoria existente.
   */
  async atualizar(categoria: CategoriaProduto): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.categoriasFallback.findIndex(c => c.id === categoria.id);
      if (index !== -1) {
        this.categoriasFallback[index] = { ...categoria };
      }
      console.log('Categoria atualizada no fallback web:', categoria);
      return;
    }

    try {
      await this.databaseService.run(
        'UPDATE categorias_produto SET nome = ?, descricao = ? WHERE id = ?',
        [categoria.nome, categoria.descricao || '', categoria.id]
      );
    } catch (error) {
      console.error('Erro ao atualizar categoria no SQLite, ativando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const index = this.categoriasFallback.findIndex(c => c.id === categoria.id);
      if (index !== -1) {
        this.categoriasFallback[index] = { ...categoria };
      }
    }
  }

  /**
   * Exclui uma categoria pelo ID.
   */
  async excluir(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.categoriasFallback = this.categoriasFallback.filter(c => c.id !== id);
      console.log('Categoria excluída no fallback web. ID:', id);
      return;
    }

    try {
      await this.databaseService.run('DELETE FROM categorias_produto WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao excluir categoria no SQLite, ativando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      this.categoriasFallback = this.categoriasFallback.filter(c => c.id !== id);
    }
  }

  /**
   * Verifica se já existe uma categoria com o mesmo nome (case insensitive).
   * Pode receber um ID opcional para excluir a própria categoria na verificação (caso de edição).
   */
  async categoriaExiste(nome: string, excluirId?: number): Promise<boolean> {
    const nomeLower = nome.trim().toLowerCase();

    if (this.databaseService.isWebFallbackAtivo()) {
      return this.categoriasFallback.some(
        c => c.nome.toLowerCase() === nomeLower && c.id !== excluirId
      );
    }

    try {
      const result = await this.databaseService.query(
        'SELECT COUNT(*) as count FROM categorias_produto WHERE LOWER(nome) = ?',
        [nomeLower]
      );
      const count = result[0]?.count || 0;

      if (excluirId && count > 0) {
        const existing = await this.databaseService.query(
          'SELECT id FROM categorias_produto WHERE LOWER(nome) = ?',
          [nomeLower]
        );
        return existing.some(r => r.id !== excluirId);
      }

      return count > 0;
    } catch (error) {
      console.error('Erro ao verificar categoria existente:', error);
      return this.categoriasFallback.some(
        c => c.nome.toLowerCase() === nomeLower && c.id !== excluirId
      );
    }
  }
}
