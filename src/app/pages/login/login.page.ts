import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent,
  IonItem, IonInput, IonButton, IonIcon, IonText, IonSpinner,
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, lockClosedOutline, personOutline, personAddOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonCard, IonCardContent,
    IonItem, IonInput, IonButton, IonIcon, IonText, IonSpinner,
    IonSelect, IonSelectOption
  ]
})
export class LoginPage {

  // Login fields
  usuario: string = '';
  senha: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  // Toggle modes
  modoLogin: boolean = true;

  // Registration fields
  novoNome: string = '';
  novoUsuario: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';
  novoPerfil: string = '';

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    addIcons({ logInOutline, lockClosedOutline, personOutline, personAddOutline, arrowBackOutline });
  }

  async ionViewWillEnter() {
    // Banco será inicializado sob demanda no login
  }

  async onLogin() {
    if (!this.usuario || !this.senha) {
      alert('Preencha usuário e senha.');
      return;
    }

    this.loading = true;

    try {
      console.log('Iniciando login...');

      const autenticado = await this.authService.login(this.usuario.trim(), this.senha);

      if (autenticado) {
        console.log('Login aprovado. Navegando para Home...');

        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          activeElement.blur();
        }

        await this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        alert('Usuário ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert('Erro ao realizar login. Tente novamente.');
    } finally {
      this.loading = false;
    }
  }

  async onCriarConta() {
    if (!this.novoNome || !this.novoNome.trim()) {
      alert('Preencha o nome.');
      return;
    }
    if (!this.novoUsuario || !this.novoUsuario.trim()) {
      alert('Preencha o usuário.');
      return;
    }
    if (!this.novaSenha || !this.novaSenha.trim()) {
      alert('Preencha a senha.');
      return;
    }
    if (!this.confirmarSenha || !this.confirmarSenha.trim()) {
      alert('Preencha a confirmação de senha.');
      return;
    }
    if (!this.novoPerfil) {
      alert('Selecione o perfil.');
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    this.loading = true;

    try {
      // Verify if username already exists
      const existe = await this.usuarioService.usuarioExiste(this.novoUsuario.trim());
      if (existe) {
        alert('Usuário já cadastrado.');
        return;
      }

      const novoUsuarioDados: Usuario = {
        nome: this.novoNome.trim(),
        usuario: this.novoUsuario.trim(),
        senha: this.novaSenha.trim(),
        perfil: this.novoPerfil
      };

      await this.usuarioService.inserir(novoUsuarioDados);
      alert('Conta criada com sucesso. Faça login para acessar o sistema.');

      // Clear fields and switch back to Login Mode
      this.limparCamposCadastro();
      this.modoLogin = true;
    } catch (error) {
      console.error('Erro ao criar conta no login:', error);
      alert('Erro ao criar conta. Tente novamente.');
    } finally {
      this.loading = false;
    }
  }

  limparCamposCadastro() {
    this.novoNome = '';
    this.novoUsuario = '';
    this.novaSenha = '';
    this.confirmarSenha = '';
    this.novoPerfil = '';
  }

  toggleModo() {
    this.modoLogin = !this.modoLogin;
    this.limparCamposCadastro();
    this.usuario = '';
    this.senha = '';
  }
}
