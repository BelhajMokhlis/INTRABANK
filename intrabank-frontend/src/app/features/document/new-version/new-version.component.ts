import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { VersionDocumentRequest, FichierDocumentRequest, DocumentResponse } from '../../../shared/models/document.models';
import * as DocumentActions from '../../../store/actions/document.actions';
import * as DocumentSelectors from '../../../store/selectors/document.selectors';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { DocumentState } from '../../../store/state/app.state';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../../core/service/document/document.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { ProfileService } from '../../../core/service/profile/profile.service';

interface FileInput {
  id: string;
  file: File | null;
}

interface AppState {
  document: DocumentState;
}

@Component({
  selector: 'app-new-version',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-version.component.html'
})
export class NewVersionComponent implements OnInit {
  versionForm: FormGroup;
  fileInputs: FileInput[] = [];
  selectedFiles: File[] = [];
  fichierDocuments: FichierDocumentRequest[] = [];
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  success$: Observable<boolean>;
  document$: Observable<DocumentResponse | null> = of(null);
  documentTitle$ = new BehaviorSubject<string>('');
  nextVersionNumber$ = new BehaviorSubject<number>(1);

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private profileService: ProfileService
  ) {
    this.versionForm = this.fb.group({
      documentId: [this.route.snapshot.params['id'], Validators.required],
      numeroVersion: [{ value: '', disabled: true }, [Validators.required, Validators.min(1)]],
      commentaire: ['', Validators.required],
      fichiers: [[]]
    });

    this.loading$ = this.store.select(DocumentSelectors.selectVersionCreationLoading);
    this.error$ = this.store.select(DocumentSelectors.selectVersionCreationError);
    this.success$ = this.store.select(DocumentSelectors.selectVersionCreationSuccess);

    // Initialize with one file input
    this.addNewFileInput();
  }

  ngOnInit(): void {
    // Get document ID from URL and fetch document
    this.document$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      tap(id => {
        if (id) {
          this.versionForm.patchValue({ documentId: id });
        }
      }),
      switchMap(id => id ? this.documentService.getDocumentById(id) : of(null))
    );

    // Subscribe to document to get title and calculate next version
    this.document$.subscribe(document => {
      if (document) {
        this.documentTitle$.next(document.titre);
        // Calculate next version number based on existing versions
        const nextVersion = document.versions.length > 0 
          ? Math.max(...document.versions.map(v => v.numeroVersion)) + 1 
          : 1;
        this.nextVersionNumber$.next(nextVersion);
        this.versionForm.patchValue({ numeroVersion: nextVersion });
      }
    });
  }

  addNewFileInput(): void {
    this.fileInputs.push({
      id: `file-${this.fileInputs.length + 1}`,
      file: null
    });
  }

  removeFileInput(index: number): void {
    const removedFile = this.fileInputs[index].file;
    if (removedFile) {
      this.selectedFiles = this.selectedFiles.filter(f => f !== removedFile);
    }
    this.fileInputs.splice(index, 1);
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileInputs[index].file = file;
      
      // Update selectedFiles array
      if (!this.selectedFiles.includes(file)) {
        this.selectedFiles.push(file);
      }
    }
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
    // Also remove from fileInputs
    const inputIndex = this.fileInputs.findIndex(input => input.file === file);
    if (inputIndex !== -1) {
      this.fileInputs[inputIndex].file = null;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.versionForm.valid && this.selectedFiles.length > 0) {
      const formData = this.versionForm.value;
      
      // Convert files to base64
      const base64Contents = await Promise.all(
        this.selectedFiles.map(file => this.fileToBase64(file))
      );

      // Create fichier documents
      this.fichierDocuments = this.selectedFiles.map((file, index) => ({
        nomFichier: file.name,
        typeFichier: file.type,
        fichier: base64Contents[index]
      }));
      
      // Get current user and create version
      this.profileService.getCurrentUser().subscribe(user => {
        if (!user) {
          console.error('No current user found');
          return;
        }
        
        const versionRequest: VersionDocumentRequest = {
          documentId: formData.documentId,
          numeroVersion: formData.numeroVersion,
          commentaire: formData.commentaire,
          editeurId: user.id,
          fichiers: this.fichierDocuments
        };
        
        this.store.dispatch(DocumentActions.createVersion({ version: versionRequest }));
      });
    }
  }

  onCancel(): void {
    // Navigate back to document detail
    window.history.back();
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  }
}
