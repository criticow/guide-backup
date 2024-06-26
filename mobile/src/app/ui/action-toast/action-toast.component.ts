import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'ui-action-toast',
  templateUrl: './action-toast.component.html',
  styleUrls: ['./action-toast.component.scss'],
  standalone: true,
  imports: [CommonModule, IonRippleEffect]
})
export class ActionToastComponent  implements OnInit {
  @Input({required: true}) isOpen: boolean = false;
  @Input({required: true}) title: string = '';
  @Output() choice: EventEmitter<'cancel' | 'confirm'> = new EventEmitter<'cancel' | 'confirm'>();

  constructor() { }

  onChoice(type: 'cancel' | 'confirm') {
    this.choice.emit(type);
  }

  ngOnInit() {}

}
