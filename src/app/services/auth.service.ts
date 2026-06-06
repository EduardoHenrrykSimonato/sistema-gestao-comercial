import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Usuario } from '../models/usuario.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<Usuario | null>(null);

  isAuthenticated$ = this.isAuthenticated.asObservable();
  currentUser$ = this.currentUser.asObservable();

  constructor(private databaseService: DatabaseService) {}

  /**
   * Realiza o login do usuário.
   */
  async login(usuario: string, senha: string): Promise<boolean> {
    const result = await this.databaseService.query(
      'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?',
      [usuario, senha]
    );

    if (result.length > 0) {
      console.log('Usuário encontrado');
      this.currentUser.next(result[0] as Usuario);
      this.isAuthenticated.next(true);
      return true;
    }

    console.log('Usuário não encontrado');
    return false;
  }

  /**
   * Realiza o logout do usuário.
   */
  logout(): void {
    this.currentUser.next(null);
    this.isAuthenticated.next(false);
  }

  /**
   * Retorna o usuário logado.
   */
  getUsuarioLogado(): Usuario | null {
    return this.currentUser.getValue();
  }

  /**
   * Verifica se o usuário está autenticado.
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated.getValue();
  }
}
