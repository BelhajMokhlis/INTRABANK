import { Component, OnInit } from "@angular/core"
import { AuthService } from "./core/service/auth/auth.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check authentication status
    if (this.authService.isAuthenticated()) {
      // If we have a stored route, navigate to it, otherwise stay on current route
      const storedRoute = localStorage.getItem('returnUrl');
      if (storedRoute) {
        localStorage.removeItem('returnUrl');
        this.router.navigateByUrl(storedRoute);
      }
    } else {
      // Store current URL if not on login page
      if (!window.location.pathname.includes('/auth/login')) {
        localStorage.setItem('returnUrl', window.location.pathname);
      }
      this.router.navigate(['/auth/login']);
    }
  }
}

