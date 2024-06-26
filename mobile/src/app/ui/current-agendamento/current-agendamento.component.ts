import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { Observable, tap } from 'rxjs';
import { Corrida } from 'src/app/definitions';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { MotoristaService } from 'src/app/services/motorista.service';
import { AgendamentoComponent } from '../agendamento/agendamento.component';
import { IconComponent } from "../icon/icon.component";
import { ActionToastComponent } from "../action-toast/action-toast.component";
import { UtilService } from 'src/app/services/util.service';

type UpdateInfo = {
  action: string;
  message: string;
}

@Component({
    selector: 'ui-current-agendamento',
    templateUrl: './current-agendamento.component.html',
    styleUrls: ['./current-agendamento.component.scss'],
    standalone: true,
    imports: [IonRippleEffect, CommonModule, AgendamentoComponent, IconComponent, ActionToastComponent]
})
export class CurrentAgendamentoComponent implements OnInit {
  public utilService: UtilService;

  isActionToastOpen: boolean = false;
  confirmationTitle: string = 'Confirmar ação!';
  isOpen: boolean = false;
  agendamento$: Observable<Corrida | null>;
  statusList: Map<number, UpdateInfo>;
  isReseting: boolean = false;
  status: any;

  constructor(private agendamentoService: AgendamentoService, private motoristaService: MotoristaService) {
    this.utilService = inject(UtilService);

    this.status = [
        { 
          id: 4,
          message: "Motorista indo para local de embarque"
        },
        {
          id: 5,
          message: "Motorista chegou no local de embarque"
        },
        {
          id: 6,
          message: "Cliente recebido, indo para desembarque"
        },
        { 
          id: 7,
          message: "Cliente entregue no local de desembarque"
        }
    ];
    this.statusList = new Map([
      [4,
        {
          action: "Iniciar agendamento", 
          message: "Deseja realmente iniciar o agendamento?",
          completion: "Agendamento iniciado"
        }
      ],
      [5, 
        { 
          action: "Cheguei no local de embarque", 
          message: "Confirmar que está no local de embarque?",
          completion: "Motorista chegou no embarque"
        }
      ],
      [6, 
        { 
          action: "Cliente recebido", 
          message: "Confirmar que o cliente chegou e foi emarcado?" ,
          completion: "Cliente embarcou"
        }
      ],
      [7, 
        { 
          action: "Finalizar agendamento",
          message: "Confirmar que o cliente foi entrege no local de desembarque e encerrar agendamento?",
          completion: "Cliente entregue no desembarque"
        }
      ],
      [8, 
        { 
          action: "Agendamento finalizado",
          message: "",
          completion: ""
        }
      ],
    ]);
    this.agendamento$ = this.agendamentoService.activeAgendamento$;
    this.motoristaService.motorista$.pipe(
      tap((motorista) => {
        this.agendamentoService.setActiveAgendamento(null);

        if(motorista?.activeCorridaId) {
          this.agendamentoService.getActiveAgendamento(motorista.activeCorridaId).subscribe();
        }
      })
    ).subscribe();
  }

  handleConfirmation() {
    this.isActionToastOpen = true;
  }

  updateStatus(choice: string, corridaId: number, currentStatus: number) {
    if(choice === 'confirm') {
      const status = this.isReseting ? 4 : currentStatus + 1;
      this.agendamentoService.updateStatus(corridaId, status).subscribe();
    }

    this.isActionToastOpen = false;
    this.isReseting = false;
  }

  ngOnInit() {
    const motorista = this.motoristaService.getMotoristaValue();
    if(motorista) {

    }
  }
}
