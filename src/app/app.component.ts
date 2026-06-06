import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
