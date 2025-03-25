import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { v4 as uuidv4 } from 'uuid';
import { DocumentRequest, DocumentStatus, DocumentType } from "../../../shared/models/document.models";
import { trigger, transition, style, animate } from '@angular/animations';
import { ProfileService } from "../../../core/service/profile/profile.service";
import { DocumentService } from "../../../core/service/document/document.service";
import { User } from "../../../shared/models/user.model";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "../../../store/state/app.state";
import * as CategoryActions from "../../../store/actions/category.actions";
import * as CategorySelectors from "../../../store/selectors/category.selectors";
import * as DocumentActions from "../../../store/actions/document.actions";
import Swal from 'sweetalert2';


@Component({
  selector: "app-document-upload",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: "./document-upload.component.html",
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  documentForm: FormGroup;
  selectedFiles: File[] = [];
  DocumentType = DocumentType;
  currentUser: User | null = null;
  fileInputs: { id: string }[] = [];
  
  // NgRx state variables - use the correct category store selectors
  categories$ = this.store.select(CategorySelectors.selectAllCategories);
  loading$ = this.store.select((state: AppState) => state.documents?.isLoading || false);
  uploading$ = this.store.select((state: AppState) => state.documents?.uploading || false);
  success$ = this.store.select((state: AppState) => state.documents?.success || false);
  error$ = this.store.select((state: AppState) => state.documents?.error || null);
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private documentService: DocumentService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.documentForm = this.fb.group({
      titre: ['', [Validators.required]],
      type: [DocumentType.PDF, [Validators.required]],
      categoryId: ['', [Validators.required]],
      auteurId: [{ value: '', disabled: true }],
      commentaire: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Add mock token for testing if it doesn't exist
    // In a real app, this would come from the authentication process
    if (!localStorage.getItem('auth_token')) {
      localStorage.setItem('auth_token', 'test-token-for-debugging');
    }
    
    // Initialize with one default file input
    this.fileInputs = [{ id: 'file-input-0' }];
    
    // Get current user data from ProfileService
    const userSub = this.profileService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        // Set the author name in the form
        this.documentForm.patchValue({
          auteurId: `${user.firstName} ${user.lastName}`
        });
      },
      error: (error) => {
        // Error handling for user profile fetch
      }
    });
    
    this.subscriptions.add(userSub);

    // Load categories using the correct CategoryActions
    this.store.dispatch(CategoryActions.loadCategories());
    
    // Add logging to see categories
    const categoriesSub = this.categories$.subscribe(categories => {
      // Categories loaded
    });
    this.subscriptions.add(categoriesSub);
    
    // Subscribe to success state to show alert and navigate
    const successSub = this.success$.subscribe(success => {
      if (success) {
        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: 'Document uploaded successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result: any) => {
          // Reset form but keep the author name
          this.documentForm.reset({
            type: DocumentType.PDF,
            auteurId: this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : ''
          });
          this.selectedFiles = [];
          
          // Reset success state
          this.store.dispatch(DocumentActions.resetDocumentState());
          
          // Navigate back to documents page
          this.router.navigate(['/documents']);
        });
      }
    });
    
    this.subscriptions.add(successSub);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addNewFileInput(): void {
    this.fileInputs.push({ id: `file-input-${this.fileInputs.length}` });
  }

  removeFileInput(index: number): void {
    this.fileInputs.splice(index, 1);
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // Replace the file at the specified index
      if (this.selectedFiles[index]) {
        this.selectedFiles[index] = input.files[0];
      } else {
        this.selectedFiles.push(input.files[0]);
      }
      // Reset the input value to allow selecting the same file again
      input.value = '';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.documentForm.valid && this.selectedFiles.length > 0 && this.currentUser) {
      try {
        // Convert all files to base64
        const base64Contents = await Promise.all(
          this.selectedFiles.map(file => this.fileToBase64(file))
        );

        // Create the document request with multiple files
        const documentRequest: DocumentRequest = {
          titre: this.documentForm.get('titre')?.value,
          type: this.documentForm.get('type')?.value,
          status: DocumentStatus.EN_ATTENTE,
          categoryId: this.documentForm.get('categoryId')?.value,
          auteurId: this.currentUser.id,
          versions: [
            {
              documentId: uuidv4(),
              numeroVersion: 1,
              editeurId: this.currentUser.id,
              commentaire: this.documentForm.get('commentaire')?.value,
              fichiers: this.selectedFiles.map((file, index) => ({
                versionId: uuidv4(),
                nomFichier: file.name,
                typeFichier: file.type,
                fichier: base64Contents[index]
              }))
            }
          ]
        };
        
        // Dispatch upload action with NgRx action
        this.store.dispatch(DocumentActions.uploadDocument({ document: documentRequest }));
        
      } catch (error) {
        console.error('Error preparing document upload:', error);
        this.store.dispatch(DocumentActions.uploadDocumentFailure({ 
          error: 'Error preparing document for upload' 
        }));
      }
    } else {
      // Form is invalid or missing file/user
      if (!this.documentForm.valid) {
        // Display the specific validation errors
        Object.keys(this.documentForm.controls).forEach(key => {
          const control = this.documentForm.get(key);
          if (control?.invalid) {
            console.error(`Invalid field ${key}:`, control.errors);
          }
        });
      }
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Add method to remove a file
  removeFile(index: number): void {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
    // If we removed the last file, remove the last input
    if (this.fileInputs.length > this.selectedFiles.length) {
      this.fileInputs.pop();
    }
  }
}
