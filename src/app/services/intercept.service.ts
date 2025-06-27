import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Logout } from '../core/actions/auth.action';
import { AppState } from '../core/reducers';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';

@Injectable()
export class InterceptService implements HttpInterceptor {
	private returnUrl: string = '';

	constructor(
		private store: Store<AppState>,
		private router: Router,
		private messageService: MessageService,
		private authService: AuthService,
		private tokenService: TokenService
	) {
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.returnUrl = event.url;
			}
		});
	}

	// intercept request and add token
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// tslint:disable-next-line:no-debugger
		// modify request
		const token = this.tokenService.getToken();
		console.log('token', token);

		request = request.clone({
			setHeaders: {
				// Authorization: `Bearer ${localStorage.getItem(environment.token)}`,
				Authorization: `Bearer ${token}`,
			},
		});

		return next.handle(request).pipe(
			tap(
				(event) => {
					if (event instanceof HttpResponse) {
						// console.log('event intercept', event);
						if (event.status == 201) {
							this.messageService.toastSuccess(event.body.message, '');
						}
					}
				},
				(error: any) => {
					console.log('error', error, request);

					if (error.status == 0) {
						// this.message.alertNet();
						this.messageService.toastError('Não foi possível se conectar com o servidor!');
					} else if (error.status == 401) {
						// this.messageService.presentAlertError(error.error.message);

						// this.modalCtrl.dismissAll();

						this.messageService.toastError(error.error.message);
						this.store.dispatch(new Logout());

						// this.authService.stopRefreshTokenTimer();
						// localStorage.removeItem(environment.token);
						// this.redirect.navigate(['/auth/login']);
					} else {
						console.error(error);

						let message = '';

						if (error?.error?.errors && Array.isArray(error?.error?.errors)) {
							for (let err of error.error.errors) {
								message += `${err} </br>`;
							}
						} else if (error?.error?.errors) {
							console.log('error.errors', error.error.errors);

							Object.keys(error.error.errors).forEach((key: any) => {
								for (const err of error.error.errors[key]) {
									console.log('error.errors key', err);

									message += `${err}`;
								}
								message += `</br>`;
							});
						} else if (error?.error?.message) {
							message = error.error.message;
						} else if (error?.error) {
							message = error.error;
						} else {
							message = `${error?.error?.message} </br>`;
						}

						this.messageService.toastError(message, 'Falha na requisição');
					}
				}
			)
		);
	}
}
