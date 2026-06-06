import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
  IonGrid, IonRow, IonCol, IonCard, IonCardContent,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline, cubeOutline, cartOutline, cashOutline,
  statsChartOutline, logOutOutline, storefrontOutline,
  personOutline, pricetagOutline, receiptOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  gradient: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon,
    IonGrid, IonRow, IonCol, IonCard, IonCardContent,
    IonButtons
  ]
})
export class HomePage {

  usuarioNome: string = '';
  menuItems: MenuItem[] = [
    {
      title: 'Cadastro',
      description: 'Produtos, Clientes e Usuários',
      icon: 'cube-outline',
      route: '/cadastro',
      color: '#6c5ce7',
      gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)'
    },
    {
      title: 'Vendas',
      description: 'Registrar e consultar vendas',
      icon: 'cart-outline',
      route: '/vendas',
      color: '#00b894',
      gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)'
    },
    {
      title: 'Financeiro',
      description: 'Contas a receber',
      icon: 'cash-outline',
      route: '/financeiro',
      color: '#fdcb6e',
      gradient: 'linear-gradient(135deg, #f39c12 0%, #fdcb6e 100%)'
    },
    {
      title: 'Relatórios',
      description: 'Visualizar relatórios do sistema',
      icon: 'stats-chart-outline',
      route: '/relatorios',
      color: '#0984e3',
      gradient: 'linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      peopleOutline, cubeOutline, cartOutline, cashOutline,
      statsChartOutline, logOutOutline, storefrontOutline,
      personOutline, pricetagOutline, receiptOutline
    });
  }

  ionViewWillEnter() {
    const user = this.authService.getUsuarioLogado();
    this.usuarioNome = user?.nome || 'Usuário';
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
