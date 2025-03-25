import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"



@Component({
  selector: "app-workflow-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:'./workflow-list.component.html'
  
})

export class WorkflowListComponent {

  constructor() {
    
  }

 
}

