import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private databaseService: DatabaseService) {}

  /**
   * Cadastra um novo usuário (Inserir).
   */
  async inserir(usuario: Usuario): Promise<number> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const id = this.databaseService.usuarioId++;
      const novo = { ...usuario, id };
      this.databaseService.usuariosFallback.push(novo);
      return id;
    }
    const result = await this.databaseService.run(
      'INSERT INTO usuarios (nome, usuario, senha, perfil) VALUES (?, ?, ?, ?)',
      [usuario.nome, usuario.usuario, usuario.senha, usuario.perfil]
    );
    return result.lastId;
  }

  /**
   * Alias para cadastrar (retrocompatibilidade).
   */
  async cadastrar(usuario: Usuario): Promise<number> {
    return this.inserir(usuario);
  }

  /**
   * Lista todos os usuários (Listar).
   */
  async listar(): Promise<Usuario[]> {
    if (this.databaseService.isWebFallbackAtivo()) {
      return [...this.databaseService.usuariosFallback];
    }
    return await this.databaseService.query('SELECT * FROM usuarios ORDER BY nome');
  }

  /**
   * Alias para listarTodos (retrocompatibilidade).
   */
  async listarTodos(): Promise<Usuario[]> {
    return this.listar();
  }

  /**
   * Busca um usuário pelo ID.
   */
  async buscarPorId(id: number): Promise<Usuario | null> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const u = this.databaseService.usuariosFallback.find(user => user.id === id);
      return u ? { ...u } : null;
    }
    const result = await this.databaseService.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return result.length > 0 ? result[0] as Usuario : null;
  }

  /**
   * Atualiza um usuário existente.
   */
  async atualizar(usuario: Usuario): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.databaseService.usuariosFallback.findIndex(u => u.id === usuario.id);
      if (index !== -1) {
        this.databaseService.usuariosFallback[index] = { ...usuario };
      }
      return;
    }
    await this.databaseService.run(
      'UPDATE usuarios SET nome = ?, usuario = ?, senha = ?, perfil = ? WHERE id = ?',
      [usuario.nome, usuario.usuario, usuario.senha, usuario.perfil, usuario.id]
    );
  }

  /**
   * Remove um usuário pelo ID (Excluir).
   */
  async excluir(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.databaseService.usuariosFallback = this.databaseService.usuariosFallback.filter(u => u.id !== id);
      return;
    }
    await this.databaseService.run('DELETE FROM usuarios WHERE id = ?', [id]);
  }

  /**
   * Alias para remover (retrocompatibilidade).
   */
  async remover(id: number): Promise<void> {
    return this.excluir(id);
  }
}
