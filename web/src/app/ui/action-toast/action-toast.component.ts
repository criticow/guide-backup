import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionToastChoices } from '../../definitions';

@Component({
  selector: 'ui-action-toast',
  standalone: true,
  imports: [],
  templateUrl: './action-toast.component.html',
  styleUrl: './action-toast.component.scss'
})
export class ActionToastComponent {
  @Input({required: true}) title!: string;
  @Output() choice: EventEmitter<ActionToastChoices>;

  constructor(){
    this.choice = new EventEmitter();
  }

  public onChoice(choice: ActionToastChoices) {
    this.choice.emit(choice);
  }
}
