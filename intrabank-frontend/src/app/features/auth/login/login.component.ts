import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { Router, ActivatedRoute } from "@angular/router"
import type { Observable } from "rxjs"
import * as AuthActions from "../../../store/actions/auth.actions"
import * as AuthSelectors from "../../../store/selectors/auth.selectors"
import { AppState } from "../../../store/state/app.state"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent {
  loginForm: FormGroup
  isLoading$: Observable<boolean>
  error$: Observable<string | null>
  returnUrl: string = '/'

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })

    this.isLoading$ = this.store.select(AuthSelectors.selectAuthLoading)
    this.error$ = this.store.select(AuthSelectors.selectAuthError)
    
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    const { username, password } = this.loginForm.value
    this.store.dispatch(AuthActions.login({ username, password, returnUrl: this.returnUrl }))
  }
}

