import { createSelector, createFeatureSelector } from "@ngrx/store"
import type { AuthState } from "../state/app.state"

export const selectAuthState = createFeatureSelector<AuthState>("auth")

export const selectCurrentUser = createSelector(selectAuthState, (state: AuthState) => state.user)

export const selectIsAuthenticated = createSelector(selectAuthState, (state: AuthState) => state.isAuthenticated)

export const selectAuthLoading = createSelector(selectAuthState, (state: AuthState) => state.isLoading)

export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error)

