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
      try {
        const result = await this.databaseService.run(
          'INSERT INTO usuarios (nome, usuario, senha, perfil) VALUES (?, ?, ?, ?)',
          [usuario.nome, usuario.usuario, usuario.senha, usuario.perfil]
        );
        const id = result.lastId || this.proximoId++;
        const novo = { ...usuario, id };
        if (!this.usuariosFallback.some(u => u.id === id)) {
          this.usuariosFallback.push(novo);
        }
        console.log('Usuário salvo no fallback de localStorage via databaseService:', novo);
        return id;
      } catch (err) {
        console.error('Erro ao salvar no databaseService fallback, usando fallback de memória:', err);
        const id = this.proximoId++;
        const novo = { ...usuario, id };
        this.usuariosFallback.push(novo);
        return id;
      }
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
      try {
        const users = await this.databaseService.query('SELECT * FROM usuarios ORDER BY nome');
        users.forEach(u => {
          if (!this.usuariosFallback.some(mem => mem.id === u.id)) {
            this.usuariosFallback.push(u);
          }
        });
      } catch (err) {
        console.error('Erro ao listar usuários no fallback de localStorage:', err);
      }
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
      try {
        await this.databaseService.run(
          'UPDATE usuarios SET nome = ?, usuario = ?, senha = ?, perfil = ? WHERE id = ?',
          [usuario.nome, usuario.usuario, usuario.senha, usuario.perfil, usuario.id]
        );
      } catch (err) {
        console.error('Erro ao atualizar no databaseService fallback:', err);
      }
      const index = this.usuariosFallback.findIndex(u => u.id === usuario.id);
      if (index !== -1) {
        this.usuariosFallback[index] = { ...usuario };
      }
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
      try {
        await this.databaseService.run('DELETE FROM usuarios WHERE id = ?', [id]);
      } catch (err) {
        console.error('Erro ao excluir no databaseService fallback:', err);
      }
      this.usuariosFallback = this.usuariosFallback.filter(u => u.id !== id);
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

  /**
   * Verifica se o nome de usuário já existe na base de dados (SQLite ou fallback).
   */
  async usuarioExiste(usuario: string): Promise<boolean> {
    if (!usuario) return false;
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM usuarios WHERE usuario = ?',
        [usuario.trim()]
      );
      return result.length > 0;
    } catch (error) {
      console.error('Erro ao verificar se usuário existe, usando fallback em lista:', error);
      const list = await this.listar();
      return list.some(u => u.usuario.toLowerCase() === usuario.trim().toLowerCase());
    }
  }
}
