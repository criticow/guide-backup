import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {IonRippleEffect} from '@ionic/angular/standalone';
import { IconComponent } from '../icon/icon.component';
import { Observable, map } from 'rxjs';
import { Corrida } from 'src/app/definitions';
import { CommonModule } from '@angular/common';
import { GlobalService } from 'src/app/services/global.service';
import { AgendamentoComponent } from "../agendamento/agendamento.component";

@Component({
    selector: 'ui-notification-viewer',
    templateUrl: './notification-viewer.component.html',
    styleUrls: ['./notification-viewer.component.scss'],
    standalone: true,
    imports: [IonRippleEffect, IconComponent, CommonModule, AgendamentoComponent]
})
export class NotificationViewerComponent implements OnInit {
  agendamentos$: Observable<Corrida[]>;

  constructor(public globalService: GlobalService, private cdr: ChangeDetectorRef) {
    this.agendamentos$ = this.globalService.novosAgendamentos$;
  }

  lengthTest() {
    return this.agendamentos$.pipe(map(arr => arr.length));
  }

  removeAgendamento(id: number) {
    this.globalService.removeNovoAgendamento(id);
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.agendamentos$ = this.globalService.novosAgendamentos$;
  }
}
