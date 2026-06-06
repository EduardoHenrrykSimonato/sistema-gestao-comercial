import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuariosFallback: Usuario[] = [
    {
      id: 1,
      nome: 'Administrador',
      usuario: 'admin',
      senha: 'admin123',
      perfil: 'Administrador'
    }
  ];
  private proximoId = 2;

  constructor(private databaseService: DatabaseService) {}

  /**
   * Cadastra um novo usuário (Inserir).
   */
  async inserir(usuario: Usuario): Promise<number> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const id = this.proximoId++;
      const novo = { ...usuario, id };
      this.usuariosFallback.push(novo);
      console.log('Usuário salvo no fallback web:', novo);
      console.log('Lista fallback atual:', this.usuariosFallback);
      return id;
    }
    
    try {
      const result = await this.databaseService.run(
        'INSERT INTO usuarios (nome, usuario, senha, perfil) VALUES (?, ?, ?, ?)',
        [usuario.nome, usuario.usuario, usuario.senha, usuario.perfil]
      );
      return result.lastId;
    } catch (error) {
      console.error('Erro ao salvar usuário no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const id = this.proximoId++;
      const novo = { ...usuario, id };
      this.usuariosFallback.push(novo);
      return id;
    }
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
      console.log('Listando usuários do fallback web:', this.usuariosFallback);
      return [...this.usuariosFallback];
    }
    
    try {
      return await this.databaseService.query('SELECT * FROM usuarios ORDER BY nome');
    } catch (error) {
      console.error('Erro ao listar usuários no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      return [...this.usuariosFallback];
    }
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
      const u = this.usuariosFallback.find(user => user.id === id);
      return u ? { ...u } : null;
    }
    try {
      const result = await this.databaseService.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      return result.length > 0 ? result[0] as Usuario : null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID no SQLite, usando fallback:', error);
      const u = this.usuariosFallback.find(user => user.id === id);
      return u ? { ...u } : null;
    }
  }

  /**
   * Atualiza um usuário existente.
   */
  async atualizar(usuario: Usuario): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      const index = this.usuariosFallback.findIndex(u => u.id === usuario.id);
      if (index !== -1) {
        this.usuariosFallback[index] = { ...usuario };
      }
      console.log('Usuário atualizado no fallback web:', usuario);
      console.log('Lista fallback atual:', this.usuariosFallback);
      return;
    }
    
    try {
      await this.databaseService.run(
        'UPDATE usuarios SET nome = ?, usuario = ?, senha = ?, perfil = ? WHERE id = ?',
        [usuario.nome, usuario.usuario, usuario.senha, usuario.perfil, usuario.id]
      );
    } catch (error) {
      console.error('Erro ao atualizar usuário no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      const index = this.usuariosFallback.findIndex(u => u.id === usuario.id);
      if (index !== -1) {
        this.usuariosFallback[index] = { ...usuario };
      }
    }
  }

  /**
   * Remove um usuário pelo ID (Excluir).
   */
  async excluir(id: number): Promise<void> {
    if (this.databaseService.isWebFallbackAtivo()) {
      this.usuariosFallback = this.usuariosFallback.filter(u => u.id !== id);
      console.log('Usuário excluído no fallback web. ID:', id);
      console.log('Lista fallback atual:', this.usuariosFallback);
      return;
    }
    
    try {
      await this.databaseService.run('DELETE FROM usuarios WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao excluir usuário no SQLite, usando fallback:', error);
      this.databaseService.ativarFallbackWeb();
      this.usuariosFallback = this.usuariosFallback.filter(u => u.id !== id);
    }
  }

  /**
   * Alias para remover (retrocompatibilidade).
   */
  async remover(id: number): Promise<void> {
    return this.excluir(id);
  }
}
