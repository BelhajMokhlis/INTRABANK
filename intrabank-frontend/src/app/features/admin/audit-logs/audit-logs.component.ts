import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms"
import { Store } from "@ngrx/store"
import type { AppState } from "../../../store/state/app.state"

@Component({
  selector: "app-audit-logs",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:"./audit-logs.component.html",
})
export class AuditLogsComponent  {
  searchForm: FormGroup

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) {
  

    this.searchForm = this.fb.group({
      user: [""],
      action: [""],
      startDate: [""],
      endDate: [""],
    })
  }



}

