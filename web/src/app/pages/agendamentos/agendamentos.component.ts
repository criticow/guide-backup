import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';
import { RouterLink } from '@angular/router';
import { ActionToastChoices, AgendamentoCardAction, Corrida } from '../../definitions';
import { AgendamentoCardComponent } from "../../ui/agendamento-card/agendamento-card.component";
import { Observable, catchError, of, tap } from 'rxjs';
import { AgendamentoService } from '../../services/agendamento.service';
import { AgendamentoModalComponent } from "../../ui/agendamento-modal/agendamento-modal.component";
import { ActionToastComponent } from "../../ui/action-toast/action-toast.component";
import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { AgendamentoInterestViewerComponent } from "../../ui/agendamento-interest-viewer/agendamento-interest-viewer.component";

@Component({
    selector: 'app-corridas',
    standalone: true,
    templateUrl: './agendamentos.component.html',
    styleUrl: './agendamentos.component.scss',
    imports: [CommonModule, IconComponent, RouterLink, AgendamentoCardComponent, AgendamentoModalComponent, ActionToastComponent, AgendamentoInterestViewerComponent]
})
export class AgendamentosComponent implements OnInit{
  // Dependence Injection
  private agendamentoService: AgendamentoService;
  private apiService: ApiService;
  private loadingService: LoadingService;

  // Class Variables
  public statusList: Map<number, { description: string, color: string }> = new Map();
  public agendamentos$: Observable<Corrida[]>;
  public currentAgendamento: Corrida | null;
  public isAgendamentoModalOpen: boolean;
  public isDeleteConfirmationOpen: boolean;
  public isInterestViewerOpen: boolean;

  // Initialization
  constructor(){
    this.agendamentoService = inject(AgendamentoService);
    this.apiService = inject(ApiService);
    this.loadingService = inject(LoadingService);

    this.agendamentos$ = this.agendamentoService.agendamentos$;
    this.currentAgendamento = null;
    this.isAgendamentoModalOpen = false;
    this.isDeleteConfirmationOpen = false;
    this.isInterestViewerOpen = false;
  }

  // Methods
  public handleActionChoice(action: AgendamentoCardAction, agendamento: Corrida) {
    this.currentAgendamento = agendamento;

    switch(action) {
      case 'edit':
        this.openAgendamentoModal();
        break;
      case 'delete':
        this.openDeleteConfirmationToast();
        break;
      case 'interests':
        this.openInterestViewer();
        break;
    }
  }

  public handleCloseAgendamentoModal() {
    this.isAgendamentoModalOpen = false;
    this.currentAgendamento = null;
  }

  public handleConfirmationChoice(choice: ActionToastChoices) {
    if(choice === 'confirm' && this.currentAgendamento) {
      const newStatus = this.currentAgendamento.statusId === 3 ? 2 : 3;
      const message = this.currentAgendamento.statusId === 3 ? 'Cancelando agendamento...' : 'Ativando agendamento...';

      this.loadingService.present(message);
      this.apiService.updateAgendamentoStatus(this.currentAgendamento.id, newStatus).pipe(
        tap((agendamento) => {
          this.agendamentoService.getAgendamentos();
          this.loadingService.hide();
        }),
        catchError((error) => {
          this.loadingService.hide();
          return of(0);
        })
      ).subscribe();
    }

    this.currentAgendamento = null;
    this.isDeleteConfirmationOpen = false;
  }

  public handleCloseInterestViewer() {
    this.isInterestViewerOpen = false;
    this.currentAgendamento = null;
  }

  public openInterestViewer() {
    this.isInterestViewerOpen = true;
  }

  public loadAgendamentos() {
    this.agendamentoService.getAgendamentos();
  }

  public openAgendamentoModal() {
    this.isAgendamentoModalOpen = true;
  }

  public openDeleteConfirmationToast() {
    this.isDeleteConfirmationOpen = true;
  }

  ngOnInit(): void {
    this.loadAgendamentos();
  }
}
