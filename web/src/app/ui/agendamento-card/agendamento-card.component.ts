import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IconComponent } from "../icon/icon.component";
import { CommonModule } from '@angular/common';
import { AgendamentoCardAction, Corrida } from '../../definitions';
import { UtilService } from '../../services/util.service';
import { DateTime } from 'luxon';
import { ActionToastComponent } from "../action-toast/action-toast.component";

@Component({
    selector: 'ui-agendamento-card',
    standalone: true,
    templateUrl: './agendamento-card.component.html',
    styleUrl: './agendamento-card.component.scss',
    imports: [IconComponent, CommonModule, ActionToastComponent]
})
export class AgendamentoCardComponent {
  
  // Dependence Injection
  public utilService: UtilService;
  
  // Class Variables
  @Input({required: true}) agendamento!: Corrida;
  @Output() actionChoice: EventEmitter<AgendamentoCardAction>;
  public statusList: Map<number, { description: string, color: string }>;
  public minutesRemaining: number;
  public hoursRemaining: number;
  public daysRemaining: number;
  public isCardOpen: boolean;
  public isActionsOpen: boolean;

  // Initialization
  constructor() {
    this.utilService = inject(UtilService);
    this.statusList = new Map(
      [
        [1, {description: "Agendado", color: "bg-yellow-500"}],
        [2, {description: "Disponível", color: "bg-blue-500"}],
        [3, {description: "Cancelado", color: "bg-red-500"}],
        [4, {description: "Alocado", color: "bg-teal-500"}],
        [5, {description: "À caminho", color: "bg-purple-500"}],
        [6, {description: "Aguardando cliente", color: "bg-pink-500"}],
        [7, {description: "Em andamento", color: "bg-orange-500"}],
        [8, {description: "Finalizado", color: "bg-green-500"}],
      ]
    );
    this.minutesRemaining = -1;
    this.hoursRemaining = -1;
    this.daysRemaining = -1;
    this.actionChoice = new EventEmitter();
    this.isCardOpen = false;
    this.isActionsOpen = false;
  }

  onActionChoice(action: AgendamentoCardAction) {
    this.actionChoice.emit(action);
  }

  // Based on the current date and the dataHora from the agendamento gets the minutes, hours, days remaining
  public getTimeRemaining() {
    const now = DateTime.now().setZone("America/Sao_Paulo");
    let nowISO = now.toFormat("yyyy-MM-dd'T'HH:mm':00.000Z'");

    const startDate = new Date(nowISO);
    const endDate = new Date(this.agendamento.dataHora);
    // Calculate the difference in milliseconds between the two dates
    const diff = endDate.getTime() - startDate.getTime();

    // Convert the miliseconds from minutes and check how many minutes contains in 60 (minutes/hours)
    this.minutesRemaining = Math.floor((diff / (1000 * 60)) % 60);
    // Convert the miliseconds from hours and check how many minutes contains in 24 (hours/day) 
    this.hoursRemaining = Math.floor((diff / (1000 * 60 * 60)) % 24);
    // Convert the miliseconds from days
    this.daysRemaining = Math.floor(diff / (1000 * 60 * 60 * 24))
  }
}
