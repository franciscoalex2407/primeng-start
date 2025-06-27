// Angular
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { skipWhile, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { currentUser } from '../selectors/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(currentUser),
      skipWhile((user) => !user),
      tap((user: any) => {
        // let roles = route.data['roles'] as Array<string>;
        // // console.log('user guard', user, roles);
        // if () {
        // }
      })
    );
  }
}
