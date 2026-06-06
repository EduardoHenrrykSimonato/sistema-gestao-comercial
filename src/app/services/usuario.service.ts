import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private databaseService: DatabaseService) {}

  /**
   * Lista todos os usuários.
   */
  async listarTodos(): Promise<Usuario[]> {
    return await this.databaseService.query('SELECT * FROM usuarios ORDER BY nome');
  }

  /**
   * Busca um usuário pelo ID.
   */
  async buscarPorId(id: number): Promise<Usuario | null> {
    const result = await this.databaseService.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return result.length > 0 ? result[0] as Usuario : null;
  }

  /**
   * Cadastra um novo usuário.
   */
  async cadastrar(usuario: Usuario): Promise<number> {
    const result = await this.databaseService.run(
      'INSERT INTO usuarios (nome, usuario, senha, perfil) VALUES (?, ?, ?, ?)',
      [usuario.nome, usuario.usuario, usuario.senha, usuario.perfil]
    );
    return result.lastId;
  }

  /**
   * Atualiza um usuário existente.
   */
  async atualizar(usuario: Usuario): Promise<void> {
    await this.databaseService.run(
      'UPDATE usuarios SET nome = ?, usuario = ?, senha = ?, perfil = ? WHERE id = ?',
      [usuario.nome, usuario.usuario, usuario.senha, usuario.perfil, usuario.id]
    );
  }

  /**
   * Remove um usuário pelo ID.
   */
  async remover(id: number): Promise<void> {
    await this.databaseService.run('DELETE FROM usuarios WHERE id = ?', [id]);
  }
}
