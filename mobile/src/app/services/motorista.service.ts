import { Injectable } from '@angular/core';
import { Motorista } from '../definitions';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  public motorista$: Observable<Motorista | null>;
  private motoristaSubject: BehaviorSubject<Motorista | null>;

  constructor(private apiService: ApiService, private loadingService: LoadingService) {
    this.motoristaSubject = new BehaviorSubject<Motorista | null>(null);
    this.motorista$ = this.motoristaSubject.asObservable();
  }

  setMotorista(motorista: Motorista | null) {
    this.motoristaSubject.next(motorista);
  }

  getMotoristaValue() {
    return this.motoristaSubject.getValue();
  }

  getMotorista() {
    const motoristaId = localStorage.getItem("motoristaId");

    if(motoristaId) {
      this.loadingService.present("Buscando informações pessoais...");

      this.apiService.getMotorista(motoristaId).pipe(
        tap((motorista) => {
          this.setMotorista(motorista);
          this.loadingService.hide();
        }),
        catchError((error) => {
          this.loadingService.hide();
          return of(0);
        })
      ).subscribe();
    }
  }

  registerToken(cpf: string, token: string) {
    return this.apiService.registerToken(cpf, token).subscribe();
  }

  changeStatus(cpf: string, online: boolean) {
    this.loadingService.present("Alterando status...");

    this.apiService.changeStatus(cpf, online).pipe(
      tap((data) => {
        this.setMotorista(data);
        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(0);
      })
    ).subscribe();
  }

  setActiveAgendamento(corridaId: number) {
    const motorista = this.getMotoristaValue();

    if(!motorista) {
      return of(0);
    }

    this.loadingService.present("Marcando agendamento como ativo...");
    return this.apiService.setActiveAgendamento(motorista.cpf, corridaId).pipe(
      tap((motorista) => {
        this.setMotorista(motorista);
        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(0);
      })
    )
  }
}
