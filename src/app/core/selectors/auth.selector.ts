// NGRX
import { createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducers';
// Lodash
export const selectAuthState = (state: any) => state.auth;

export const isLoggedIn = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.loggedIn
);

export const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn);

export const currentAuthToken = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.token
);

export const isUserLoaded = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.isUserLoaded
);

export const isLoading = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.loading
);

export const currentUser = createSelector(
  selectAuthState,
  (auth: AuthState) => auth.user
);

export const currentUserRoleIds = createSelector(currentUser, (user) => {
  if (!user) {
    return [];
  }

  return user.roles;
});
