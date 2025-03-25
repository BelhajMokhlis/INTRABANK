import { createSelector, createFeatureSelector } from "@ngrx/store"
import type { UserState } from "../state/app.state"
import type { AppState } from "../state/app.state"

export const selectUserState = createSelector(
  (state: AppState) => state.user,
  (user) => user
)

export const selectAllUsers = createSelector(selectUserState, (state: UserState) => state.users)

export const selectSelectedUser = createSelector(selectUserState, (state: UserState) => state.selectedUser)

export const selectUsersLoading = createSelector(selectUserState, (state: UserState) => state.isLoading)

export const selectUsersError = createSelector(selectUserState, (state: UserState) => state.error)

export const selectUsersTotalElements = createSelector(selectUserState, (state: UserState) => state.totalElements)

export const selectUserSaveSuccess = createSelector(
  selectUserState,
  (state: UserState) => !state.error && !state.isLoading
)


