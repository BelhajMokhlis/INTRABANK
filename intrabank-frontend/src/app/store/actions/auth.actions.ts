import { createAction, props } from "@ngrx/store"
import type { User } from "../../shared/models/user.model"

export const login = createAction(
  "[Auth] Login",
  props<{ username: string; password: string; returnUrl?: string }>(),
)

export const loginSuccess = createAction(
  "[Auth] Login Success", 
  props<{ user: User; token: string; returnUrl?: string }>(),
)

export const loginFailure = createAction("[Auth] Login Failure", props<{ error: string }>())

export const logout = createAction("[Auth] Logout")

export const loadUser = createAction("[Auth] Load User")

export const loadUserSuccess = createAction("[Auth] Load User Success", props<{ user: User }>())

export const loadUserFailure = createAction("[Auth] Load User Failure", props<{ error: string }>())

