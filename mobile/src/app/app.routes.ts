import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'minhas-corridas',
    loadComponent: () => import('./minhas-corridas/minhas-corridas.page').then( m => m.MinhasCorridasPage),
    canActivate: [authGuard],
  },
  {
    path: 'corridas-disponiveis',
    loadComponent: () => import('./corridas-disponiveis/corridas-disponiveis.page').then( m => m.CorridasDisponiveisPage),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then( m => m.AuthPage),
  },
];
