import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import { map } from "rxjs/operators"

import type { User } from "../../shared/models/user.model"
import { AppState } from "../../store/state/app.state"
import * as AuthActions from "../../store/actions/auth.actions"
import * as AuthSelectors from "../../store/selectors/auth.selectors"
import { Role } from "../../shared/models/role.model"
import { AuthService } from "../../core/service/auth/auth.service"

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./shell.component.html",
  styles: [],
})
export class ShellComponent implements OnInit {
  currentUser$: Observable<User | null>
  isAdmin$: Observable<boolean>
  sidebarOpen = true
  notificationsOpen = false
  userMenuOpen = false

  constructor(private store: Store<AppState>, private authService: AuthService) {
    this.currentUser$ = this.store.select(AuthSelectors.selectCurrentUser)
    this.isAdmin$ = this.store.select(AuthSelectors.selectCurrentUser).pipe(
      map(user => user?.role === 'ADMINISTRATOR')
    )
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadUser())
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen
    if (this.notificationsOpen) {
      this.userMenuOpen = false
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen
    if (this.userMenuOpen) {
      this.notificationsOpen = false
    }
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout())
  }
}

