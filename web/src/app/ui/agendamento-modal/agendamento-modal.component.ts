import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IconComponent } from "../icon/icon.component";
import { Corrida } from '../../definitions';
import { FormsModule, NgForm } from '@angular/forms';
import { AgendamentoService } from '../../services/agendamento.service';
import { catchError, of, tap } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { CurrencyMaskDirective } from '../../masks/currency.mask';
import { UtilService } from '../../services/util.service';
import { CommonModule } from '@angular/common';
import { DateMaskDirective } from '../../masks/date.mask';
import { TimeMaskDirective } from '../../masks/time.mask';
import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'ui-agendamento-modal',
  standalone: true,
  templateUrl: './agendamento-modal.component.html',
  styleUrl: './agendamento-modal.component.scss',
  imports: [
    IconComponent,
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    CurrencyMaskDirective,
    DateMaskDirective,
    TimeMaskDirective
  ]
})
export class AgendamentoModalComponent implements OnInit {
  // Dependence Injection
  private agendamentoService: AgendamentoService;
  public utilService: UtilService;
  private loadingService: LoadingService;
  private apiService: ApiService;

  // Class Variables
  @Input() agendamentoId: number | null;
  @Output() close: EventEmitter<null>;
  public agendamento: Corrida;
  public valorProposto: string;
  public agendamentoRef: Corrida | null;

  // Initialization
  constructor() {
    this.agendamentoService = inject(AgendamentoService);
    this.utilService = inject(UtilService);
    this.loadingService = inject(LoadingService);
    this.apiService = inject(ApiService);

    this.agendamento = {} as Corrida;
    this.agendamentoId = null;
    this.close = new EventEmitter();
    this.valorProposto = '';
    this.agendamentoRef = null;
  }

  // Methods
  public onClose() {
    this.close.emit();
  }

  public updateValorProposto() {
    if(!this.agendamento.valorQuilometro || !this.agendamento.quilometrosRodados) {
      this.valorProposto = '';
      return;
    }

    const value = (this.agendamento.valorQuilometro / 100) * (this.agendamento.quilometrosRodados / 100);
    this.valorProposto = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\D/g, '');
  }

  public onSubmit(form: NgForm) {
    if(form.valid) {
      if(!this.agendamento.id) {
        this.agendamento.statusId = 2;
        this.loadingService.present("Salvando agendamento...");
        this.apiService.postAgendamento(this.agendamento).pipe(
          tap((agendamento) => {
            this.agendamentoService.getAgendamentos();
            this.loadingService.hide();
            this.onClose();
          }),
          catchError((error) => {
            this.loadingService.hide();
            return of(0);
          })
        ).subscribe();

        return;
      }

      this.loadingService.present("Salvando agendamento...");
      this.apiService.updateAgendamento(this.agendamento).pipe(
        tap((agendamento) => {
          this.agendamentoService.getAgendamentos();
          this.loadingService.hide();
          this.onClose();
        }),
        catchError((error) => {
          this.loadingService.hide();
          return of(0);
        })
      ).subscribe();
    }
  }

  public isFormValid() {
    const isValid = JSON.stringify(this.agendamentoRef) !== JSON.stringify(this.agendamento);

    return isValid;
  }

  ngOnInit() {
    // If the agendamentoId is not null the user is editing the agendamento
    if(this.agendamentoId) {
      this.agendamentoService.getAgendamento(this.agendamentoId).pipe(
        tap((agendamento) => {
          if(agendamento) {
            this.agendamento = agendamento

            // ['yyyy-MM-dd', 'HH:mm:ss.000Z']
            const [date, fullTime] = this.agendamento.dataHora.split("T");
            // ['yyyy', 'MM', 'dd']
            const [year, month, day] = date.split('-');
            // ['HH:mm:ss', '000Z']
            const [time, _zone] = fullTime.split('.');
            // ['HH', 'mm', 'ss']
            const [hours, minutes, _seconds] = time.split(":");

            this.agendamento.data = day + month + year;
            this.agendamento.hora = hours + minutes;

            this.updateValorProposto();
            this.agendamentoRef = JSON.parse(JSON.stringify(this.agendamento));
          }
        })
      ).subscribe();
    }
  }
}
