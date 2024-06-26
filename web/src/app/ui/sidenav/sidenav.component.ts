import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type NavItem = {
  name: string;
  href: string;
  icon?: string;
  links: NavItem[];
}

@Component({
  selector: 'ui-sidenav',
  standalone: true,
  imports: [IconComponent, CommonModule, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  navItems: NavItem[];
  isMenuOpen = false;
  constructor(){
    this.navItems = [
      {name: "Home", href: "/", icon: "home-outline", links: []},
      {name: "Agendamentos", href: "/agendamentos", icon: "arrows-right-left-outline", links: []},

      // {
      //   name: "Manutenção",
      //   href: "",
      //   icon: "adjustments-horizontal-outline",
      //   links: [
      //     {name: "Motoristas", href: "/motoristas", links: []},
      //     {name: "Clientes", href: "/clientes", links: []},
      //   ]
      // }
    ]
  }
}
