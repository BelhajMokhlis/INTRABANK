import type { Routes } from "@angular/router"
import { DocumentListComponent } from "./document-list/document-list.component"
import { DocumentUploadComponent } from "./document-upload/document-upload.component"
import { DocumentDetailComponent } from "./document-detail/document-detail.component"
import { CategoryNewComponent } from "./category-new/category-new.component"
import { DocumentEditComponent } from "./document-edit/document-edit.component"
import { NewVersionComponent } from "./new-version/new-version.component"
export const DOCUMENTS_ROUTES: Routes = [
  { path: "", component: DocumentListComponent },
  { path: "upload", component: DocumentUploadComponent },
  { path: "categories", component: CategoryNewComponent },
  { path: ":id", component: DocumentDetailComponent },
  { path: "edit/:id", component: DocumentEditComponent },
  { path: "version/:id", component: NewVersionComponent },
]

