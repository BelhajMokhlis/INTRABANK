import { inject } from "@angular/core"
import { type CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../service/auth/auth.service"

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated()) {
    return true
  }

  // Store the attempted URL for redirecting
  localStorage.setItem('returnUrl', state.url);
  
  // Navigate to login page
  router.navigate(['/auth/login'])
  return false
}

