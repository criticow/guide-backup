import { Routes } from '@angular/router';
import { AgendamentosComponent } from './pages/agendamentos/agendamentos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'agendamentos', pathMatch: 'full' },
  { path: "agendamentos", component: AgendamentosComponent},
];
