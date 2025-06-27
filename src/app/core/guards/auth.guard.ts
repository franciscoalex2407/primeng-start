// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable, map, tap, filter, take, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { isUserLoaded } from '../selectors/auth.selector';
import { TokenService } from '../../services/token.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private store: Store<AppState>, private router: Router, private tokenService: TokenService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		const token = this.tokenService.getToken();

		if (!token) {
			this.router.navigateByUrl('/auth/login');
			return of(false);
		}
		return this.store.pipe(
			select(isUserLoaded),
			// Só emitir quando o usuário estiver carregado
			filter((loaded) => loaded === true),
			// Ou timeout após 5 segundos para evitar ficar preso
			take(1),
			tap((isLoaded) => {
				if (!isLoaded) {
					this.router.navigateByUrl('/auth/login');
				}
			}),
			map((isLoaded) => isLoaded)
		);
	}
}
