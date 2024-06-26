import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Corrida, Motorista } from '../definitions';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {
  }

  login(cpf: string, senha: string) {
    return this.http.post<Motorista>(`${environment.API_URL}/api/auth/login`, {
      cpf, senha
    })
  }

  register(cpf: string, senha: string, dataNascimento: string) {
    return this.http.post<Motorista>(`${environment.API_URL}/api/auth/register`, {
      cpf, senha, dataNascimento
    });
  }

  getAgendamentos(options?: { status?: string, motoristaId?: string }) {
    let args = [];
    let query = "";

    if(options) {
      const {status, motoristaId} = options;

      if(status) {
        args.push("status=" + status);
      }

      if(motoristaId) {
        args.push("motoristaId=" + motoristaId);
      }

      if(args.length > 0) {
        query = "?" + args.join("&");
      }
    }

    return this.http.get<Corrida[]>(`${environment.API_URL}/api/corridas${query}`);
  }

  getAgendamento(corridaId: number) {
    return this.http.get<Corrida>(`${environment.API_URL}/api/corridas/${corridaId}`);
  }

  addMotoristaAgendamento(motoristaId: number, corridaId: number, type: number) {
    return this.http.put<Corrida>(`${environment.API_URL}/api/corridas/add-motorista`, {
      motoristaId,
      corridaId,
      type
    });
  }

  changeStatus(cpf: string, online: boolean) {
    return this.http.put<Motorista>(`${environment.API_URL}/api/motoristas/change-status`, {
      cpf,
      online
    });
  }

  setActiveAgendamento(cpf: string, corridaId: number) {
    return this.http.put<Motorista>(`${environment.API_URL}/api/motoristas/active-corrida`, {
      cpf,
      corridaId
    });
  }

  getMotorista(motoristaId: string) {
    return this.http.get<Motorista>(`${environment.API_URL}/api/motoristas/${motoristaId}`);
  }

  registerToken(cpf: string, token: string) {
    return this.http.put(`${environment.API_URL}/api/motoristas/register-token`, {
      cpf,
      token
    });
  }

  updateStatusAgendamento(corridaId: number, statusId: number) {
    return this.http.put<Corrida>(`${environment.API_URL}/api/corridas/update-status`, {
      corridaId,
      statusId
    });
  }
}
