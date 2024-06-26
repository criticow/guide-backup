import { Component, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'ui-alert-toast',
  templateUrl: './alert-toast.component.html',
  styleUrls: ['./alert-toast.component.scss'],
  standalone: true,
  imports: [IconComponent, IonRippleEffect, CommonModule]
})
export class AlertToastComponent  implements OnInit {
  isShowing$: Observable<boolean>;
  title$: Observable<string>;
  message$: Observable<string>;
  progress$: Observable<number>;

  constructor(private alertService: AlertService) {
    this.isShowing$ = this.alertService.isShowing$;
    this.title$ = this.alertService.title$;
    this.message$ = this.alertService.message$;
    this.progress$ = this.alertService.progress$;
  }

  closeToast() {
    this.alertService.hide();
  }

  ngOnInit() {}
}
