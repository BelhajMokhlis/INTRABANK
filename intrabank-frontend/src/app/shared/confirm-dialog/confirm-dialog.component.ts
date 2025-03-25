import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"

export interface ConfirmDialogData {
  title: string
  message: string
  confirmText: string
  cancelText: string
  type?: "danger" | "warning" | "info"
}

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl:"./confirm-dialog.component.html",
})
export class ConfirmDialogComponent {
  result = false;

  constructor(@Inject('dialogData') public data: ConfirmDialogData) {
   
  }  
}

