import { createReducer, on } from "@ngrx/store"
import type { AuthState } from "../state/app.state"
import * as AuthActions from "../actions/auth.actions"

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(AuthActions.logout, () => initialState),
  on(AuthActions.loadUser, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.loadUserFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
)

