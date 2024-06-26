import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Corrida } from '../definitions';
import { LoadingService } from './loading.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  public activeAgendamento$: Observable<Corrida | null>;
  private activeAgendamentoSubject: BehaviorSubject<Corrida | null>;
  public availableAgendamentos$: Observable<Corrida[]>;
  private availableAgendamentosSubject: BehaviorSubject<Corrida[]>;
  public myAgendamentos$: Observable<Corrida[]>;
  private myAgendamentosSubject: BehaviorSubject<Corrida[]>;

  constructor(private loadingService: LoadingService, private apiService: ApiService) {
    this.activeAgendamentoSubject = new BehaviorSubject<Corrida | null>(null);
    this.activeAgendamento$ = this.activeAgendamentoSubject.asObservable();
    this.availableAgendamentosSubject = new BehaviorSubject<Corrida[]>([]);
    this.availableAgendamentos$ = this.availableAgendamentosSubject.asObservable();
    this.myAgendamentosSubject = new BehaviorSubject<Corrida[]>([]);
    this.myAgendamentos$ = this.myAgendamentosSubject.asObservable();
  }

  setActiveAgendamento(agendamento: Corrida | null) {
    this.activeAgendamentoSubject.next(agendamento);
  }

  setAvailableAgendamentos(agendamentos: Corrida[]) {
    this.availableAgendamentosSubject.next(agendamentos);
  }

  setMyAgendamentos(agendamentos: Corrida[]) {
    this.myAgendamentosSubject.next(agendamentos);
  }

  getActiveAgendamento(corridaId: number) {
    return this.apiService.getAgendamento(corridaId).pipe(
      tap((agendamento) => {
        this.setActiveAgendamento(agendamento);
      })
    )
  }

  getAvailableAgendamentos(showLoader: boolean = true) {
    if(showLoader)
      this.loadingService.present("Buscando agendamentos...");

    return this.apiService.getAgendamentos({status: "2"}).pipe(
      map((data) => {
        const motoristaId = localStorage.getItem("motoristaId");

        if(motoristaId) {
          data.map((agendamento) => {
            agendamento.interessado = agendamento.motoristasInteressados.some((interesse) => {
              return interesse.motoristaId === Number(motoristaId)
            });

            agendamento.naoInteressado = agendamento.motoristasNaoInteressados.some((interesse) => {
              return interesse.motoristaId === Number(motoristaId)
            });

            return agendamento;
          })
        }
        return data;
      }),
      tap((data) => {
        this.setAvailableAgendamentos(data)
        this.loadingService.hide()
      })
    );
  }

  getMyAgendamentos(motoristaId: string, showLoader: boolean = true) {
    if(showLoader)
      this.loadingService.present("Buscando agendamentos...");

    return this.apiService.getAgendamentos({motoristaId}).pipe(
      tap((data) => {
        this.setMyAgendamentos(data)
        this.loadingService.hide()
      })
    );
  }

  addMotoristaAgendamento(motoristaId: number, corridaId: number, type: number) {
    this.loadingService.present("Registrando opção...");

    return this.apiService.addMotoristaAgendamento(motoristaId, corridaId, type).pipe(
      tap(() => {
        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(0);
      })
    )
  }

  updateStatus(corridaId: number, statusId: number) {
    this.loadingService.present("Atualizando agendamento...");

    return this.apiService.updateStatusAgendamento(corridaId, statusId).pipe(
      tap((corrida) => {
        this.setActiveAgendamento(null);

        const motoristaId = localStorage.getItem("motoristaId");
        if(motoristaId) {
          this.getMyAgendamentos(motoristaId);
        }

        if(corrida && corrida.statusId !== 8) {
          this.setActiveAgendamento(corrida);
        }

        this.loadingService.hide();
      }),
      catchError((error) => {
        this.loadingService.hide();
        return of(0);
      })
    )
  }
}
