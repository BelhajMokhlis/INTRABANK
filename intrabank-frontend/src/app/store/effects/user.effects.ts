import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { map, mergeMap, catchError, switchMap } from "rxjs/operators"
import * as UserActions from "../actions/user.actions"
import { UserService } from "../../core/service/user/user.service"

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(({ page, size, searchTerm, department, role }) =>
        this.userService.getUsers(page, size, department, role, searchTerm).pipe(
          map(pageResponse => UserActions.loadUsersSuccess({ pageResponse })),
          catchError(error => of(UserActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  )

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      switchMap(({ user }) =>
        this.userService.createUser(user).pipe(
          map(createdUser => UserActions.createUserSuccess({ user: createdUser })),
          catchError(error => of(UserActions.createUserFailure({ error: error.message })))
        )
      )
    )
  )

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ id, user }) =>
        this.userService.updateUser(id, user).pipe(
          map(updatedUser => UserActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => of(UserActions.updateUserFailure({ error: error.message })))
        )
      )
    )
  )

  // Reload users after successful create/update
  userSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUserSuccess, UserActions.updateUserSuccess),
      map(() => UserActions.loadUsers({ 
        page: 0, 
        size: 10,
        searchTerm: '',
        department: '',
        role: ''
      }))
    )
  )

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(() => UserActions.deleteUserSuccess({ id })),
          catchError(error => of(UserActions.deleteUserFailure({ error: error.message })))
        )
      )
    )
  )

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}

