import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Corrida, Motorista } from '../definitions';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { IconComponent } from '../ui/icon/icon.component';
import { MotoristaService } from '../services/motorista.service';
import { AgendamentoService } from '../services/agendamento.service';
import { IonContent, IonItem, IonLabel, IonRippleEffect } from '@ionic/angular/standalone';
import { AgendamentoComponent } from '../ui/agendamento/agendamento.component';

type Filter = {
  sim: boolean;
  nao: boolean;
  pendente: boolean;
}

@Component({
  selector: 'app-corridas-disponiveis',
  templateUrl: './corridas-disponiveis.page.html',
  styleUrls: ['./corridas-disponiveis.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    IonContent,
    IonItem,
    IonLabel,
    IonRippleEffect,
    AgendamentoComponent
  ]
})
export class CorridasDisponiveisPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  agendamentos$: Observable<Corrida[]>;
  motorista$: Observable<Motorista | null>;
  interessadosOpen: Map<number, boolean> = new Map<number, boolean>();

  private filterSubject: BehaviorSubject<Filter>;
  filter$: Observable<Filter>;

  constructor(
    private agendamentoService: AgendamentoService,
    private motoristaService: MotoristaService,
    private cdr: ChangeDetectorRef
  ) {
    let filter = localStorage.getItem("filter");

    if(!filter) {
      filter = JSON.stringify({ sim: true, nao: true, pendente: true });
      localStorage.setItem("filter", filter)
    }

    this.filterSubject = new BehaviorSubject<Filter>(JSON.parse(filter));
    this.filter$ = this.filterSubject.asObservable();
    this.agendamentos$ = this.agendamentoService.availableAgendamentos$;
    this.filter$.pipe(tap((filter) => {
      localStorage.setItem("filter", JSON.stringify(filter));

      this.agendamentos$ = this.agendamentoService.availableAgendamentos$.pipe(map((agendamentos) => {
        return agendamentos.filter((agendamento) => {

          // Todos
          if(filter.sim && filter.nao && filter.pendente) {
            return true;
          }

          // Sim disabled
          if(!filter.sim && agendamento.interessado) {
            return false;
          }

          // Nao disabled
          if(!filter.nao && agendamento.naoInteressado) {
            return false;
          }

          // Pendente disabled
          if(!filter.pendente && !agendamento.interessado && !agendamento.naoInteressado) {
            return false;
          }

          return true;
        });
      }))
    })).subscribe()
    // this.filterAgendamentos();
    this.motorista$ = this.motoristaService.motorista$;
  }

  updateFilter(type: 'todos' | 'sim' | 'nao' | 'pendente') {
    let filter = this.filterSubject.getValue();

    switch(type) {
      case 'todos':
        if(filter.sim && filter.nao && filter.pendente) {
          filter = { sim: false, nao: false, pendente: false };
          break;
        }
        
        filter = { sim: true, nao: true, pendente: true };
        break;
      case 'sim':
        filter.sim = !filter.sim;
        break;
      case 'nao':
        filter.nao = !filter.nao;
        break;
      case 'pendente':
        filter.pendente = !filter.pendente;
        break;
    }

    this.filterSubject.next(filter);
  }

  scrollToTop() {
    if(this.content) {
      this.content.scrollToTop(500);
    }
  }

  handleInterestChoice(option: string) {
    console.log(option);
  }

  loadCorridas() {
    this.agendamentoService.getAvailableAgendamentos().pipe(tap(() => this.scrollToTop())).subscribe();
  }

  isRegistered(motoristasInteressados: Motorista[]) {
    let isRegistered = false;
    const motoristaId = localStorage.getItem("motoristaId");

    if(motoristaId) {
      isRegistered = motoristasInteressados.some((element) => element.id === Number(motoristaId));
    }

    return isRegistered;
  }

  async ngOnInit() {
    this.loadCorridas();
  }

  ionViewWillEnter() {
    this.loadCorridas();
    this.agendamentos$.subscribe(() => {
      this.cdr.detectChanges();
    })
  }
}
