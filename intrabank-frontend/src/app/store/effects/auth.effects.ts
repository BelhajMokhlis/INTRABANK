import { Injectable } from "@angular/core"
import {  Actions, createEffect, ofType } from "@ngrx/effects"
import { of } from "rxjs"
import { catchError, exhaustMap, map, tap } from "rxjs/operators"
import * as AuthActions from "../actions/auth.actions"
import { AuthService } from "../../core/service/auth/auth.service"
import { Router } from "@angular/router"

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ username, password, returnUrl }) =>
        this.authService.login(username, password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: response.user,
              token: response.token,
              returnUrl
            }),
          ),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message }))),
        ),
      ),
    ),
  )

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ returnUrl }) => {
          this.router.navigate([returnUrl || '/'])
        }),
      ),
    { dispatch: false },
  )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout()
          this.router.navigate(["/auth/login"])
        }),
      ),
    { dispatch: false },
  )

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      map(() => {
        const user = this.authService.getCurrentUser()
        if (user) {
          return AuthActions.loadUserSuccess({ user })
        } else {
          return AuthActions.loadUserFailure({ error: "User not found" })
        }
      }),
    ),
  )

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}
}

