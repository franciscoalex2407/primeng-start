import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      //   { path: '', component: Dashboard },
      //   {
      //     path: 'uikit',
      //     loadChildren: () => import('./app/pages/uikit/uikit.routes'),
      //   },
      //   { path: 'documentation', component: Documentation },
      //   { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
    ],
  },
];
