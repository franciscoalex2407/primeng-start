import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import { MyPreset } from './myTheme';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
			}),
			withEnabledBlockingInitialNavigation()
		),
		provideHttpClient(withInterceptorsFromDi()),
		provideAnimationsAsync(),
		providePrimeNG({
			theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } },
		}),

		// provideToastr(),
		// provideEnvironmentNgxMask(),
		// provideEnvironmentNgxCurrency({
		// 	align: 'left',
		// 	allowNegative: true,
		// 	allowZero: true,
		// 	decimal: ',',
		// 	precision: 2,
		// 	prefix: 'R$ ',
		// 	suffix: '',
		// 	thousands: '.',
		// 	nullable: true,
		// 	min: null,
		// 	max: null,
		// 	inputMode: NgxCurrencyInputMode.Financial,
		// }),
		// importProvidersFrom(
		// 	StoreModule.forRoot(reducers, { metaReducers }),
		// 	StoreModule.forFeature('auth', authReducer),
		// 	EffectsModule.forRoot([AuthEffects])
		// ),

		// provideServiceWorker('ngsw-worker.js', {
		// 	enabled: !isDevMode(),
		// 	registrationStrategy: 'registerWhenStable:30000',
		// }),
	],
};
