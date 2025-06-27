// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// Auth actions
import { AuthActionTypes, Login, Logout, UserLoaded, UserRequested } from '../actions/auth.action';
import { AppState } from '../reducers';
import { isUserLoaded } from '../selectors/auth.selector';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Injectable()
export class AuthEffects {
	private returnUrl: string = '';

	constructor(
		private actions$: Actions,
		private router: Router,
		private auth: AuthService,
		private store: Store<AppState>,
		private tokenService: TokenService
	) {
		// Escuta eventos de navegação para armazenar a URL atual
		this.router.events
			.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				// console.log('subscribe route', event);
				this.returnUrl = event.url;
			});
	}

	// Efeito para login
	login$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType<Login>(AuthActionTypes.Login),
				tap((action) => {
					this.tokenService.setToken(action.payload.token);
					console.log('login$');

					// this.store.dispatch(new UserRequested());
					location.href = '/';
				})
			);
		},
		{ dispatch: false }
	);

	// Efeito para logout
	logout$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType<Logout>(AuthActionTypes.Logout),
				tap(() => {
					this.tokenService.clearToken();
					this.router.navigate(['/auth/login'], {
						// queryParams: { returnUrl: this.returnUrl },
					});
				})
			);
		},
		{ dispatch: false }
	);

	// Efeito para carregar o usuário
	loadUser$ = createEffect(
		() => {
			return this.actions$.pipe(
				ofType<UserRequested>(AuthActionTypes.UserRequested),
				withLatestFrom(this.store.pipe(select(isUserLoaded))),
				mergeMap(([action, _isUserLoaded]) => this.auth.getUserByToken({ type: 'BUSINESS' })),
				tap((_user) => {
					if (_user) {
						this.store.dispatch(new UserLoaded({ user: _user }));
					} else {
						this.store.dispatch(new Logout());
					}
				})
			);
		},
		{
			dispatch: false,
		}
	);

	// Verificar sessão apenas na rota /admin
	init$: Observable<Action> = createEffect(() => {
		return defer(() => {
			const userToken = this.tokenService.getToken();

			let observableResult = of({ type: 'NO_ACTION' });

			// Se existir um token e a rota for /admin
			if (userToken) {
				// observableResult = of(new Login({ token: userToken }));
				observableResult = of(new UserRequested());
			}

			return observableResult;
		});
	});

	// Lógica para definir se a rota é a /admin
	private isAdminPage(url: string): boolean {
		// console.log('isAdminPage', url);
		return url.startsWith('/admin');
	}
}
