import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'start',
    loadComponent: () =>
      import('@features/start/start.component').then((m) => m.StartComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('@features/game/game.component').then((m) => m.GameComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('@features/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: '**',
    redirectTo: 'start',
    pathMatch: 'full',
  },
];
