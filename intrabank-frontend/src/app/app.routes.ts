import type { Routes } from "@angular/router"
import { authGuard } from "./core/guards/auth.guard"

export const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./features/auth/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "",
    canActivate: [authGuard],
    loadChildren: () => import("./features/shell/shell.routes").then((m) => m.SHELL_ROUTES),
  },
  {
    path: "**",
    redirectTo: "",
  },
]

