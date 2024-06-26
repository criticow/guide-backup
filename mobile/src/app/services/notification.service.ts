import { ChangeDetectorRef, Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Channel, PushNotifications } from '@capacitor/push-notifications';
import { map, tap } from 'rxjs';
import { Corrida } from '../definitions';
import { MotoristaService } from './motorista.service';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { AgendamentoService } from './agendamento.service';
import { GlobalService } from './global.service';

class NotificationLayout {
  type: string;
  agendamento: Corrida;
  title: string;
  body: string;
  largeBody: string;
  constructor() {
    this.type = '';
    this.agendamento = {} as Corrida;
    this.title = '';
    this.body = '';
    this.largeBody = '';
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private globalService: GlobalService,
    private motoristaService: MotoristaService,
    private apiService: ApiService,
    private agendamentoService: AgendamentoService,
  ) { }
  async init(cdr: ChangeDetectorRef) {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    // Enable pop on screen notifications
    const notificationChannel: Channel = {
      id: 'pop-notifications',
      name: "Pop notifications",
      description: "Pop notifications",
      importance: 5,
      visibility: 1,
      sound: 'main_sound.wav',
      vibration: true,
    }

    await LocalNotifications.createChannel(notificationChannel);
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: "ANSWER_AGENDAMENTO",
          actions: [
            {
              id: 'yes',
              title: 'Sim'
            },
            {
              id: 'no',
              title: "Não"
            }
          ]
        }
      ]
    });

    this.addListeners(cdr);
  }

  async handleSchedule(notification: NotificationLayout, cdr: ChangeDetectorRef) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notification.agendamento.id,
          title: notification.title,
          smallIcon: "res://drawable/notification_icon",
          body: notification.body,
          largeBody: notification.largeBody,
          extra: notification,
          channelId: 'pop-notifications',
          schedule: {
            allowWhileIdle: true
          }
        },
      ],
    });

    switch(notification.type) {
      case 'agendamento':
        this.globalService.addNovoAgendamento(notification.agendamento);
        cdr.detectChanges();
        break;
      case 'alocation':
        const motorista = this.motoristaService.getMotoristaValue();
        if(motorista) {
          this.agendamentoService.getMyAgendamentos(String(motorista.id)).pipe(
            tap(() => cdr.detectChanges())
          ).subscribe();
        }
        break;
      default:
        this.agendamentoService.getAvailableAgendamentos().pipe(
          tap(() => cdr.detectChanges())
        ).subscribe();
        break;
    }
  }

  async addListeners(cdr: ChangeDetectorRef) {
    await PushNotifications.addListener('registration', token => {
      const motorista = this.motoristaService.getMotoristaValue();
      if(motorista) {
        this.motoristaService.registerToken(motorista.cpf, token.value);
      }
    });

    await PushNotifications.addListener('pushNotificationReceived', async(notification) => {
      const { data } = notification;

      if(!data['agendamento'] || !data['type'] || !data['title'] || !data['body'] || !data['largeBody']) {
        return;
      }

      data['agendamento'] = JSON.parse(data['agendamento']);

      this.handleSchedule(data, cdr);

    });

    this.actionPerformedListeners(cdr);
  }

  async actionPerformedListeners(cdr: ChangeDetectorRef) {
    await LocalNotifications.addListener('localNotificationActionPerformed', async(notification) => {
      const { extra } = notification.notification;

      if(!extra['agendamento'] || !extra['type'] || !extra['title'] || !extra['body'] || !extra['largeBody']) {
        return;
      }

      // extra['agendamento'] = JSON.parse(extra['agendamento']);

      switch(extra.type) {
        case 'alocation':
          break;
        default:
          this.apiService.getAgendamento(extra.agendamento.id).pipe(
            map((data) => {
              const motoristaId = localStorage.getItem("motoristaId");
  
              if(motoristaId) {
                data.interessado = !!data.motorista || data.motoristasInteressados.some((interesse) => {
                  return interesse.motoristaId === Number(motoristaId)
                });
  
                data.naoInteressado = !!data.motorista || data.motoristasNaoInteressados.some((interesse) => {
                  return interesse.motoristaId === Number(motoristaId)
                });
              }
  
              return data;
            }),
            tap((data) => {
              this.globalService.addNovoAgendamento(data);
              cdr.detectChanges();
            })
          ).subscribe()
      }
    });
  }
}
