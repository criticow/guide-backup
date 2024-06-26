import { ChangeDetectorRef, Component, LOCALE_ID, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { IonRippleEffect, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { provideNgxMask } from 'ngx-mask';
import { GlobalService } from './services/global.service';
import { SidenavComponent } from './ui/sidenav/sidenav.component';
import { IconComponent } from './ui/icon/icon.component';
import { NotificationViewerComponent } from './ui/notification-viewer/notification-viewer.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { AlertToastComponent } from './ui/alert-toast/alert-toast.component';
import { StatusToggleComponent } from './ui/status-toggle/status-toggle.component';
registerLocaleData(localePt, 'pt');

import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { CurrentAgendamentoComponent } from './ui/current-agendamento/current-agendamento.component';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  providers: [{provide: LOCALE_ID, useValue: 'pt'}, provideNgxMask()],
  imports: [
    IonApp,
    IonRippleEffect,
    IonHeader,
    IonToolbar,
    IonRouterOutlet,
    RouterLink,
    SidenavComponent,
    IconComponent,
    NotificationViewerComponent,
    LoaderComponent,
    AlertToastComponent,
    StatusToggleComponent,
    CurrentAgendamentoComponent
  ],
})
export class AppComponent implements OnInit {
  constructor(
    public globalService: GlobalService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
    const device = await Device.getInfo();
    
    if(device.platform === 'android') {
      this.notificationService.init(this.cdr);
    }
  }
}
