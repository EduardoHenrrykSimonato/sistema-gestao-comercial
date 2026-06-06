import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonCard, IonCardContent, IonIcon, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline, cubeOutline, personOutline, chevronForwardOutline } from 'ionicons/icons';

interface SubMenuItem {
  title: string;
  description: string;
  icon: string;
  route: string;
  gradient: string;
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonCard, IonCardContent, IonIcon, IonGrid, IonRow, IonCol
  ]
})
export class CadastroPage {

  subMenuItems: SubMenuItem[] = [
    {
      title: 'Produtos',
      description: 'Gerenciar produtos e estoque',
      icon: 'cube-outline',
      route: '/cadastro/produtos',
      gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)'
    },
    {
      title: 'Clientes',
      description: 'Gerenciar clientes',
      icon: 'people-outline',
      route: '/cadastro/clientes',
      gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)'
    },
    {
      title: 'Usuários',
      description: 'Gerenciar usuários do sistema',
      icon: 'person-outline',
      route: '/cadastro/usuarios',
      gradient: 'linear-gradient(135deg, #e17055 0%, #fab1a0 100%)'
    }
  ];

  constructor(private router: Router) {
    addIcons({ peopleOutline, cubeOutline, personOutline, 'chevron-forward-outline': chevronForwardOutline });
  }

  navigateTo(route: string) {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
    this.router.navigateByUrl(route);
  }
}
