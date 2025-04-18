import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent),
    title: '',
    pathMatch: "full"
  },
  {
    path: 'new',
    loadComponent: () => import('./edit/edit.component').then(c => c.EditComponent),
    title: '',
    pathMatch: "full",
  },
  {
    path: ':productId',
    loadComponent: () => import(  './edit/edit.component').then(c => c.EditComponent),
    title: '',
    pathMatch: "full",
  }
];