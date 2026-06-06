import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonCard, IonCardContent, IonIcon, IonGrid, IonRow, IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.page.html',
  styleUrls: ['./financeiro.page.scss'],
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonCard, IonCardContent, IonIcon, IonGrid, IonRow, IonCol
  ]
})
export class FinanceiroPage {

  constructor(private router: Router) {
    addIcons({ cashOutline, chevronForwardOutline, 'chevron-forward-outline': chevronForwardOutline });
  }

  navigateTo(route: string) {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
    this.router.navigateByUrl(route);
  }
}
