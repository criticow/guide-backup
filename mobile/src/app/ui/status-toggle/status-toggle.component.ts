import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActionToastComponent } from '../action-toast/action-toast.component';

import { IonToggle } from '@ionic/angular/standalone';
import { MotoristaService } from 'src/app/services/motorista.service';
import { Observable } from 'rxjs';
import { Motorista } from 'src/app/definitions';

@Component({
  selector: 'ui-status-toggle',
  templateUrl: './status-toggle.component.html',
  styleUrls: ['./status-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule, ActionToastComponent, IonToggle]
})
export class StatusToggleComponent implements OnInit {
  motorista$: Observable<Motorista | null>;
  isConfirming: boolean = false;
  isActive: boolean = true;
  confirmationTitle: string = 'Confirmar ação';
  confirmationMessages: string[] = [];

  constructor(private motoristaService: MotoristaService) {
    this.motorista$ = this.motoristaService.motorista$;
  }

  handleConfirmation() {
    this.isConfirming = true;

    if(this.isActive) {
      this.confirmationMessages = ['Alterar status para online?', 'Você irá receber notificações de agendamentos.'];
      return;
    }
    
    this.confirmationMessages = ['Alterar status para offline?', 'Você não irá receber notificações de agendamentos.'];
  }

  handleChoice(choice: string) {
    this.isConfirming = false;

    if(choice === 'confirm') {
      let motorista = this.motoristaService.getMotoristaValue();

      if(motorista) {
        this.motoristaService.changeStatus(motorista.cpf, !motorista.online);
      }
    }
  }

  ngOnInit() {}
}
