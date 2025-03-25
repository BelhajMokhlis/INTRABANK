import { createReducer, on } from "@ngrx/store"
import type { UserState } from "../state/app.state"
import * as UserActions from "../actions/user.actions"

export const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  totalElements: 0,
  pageResponse: null
}

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, state => ({
    ...state,
    loading: true
  })),
  on(UserActions.loadUsersSuccess, (state, { pageResponse }) => ({
    ...state,
    loading: false,
    pageResponse
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
)

