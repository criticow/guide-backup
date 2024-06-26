import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Corrida, Motorista } from 'src/app/definitions';
import { IconComponent } from '../icon/icon.component';
import { IonRippleEffect, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { ActionToastComponent } from "../action-toast/action-toast.component";
import { UtilService } from 'src/app/services/util.service';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { Observable, tap } from 'rxjs';
import { DateTime } from 'luxon';

type InteresseState = {
  open: boolean;
  interessados: boolean;
}

@Component({
    selector: 'ui-agendamento',
    templateUrl: './agendamento.component.html',
    styleUrls: ['./agendamento.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      IconComponent,
      IonRippleEffect,
      IonSegment,
      IonSegmentButton,
      IonLabel,
      ActionToastComponent
    ]
})
export class AgendamentoComponent implements OnInit, OnDestroy {
  @Input({required: true}) agendamento!: Corrida;
  // 1: Agendamentos disponiveis, 2: notifications, 3: meus agendamentos, 4: active agendamento
  @Input({required: true}) type!: 1 | 2 | 3 | 4;
  @Output() choice: EventEmitter<'no' | 'yes'> = new EventEmitter<'no' | 'yes'>();
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() activate: EventEmitter<boolean> = new EventEmitter<boolean>();

  interesseMap: Map<number, InteresseState> = new Map<number, InteresseState>();
  isActionToastOpen: boolean = false;
  confirmationTitle: string = 'Confirmar ação!';
  currentAgendamentoId: number = -1;
  isInterested: boolean = false;
  interval: any;
  minutesRemaining: number = 0;
  hoursRemaining: number = 0;
  daysRemaining: number = 0;

  activeAgendamento$: Observable<Corrida | null>;

  constructor(
    public utilService: UtilService,
    private cdr: ChangeDetectorRef,
    private agendamentoService: AgendamentoService
  ) {
    this.activeAgendamento$ = this.agendamentoService.activeAgendamento$;
  }

  handleActionToastChoice(option: 'cancel' | 'confirm') {
    this.isActionToastOpen = false;

    if(option === 'confirm') {
      const motoristaId = localStorage.getItem("motoristaId");

      if(motoristaId) {
        this.agendamentoService.addMotoristaAgendamento(
          Number(motoristaId),
          this.currentAgendamentoId,
          this.isInterested ? 1 : 2
        ).pipe(
          tap(() => {
            // this.cdr.detectChanges();
            this.onClose();
          })
        ).subscribe();
      }
    }
  
    this.cdr.detectChanges();
  }

  onChoice(option: 'no' | 'yes', agendamentoId: number) {
    this.isActionToastOpen = true;
    this.currentAgendamentoId = agendamentoId;
    this.isInterested = option === 'yes' ? true : false;

    this.cdr.detectChanges();
  }

  onClose() {
    this.agendamentoService.getAvailableAgendamentos(false).pipe(tap(() => {
      this.cdr.detectChanges();
    })).subscribe();
    this.close.emit(true);
  }

  onActivate() {
    this.activate.emit(true);
  }

  openInteresseTab(id: number) {
    const map = this.interesseMap.get(id);

    if(!map) {
      this.interesseMap.set(id, { open: true, interessados: true });
      this.cdr.detectChanges();
      return;
    }

    this.interesseMap.set(id, { open: !map.open, interessados: map.interessados });
    this.cdr.detectChanges();
  }

  changeInteresseType(id: number, value: boolean) {
    const map = this.interesseMap.get(id);

    if(map){
      map.interessados = value;
    }
    this.cdr.detectChanges();
  }

  getRemainingTime() {
    const now = DateTime.now().setZone("America/Sao_Paulo");
    let nowISO = now.toFormat("yyyy-MM-dd'T'HH:mm':00.000Z'");
    const startDate = new Date(nowISO);
    const endDate = new Date(this.agendamento.dataHora);
    const diff = endDate.getTime() - startDate.getTime();
    this.minutesRemaining = Math.floor((diff / (1000 * 60)) % 60);
    this.hoursRemaining = Math.floor((diff / (1000 * 60 * 60)) % 24);
    this.daysRemaining = Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  ngOnInit() {
    // Updates every 1 minute
    this.getRemainingTime();
    this.interval = setInterval(() => {
      this.getRemainingTime();
    }, 2000)
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
