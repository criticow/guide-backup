import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { Corrida } from '../definitions';
import { ApiService } from './api.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  // Dependence Injection
  private apiService: ApiService;
  private loadingService: LoadingService;

  // Class Variables
  public agendamentos$: Observable<Corrida[]>;
  private agendamentosSubject: BehaviorSubject<Corrida[]>;

  // Initialization
  constructor() {
    this.apiService = inject(ApiService);
    this.loadingService = inject(LoadingService);
    this.agendamentosSubject = new BehaviorSubject<Corrida[]>([]);
    this.agendamentos$ = this.agendamentosSubject.asObservable();
  }

  // Methodsss
  getAgendamentos() {
    this.loadingService.present("Carregando agendamentos...");
    this.apiService.getAgendamentos().pipe(
      tap((agendamentos) => {
        this.agendamentosSubject.next(agendamentos);
        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(0);
      })
    ).subscribe();
  }

  getAgendamento(agendamentoId: number) {
    this.loadingService.present("Carregando agendamento...");
    return this.apiService.getAgendamento(agendamentoId).pipe(
      tap((agendamento) => {
        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(null);
      })
    );
  }

  postAgendamento(agendamento: Corrida) {
    this.loadingService.present("Salvando agendamento...");
    return this.apiService.postAgendamento(agendamento).pipe(
      tap((agendamento) => {
        this.getAgendamentos();
        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(null);
      })
    );
  }

  updateAgendamento(agendamento: Corrida) {
    this.loadingService.present("Salvando agendamento...");
    return this.apiService.updateAgendamento(agendamento).pipe(
      tap((agendamento) => {
        this.getAgendamentos();
        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(null);
      })
    );
  }

  connectMotorista(corridaId: number, motoristaId: number) {
    this.loadingService.present("Selecionando motorista...");
    return this.apiService.connectMotorista(corridaId, motoristaId).pipe(
      tap((agendamento) => {
        this.getAgendamentos();
        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(null);
      })
    );
  }
}
