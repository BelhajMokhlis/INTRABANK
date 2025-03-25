import type { Routes } from "@angular/router"
import { UserManagementComponent } from "./user-management/user-management.component"
import { AuditLogsComponent } from "./audit-logs/audit-logs.component"

export const ADMIN_ROUTES: Routes = [
  { path: "users", component: UserManagementComponent },
  { path: "audit", component: AuditLogsComponent },
]

