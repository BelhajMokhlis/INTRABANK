import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../../core/service/document/document.service';
import { DocumentType } from '../../../shared/models/document.models';
import { ProfileService } from '../../../core/service/profile/profile.service';
import { User } from '../../../shared/models/user.model';
import { Store } from '@ngrx/store';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AppState } from "../../../store/state/app.state";
import * as CategoryActions from "../../../store/actions/category.actions";
import * as CategorySelectors from "../../../store/selectors/category.selectors";

@Component({
  selector: 'app-document-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent implements OnInit, OnDestroy {
  documentForm: FormGroup;
  currentUser: User | null = null;
  categories$ = this.store.select(CategorySelectors.selectAllCategories);
  loading$ = new BehaviorSubject<boolean>(false);
  uploading$ = new BehaviorSubject<boolean>(false);
  selectedFiles: File[] = [];
  fileInputs: { id: string }[] = [{ id: 'file-1' }];
  DocumentType = DocumentType;
  private destroy$ = new Subscription();
  documentId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private profileService: ProfileService,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    this.documentForm = this.formBuilder.group({
      titre: ['', [Validators.required]],
      type: [DocumentType.PDF, [Validators.required]],
      categoryId: ['', [Validators.required]],
      auteurId: ['', [Validators.required]],
      commentaire: ['']
    });
  }

  ngOnInit(): void {
    // Load categories
    this.store.dispatch(CategoryActions.loadCategories());

    // Get document ID from URL and fetch document data
    this.route.paramMap.subscribe(params => {
      this.documentId = params.get('id');
      if (this.documentId) {
        this.loading$.next(true);
        this.documentService.getDocumentById(this.documentId).subscribe({
          next: (document) => {
            // Patch form with existing document data
            this.documentForm.patchValue({
              titre: document.titre,
              type: document.type,
              categoryId: document.categoryId,
              auteurId: document.auteurId,
              commentaire: document.versions[document.versions.length - 1]?.commentaire || ''
            });
            this.loading$.next(false);
          },
          error: (error) => {
            console.error('Error loading document:', error);
            this.loading$.next(false);
          }
        });
      }
    });

    // Get current user
    this.profileService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.documentForm.patchValue({
          auteurId: user.id
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    if (this.documentForm.valid && this.currentUser) {
      this.uploading$.next(true);
      const formData = this.documentForm.value;
      
      // Create document request with files
      const DocumentUpdateRequest = {
        titre: formData.titre,
        categoryId: formData.categoryId,
        auteurId: formData.auteurId
            };

      // Upload document
      if (this.documentId) {
        this.documentService.updateDocument(this.documentId, DocumentUpdateRequest).subscribe({
          next: () => {
            // Handle success (e.g., show success message, redirect)
            this.uploading$.next(false);
          },
          error: (error: unknown) => {
            console.error('Error uploading document:', error);
            this.uploading$.next(false);
          }
        });
      }
    }
  }

  addNewFileInput(): void {
    const newId = `file-${this.fileInputs.length + 1}`;
    this.fileInputs.push({ id: newId });
  }

  removeFileInput(index: number): void {
    this.fileInputs.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFiles[index] = input.files[0];
    }
  }
}
