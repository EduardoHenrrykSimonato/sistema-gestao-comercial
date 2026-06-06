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
    // Inicializa o banco de dados no login
    try {
      await this.databaseService.initializeDatabase();
    } catch (error) {
      console.error('Erro ao inicializar banco:', error);
    }
  }

  async onLogin() {
    console.log('Iniciando login...');
    this.errorMessage = '';

    if (!this.usuario || !this.senha) {
      alert('Preencha usuário e senha.');
      return;
    }

    this.loading = true;

    try {
      // Garante a inicialização do banco antes de chamar o login
      await this.databaseService.initializeDatabase();

      const success = await this.authService.login(this.usuario, this.senha);

      if (success) {
        console.log('Navegando para Home');
        this.router.navigate(['/home']);
      } else {
        alert('Usuário ou senha inválidos.');
      }
    } catch (error) {
      alert('Erro ao realizar login. Tente novamente.');
      console.error('Erro no login:', error);
    } finally {
      this.loading = false;
    }
  }
}

