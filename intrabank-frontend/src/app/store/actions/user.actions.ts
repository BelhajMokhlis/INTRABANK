import { createAction, props } from "@ngrx/store"
import type { User } from "../../shared/models/user.model"

export const loadUsers = createAction(
  "[User] Load Users",
  props<{ page: number; size: number; searchTerm?: string; department?: string; role?: string }>()
)

export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ pageResponse: any }>()
)

export const loadUsersFailure = createAction("[User] Load Users Failure", props<{ error: string }>())

export const createUser = createAction(
  '[User] Create User',
  props<{ user: Partial<User> }>()
)

export const createUserSuccess = createAction(
  '[User] Create User Success',
  props<{ user: User }>()
)

export const createUserFailure = createAction(
  '[User] Create User Failure',
  props<{ error: string }>()
)

export const updateUser = createAction(
  '[User] Update User',
  props<{ id: string; user: Partial<User> }>()
)

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User }>()
)

export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>()
)

export const deleteUser = createAction(
  '[User] Delete User',
  props<{ id: string }>()
)

export const deleteUserSuccess = createAction(
  '[User] Delete User Success',
  props<{ id: string }>()
)

export const deleteUserFailure = createAction(
  '[User] Delete User Failure',
  props<{ error: string }>()
)

