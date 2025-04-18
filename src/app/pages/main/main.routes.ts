import {Routes} from '@angular/router';
import {MainComponent} from './main.component';

export const routes: Routes = [
    {
      path: '',
      component: MainComponent,
      children: [
        {
          path: 'products',
          loadChildren: () => import('../products/products.routes').then(r => r.routes)
        },
        { path: '', redirectTo: 'products', pathMatch: 'full' }
      ]
    }
  ];