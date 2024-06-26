import { Component, OnInit, inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { MotoristaService } from 'src/app/services/motorista.service';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';

@Component({
  selector: 'ui-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [IconComponent, CommonModule, IonRippleEffect, RouterLink, RouterLinkActive],
  standalone: true
})
export class SidenavComponent implements OnInit {
  isOpen = false;
  router = inject(Router);
  public appVersion: string;
  constructor(private globalService: GlobalService, private motoristaService: MotoristaService) {
    this.appVersion = '';
  }

  handleMenuState() {
    this.isOpen = !this.isOpen;
  }

  handleMenuSelection(link?: string) {
    if(link) {
      this.router.navigate([link]);
    }

    // Close the menu after x amount of time
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.router.navigate(["/auth"]);
    this.globalService.setIsAuthenticated(false);
    localStorage.removeItem("motoristaId");
    this.isOpen = false;
  }

  async ngOnInit() {
    const device = await Device.getInfo();
    if(device.platform === 'android') {
      const app = await App.getInfo();
      if(app) {
        this.appVersion = app.version;
      }
    }
    this.motoristaService.getMotorista();
  }

}
