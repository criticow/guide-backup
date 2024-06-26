import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AgendamentoService } from '../../services/agendamento.service';
import { Corrida, MotoristaInteressado, MotoristaNaoInteressado } from '../../definitions';
import { Observable, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IconComponent } from "../icon/icon.component";

@Component({
    selector: 'ui-agendamento-interest-viewer',
    standalone: true,
    templateUrl: './agendamento-interest-viewer.component.html',
    styleUrl: './agendamento-interest-viewer.component.scss',
    imports: [CommonModule, IconComponent]
})
export class AgendamentoInterestViewerComponent implements OnInit {
  @Input({required: true}) agendamentoId!: number;
  @Output() close: EventEmitter<null>;

  private agendamentoService: AgendamentoService;
  public motoristasInteressados: MotoristaInteressado[];
  public motoristasNaoInteressados: MotoristaNaoInteressado[];

  public isYesOpen: boolean;
  public agendamento$: Observable<Corrida | null>;

  constructor() {
    this.close = new EventEmitter();
    this.agendamentoService = inject(AgendamentoService);
    this.motoristasInteressados = [];
    this.motoristasNaoInteressados = [];
    this.isYesOpen = true;
    this.agendamento$ = of(null);
  }

  public onClose() {
    this.close.emit();
  }

  public connectMotorista(motoristaId: number) {
    this.agendamentoService.connectMotorista(this.agendamentoId, motoristaId).pipe(
      tap((agendamento) => {
        if(agendamento) {
          this.loadAgendamento();
        }
      })
    ).subscribe();
  }

  private loadAgendamento() {
    if(this.agendamentoId) {
      this.agendamento$ = this.agendamentoService.getAgendamento(this.agendamentoId).pipe(
        tap((agendamento) => {
          if(agendamento) {
            this.motoristasInteressados = agendamento.motoristasInteressados;
            this.motoristasNaoInteressados = agendamento.motoristasNaoInteressados;
          }
        })
      );
      this.agendamento$.subscribe();
    }
  }

  ngOnInit(): void {
    // If the agendamentoId is not null the user is editing the agendamento
    this.loadAgendamento();
  }


}
