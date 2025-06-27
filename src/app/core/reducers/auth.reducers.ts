// auth.reducer.ts

import { AuthActions, AuthActionTypes } from '../actions/auth.action';

export interface AuthState {
  loggedIn: boolean;
  token: string | undefined;
  user: any;
  isUserLoaded: boolean;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  token: undefined,
  user: undefined,
  isUserLoaded: false,
  loading: false,
};

export function authReducer(
  state = initialAuthState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.Login: {
      return {
        ...state,
        loggedIn: true,
        token: action.payload.token,
        isUserLoaded: false,
        loading: true, // Inicia o loading ao fazer login
      };
    }

    case AuthActionTypes.UserRequested: {
      return {
        ...state,
        loggedIn: true,
        loading: true, // Ativa o loading ao requisitar o usuário
      };
    }

    case AuthActionTypes.UserLoaded: {
      const _user: any = action.payload.user;
      return {
        ...state,
        user: _user,
        isUserLoaded: true,
        loggedIn: true,
        loading: false, // Desativa o loading após o usuário ser carregado
      };
    }

    case AuthActionTypes.Logout: {
      return initialAuthState; // Reseta o estado ao fazer logout
    }

    default:
      return state;
  }
}
