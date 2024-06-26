import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Corrida } from '../definitions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getAgendamentos(options?: {motoristaId?: number, statusId?: number}) {
    return this.http.get<Corrida[]>(`${environment.API_URL}/api/corridas`, {params: options})
  }

  getAgendamento(agendamentoId: number) {
    return this.http.get<Corrida>(`${environment.API_URL}/api/corridas/${agendamentoId}`);
  }

  postAgendamento(agendamento: Corrida) {
    return this.http.post<Corrida>(`${environment.API_URL}/api/corridas`, agendamento);
  }

  updateAgendamento(agendamento: Corrida) {
    return this.http.put<Corrida>(`${environment.API_URL}/api/corridas`, agendamento);
  }

  updateAgendamentoStatus(corridaId: number, statusId: number) {
    return this.http.put<Corrida>(`${environment.API_URL}/api/corridas/update-status`, {
      corridaId,
      statusId
    })
  }

  connectMotorista(corridaId: number, motoristaId: number) {
    return this.http.put<Corrida>(`${environment.API_URL}/api/corridas/connect-motorista`, {
      corridaId,
      motoristaId
    })
  }
}
