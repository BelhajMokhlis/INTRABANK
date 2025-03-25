import { type ActionReducerMap } from "@ngrx/store"
import type { AppState } from "../state/app.state"
import { authReducer } from "./auth.reducer"
import { documentReducer } from "./document.reducer"
import { userReducer } from "./user.reducer"
import { workflowReducer } from "./workflow.reducer"
import { auditLogReducer } from "./audit-log.reducer"
import { categoryReducer } from "./category.reducer"

// Make sure reducer keys match the AppState interface exactly
export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  documents: documentReducer,
  user: userReducer,
  workflows: workflowReducer,
  auditLogs: auditLogReducer,
  category: categoryReducer
}

