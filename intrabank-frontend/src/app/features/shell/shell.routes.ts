import type { Routes } from "@angular/router"
import { ShellComponent } from "./shell.component"

export const SHELL_ROUTES: Routes = [
  {
    path: "",
    component: ShellComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadComponent: () => import("../dashboard/dashboard.component").then((m) => m.DashboardComponent),
      },
      {
        path: "documents",
        loadChildren: () => import("../../features/document/documents.routes").then((m) => m.DOCUMENTS_ROUTES),
      },
      {     
        path: "workflows",
        loadChildren: () => import("../../features/workflows/workflows.routes").then((m) => m.WORKFLOWS_ROUTES),
      },
      {
        path: "admin",
        loadChildren: () => import("../../features/admin/admin.routes").then((m) => m.ADMIN_ROUTES),
      },
      {
        path: "profile",
        loadChildren: () => import("../../features/profile/profile.routes").then((m) => m.profile_ROUTES),
      },
    ],

  },
]

