import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent,
  IonItem, IonInput, IonButton, IonIcon, IonText, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonCard, IonCardContent,
    IonItem, IonInput, IonButton, IonIcon, IonText, IonSpinner
  ]
})
export class LoginPage {

  usuario: string = '';
  senha: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private databaseService: DatabaseService,
    private router: Router
  ) {
    addIcons({ logInOutline, lockClosedOutline, personOutline });
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

      const autenticado = await this.authService.login(this.usuario, this.senha);

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
}

