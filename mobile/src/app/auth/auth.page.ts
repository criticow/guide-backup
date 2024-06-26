import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRippleEffect, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IconComponent } from '../ui/icon/icon.component';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonRippleEffect,
    CommonModule,
    FormsModule,
    IconComponent,
    NgxMaskDirective,
  ]
})
export class AuthPage implements OnInit {
  motoristaId = localStorage.getItem("motoristaId");
  isCreatingPassword = false;
  cpf = "";
  senha = "";
  senha2 = "";
  dataNascimento = "";
  isSenhaVisible = false;
  isSenha2Visible = false;
  public appVersion: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { 
    this.appVersion = '';
  }

  changeView() {
    this.isCreatingPassword = !this.isCreatingPassword;
    this.cpf = "";
    this.senha = "";
    this.senha2 = "";
    this.dataNascimento = "";
    this.isSenhaVisible = false;
    this.isSenha2Visible = false;
  }

  isFormValid() {
    let isValid = false;

    if(this.isCreatingPassword) {
      if(this.cpf.length === 11 && this.dataNascimento.length === 8 && this.senha && this.senha2 && this.senha === this.senha2)
        isValid = true

      return isValid;
    }

    if(this.cpf.length === 11 && this.senha)
      isValid = true;

    return isValid;
  }

  toggleVisibility(id: 1 | 2, element: HTMLInputElement) {
    switch(id) {
      case 1:
        this.isSenhaVisible = !this.isSenhaVisible;
        break;
      case 2:
        this.isSenha2Visible = !this.isSenha2Visible;
        break;
    }

    if(!element)
      return;
  
    element.focus();

    setTimeout(() => {
      const length = id === 1 ? this.senha.length : this.senha2.length;
      element.setSelectionRange(length, length);
    }, 0);
  }

  handleSubmit() {
    if(!this.isFormValid())
      return;

    if(this.isCreatingPassword) {
      const data = this.dataNascimento.substring(4) + "-" + this.dataNascimento.substring(2, 4) + "-" + this.dataNascimento.substring(0,2);

      this.authService.register(this.cpf, this.senha, data).subscribe();
      return;
    }

    this.authService.login(this.cpf, this.senha).subscribe();
  }

  clear() {
    this.isCreatingPassword = false;
    this.cpf = "";
    this.senha = "";
    this.senha2 = "";
    this.dataNascimento = "";
    this.isSenhaVisible = false;
    this.isSenha2Visible = false;
  }

  async ngOnInit() {
    const device = await Device.getInfo();

    if(device.platform === 'android') {
      const appInfo = await App.getInfo()
  
      if(appInfo) {
        this.appVersion = appInfo.version;
      }
    }

    if(this.motoristaId)
      this.router.navigate(["/"]);
  }
}
