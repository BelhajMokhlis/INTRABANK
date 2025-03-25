import { createAction, props } from "@ngrx/store"
import type { Workflow } from "../../shared/models/workflow.model"

export const loadWorkflows = createAction(
  "[Workflow] Load Workflows",
  props<{ page?: number; size?: number; filters?: Record<string, any> }>(),
)

export const loadWorkflowsSuccess = createAction("[Workflow] Load Workflows Success", props<{ workflows: Workflow[] }>())

export const loadWorkflowsFailure = createAction("[Workflow] Load Workflows Failure", props<{ error: string }>())

export const loadWorkflow = createAction("[Workflow] Load Workflow", props<{ id: string }>())

export const loadWorkflowSuccess = createAction("[Workflow] Load Workflow Success", props<{ workflow: Workflow }>())

export const loadWorkflowFailure = createAction("[Workflow] Load Workflow Failure", props<{ error: string }>())

export const updateWorkflowStatus = createAction(
  "[Workflow] Update Workflow Status",
  props<{ id: string; status: string }>(),
)

export const updateWorkflowStatusSuccess = createAction(
  "[Workflow] Update Workflow Status Success",
  props<{ workflow: Workflow }>(),
)

export const updateWorkflowStatusFailure = createAction(
  "[Workflow] Update Workflow Status Failure",
  props<{ error: string }>(),
)

