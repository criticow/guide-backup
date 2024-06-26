import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoadingService } from './loading.service';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { MotoristaService } from './motorista.service';
import { GlobalService } from './global.service';
import { AlertService } from './alert.service';
import { Device } from '@capacitor/device';
import { Motorista } from '../definitions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private loadingService: LoadingService,
    private motoristaService: MotoristaService,
    private globalService: GlobalService,
    private router: Router,
    private alertService: AlertService
  ) { }

  login(cpf: string, senha: string) {
    this.loadingService.present("Validando informações...");

    return this.apiService.login(cpf, senha).pipe(
      tap(async (data) => {
        this.autenticate(data);
        this.loadingService.hide();
        this.router.navigate(["/home"]);
      }),
      catchError((error) => {
        this.loadingService.hide();
        this.alertService.present({ title: "Aviso!", message: error.error.msg });
        return of(0);
      })
    )
  }

  private async autenticate(motorista: Motorista) {
    localStorage.setItem("motoristaId", String(motorista.id));
    this.globalService.setIsAuthenticated(true);
    this.motoristaService.setMotorista(motorista);
    const device = await Device.getInfo();
    if(device.platform === 'android') {
      await PushNotifications.register();
    }
  }

  register(cpf: string, senha: string, dataNascimento: string) {
    this.loadingService.present("Validando informações...");

    return this.apiService.register(cpf, senha, dataNascimento).pipe(
      tap(async (data) => {
        this.autenticate(data);
        this.loadingService.hide();
        this.router.navigate(["/home"]);
      }),
      catchError((error) => {
        this.loadingService.hide();
        this.alertService.present({ title: "Aviso!", message: error.error.msg });
        return of(0);
      })
    )
  }
}