import { Injectable, inject } from '@angular/core';
import { Corrida, Motorista } from '../definitions';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private isAuthenticated: boolean = false;
  public novosAgendamentos$: Observable<Corrida[]>;
  private novosAgendamentosSubject: BehaviorSubject<Corrida[]>;

  constructor() {
    this.novosAgendamentosSubject = new BehaviorSubject<Corrida[]>([]);
    this.novosAgendamentos$ = this.novosAgendamentosSubject.asObservable();
  }

  // Start Novos agendamentos / from notifications
  getNovosAgendamentos(){
    return this.novosAgendamentosSubject.getValue();
  }

  setNovosAgendamentos(agendamentos: Corrida[]){
    this.novosAgendamentosSubject.next(agendamentos);
  }

  addNovoAgendamento(agendamento: Corrida){
    const currentNovosAgendamentos = this.novosAgendamentosSubject.getValue();
    this.novosAgendamentosSubject.next([...currentNovosAgendamentos, agendamento]);
  }

  removeNovoAgendamento(id: number) {
    let currentNovosAgendamentos = this.novosAgendamentosSubject.getValue();
    currentNovosAgendamentos = currentNovosAgendamentos.filter((agendamento) => agendamento.id !== id);
    this.novosAgendamentosSubject.next(currentNovosAgendamentos);
  }

  clearNovosAgendamentos(){
    this.novosAgendamentosSubject.next([]);
  }
  // End novos agendamentos

  setIsAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }
}
