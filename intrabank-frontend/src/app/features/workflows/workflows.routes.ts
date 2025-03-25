import type { Routes } from "@angular/router"
import { WorkflowListComponent } from "./workflow-list/workflow-list.component"
import { WorkflowHistoryComponent } from "./workflow-history/workflow-history.component"

export const WORKFLOWS_ROUTES: Routes = [
  { path: "", component: WorkflowListComponent },
  { path: "history", component: WorkflowHistoryComponent },
]

