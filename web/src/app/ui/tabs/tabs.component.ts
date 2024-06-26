import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type Tab = {
  id: number;
  name: string;
}

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  @Input({required: true}) tabs: Tab[] = [];
  @Output() tabChanged = new EventEmitter<number>();
  activeTab = 0;

  constructor() {
    if(this.tabs.length > 0)
      this.activeTab = this.tabs[0].id;
  }

  onTabChanged(id: number) {
    if(this.activeTab === id)
      return;

    this.tabChanged.emit(id);
    this.activeTab = id;
  }
}
