import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Corrida, Motorista } from '../definitions';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../ui/icon/icon.component';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { MotoristaService } from '../services/motorista.service';
import { AgendamentoService } from '../services/agendamento.service';
import { IonContent, IonRippleEffect } from '@ionic/angular/standalone';
import { AgendamentoComponent } from "../ui/agendamento/agendamento.component";

type Filter = {
  finalizado: boolean;
  pendente: boolean;
}

@Component({
    selector: 'app-minhas-corridas',
    templateUrl: './minhas-corridas.page.html',
    styleUrls: ['./minhas-corridas.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, IconComponent, IonContent, IonRippleEffect, AgendamentoComponent]
})
export class MinhasCorridasPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  agendamentos$: Observable<Corrida[]>;
  motorista$: Observable<Motorista | null>;
  private filterSubject: BehaviorSubject<Filter>;
  filter$: Observable<Filter>;

  constructor(
    private agendamentoService: AgendamentoService,
    private motoristaService: MotoristaService,
  ) {
    this.filterSubject = new BehaviorSubject<Filter>({finalizado: false, pendente: true});
    this.filter$ = this.filterSubject.asObservable();
    this.motorista$ = this.motoristaService.motorista$;
    this.agendamentos$ = this.agendamentoService.myAgendamentos$;
    this.filter$.pipe(tap((filter) => {
      this.agendamentos$ = this.agendamentoService.myAgendamentos$.pipe(map((agendamentos) => {
        return agendamentos.filter((agendamento) => {

          // Finalizado disabled
          if(!filter.finalizado && agendamento.statusId === 8) {
            return false;
          }

          // Pendente disabled
          if(!filter.pendente && agendamento.statusId !== 8) {
            return false;
          }

          return true;
        });
      }))
    })).subscribe()
  }

  scrollToTop() {
    if(this.content) {
      this.content.scrollToTop(500);
    }
  }

  updateFilter(type: 'finalizado' | 'pendente') {
    let filter = this.filterSubject.getValue();

    switch(type) {
      case 'finalizado':
        filter.finalizado = !filter.finalizado;
        break;
      case 'pendente':
        filter.pendente = !filter.pendente;
        break;
    }

    this.filterSubject.next(filter);
  }

  setActiveCorrida(corridaId: number) {
    this.motoristaService.setActiveAgendamento(corridaId).subscribe();
  }

  loadCorridas() {
    const motoristaId = localStorage.getItem("motoristaId");

    if(!motoristaId)
      return;

    this.agendamentoService.getMyAgendamentos(motoristaId).pipe(tap(() => this.scrollToTop())).subscribe();
  }

  ngOnInit() {
    this.loadCorridas();
  }

  ionViewWillEnter() {
    this.loadCorridas();
  }
}
