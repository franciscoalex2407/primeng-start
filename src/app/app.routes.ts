import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { AuthComponent } from './auth/auth.component';

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

	{
		path: 'auth',
		component: AuthComponent,
		children: [
			{ path: '', loadComponent: () => import('./auth/login/login.component').then((c) => c.LoginComponent) },
			//   {
			//     path: 'uikit',
			//     loadChildren: () => import('./app/pages/uikit/uikit.routes'),
			//   },
			//   { path: 'documentation', component: Documentation },
			//   { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
		],
	},
];
