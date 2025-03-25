import { Component, OnInit, ChangeDetectorRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { DocumentService } from "../../../core/service/document/document.service"
import { DocumentResponse, DocumentStatus, DocumentType } from "../../../shared/models/document.models"
import { BehaviorSubject, Observable, catchError, finalize, map, of, switchMap, tap } from "rxjs"

@Component({
  selector: "app-document-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: "./document-detail.component.html",
  styleUrls: ["./document-detail.component.scss"],
})
export class DocumentDetailComponent implements OnInit {
  document$: Observable<DocumentResponse | null>;
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);
  documentId: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef
  ) {
    this.document$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        if (!id) {
          throw new Error('Document ID is required');
        }
        return this.documentService.getDocumentById(id);
      }),
      tap(() => this.loading$.next(false)),
      catchError(error => {
        this.loading$.next(false);
        const errorMessage = error.status === 404 
          ? 'Document not found' 
          : (error.message || 'Failed to load document details');
        this.error$.next(errorMessage);
        return of(null as any);
      })
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loadDocument();
    });
  }

  loadDocument(): void {
    this.loading$.next(true);
    this.error$.next(null);
    this.cdr.detectChanges();

    this.document$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        if (!id) {
          throw new Error('Document ID is required');
        }
        return this.documentService.getDocumentById(id);
      }),
      tap(() => {
        this.loading$.next(false);
        this.cdr.detectChanges();
      }),
      catchError(error => {
        this.loading$.next(false);
        const errorMessage = error.status === 404 
          ? 'Document not found' 
          : (error.message || 'Failed to load document details');
        this.error$.next(errorMessage);
        this.cdr.detectChanges();
        return of(null as any);
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }

  editDocument(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.router.navigate(['/documents/edit', id]);
      }
    });
  }
  updateDocument(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.router.navigate(['/documents/version', id]);
      }
    });
  }

  deleteDocument(): void {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loading$.next(true);
          this.cdr.detectChanges();
          
          this.documentService.deleteDocument(id).pipe(
            tap(() => {
              this.loading$.next(false);
              this.cdr.detectChanges();
              this.router.navigate(['/documents']);
            }),
            catchError(error => {
              this.loading$.next(false);
              this.error$.next('Failed to delete document. Please try again.');
              this.cdr.detectChanges();
              return of(null);
            })
          ).subscribe();
        }
      });
    }
  }

  downloadFile(fileId: string, fileName: string): void {
    this.loading$.next(true);
    this.cdr.detectChanges();
    
    this.documentService.downloadFile(fileId).subscribe({
      next: (blob: Blob) => {
        this.loading$.next(false);
        this.cdr.detectChanges();
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a link element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        
        // Append to the document and trigger the download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        this.loading$.next(false);
        this.error$.next('Failed to download file. Please try again.');
        this.cdr.detectChanges();
        console.error('Error downloading file:', error);
      }
    });
  }

  getStatusClass(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.VALIDE:
        return 'bg-green-100 text-green-800';
      case DocumentStatus.EN_ATTENTE:
        return 'bg-yellow-100 text-yellow-800';
      case DocumentStatus.REJETE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.VALIDE:
        return 'Validated';
      case DocumentStatus.EN_ATTENTE:
        return 'Pending';
      case DocumentStatus.REJETE:
        return 'Rejected';
      default:
        return status;
    }
  }

  getFileTypeIcon(type: string): string {
    if (type.includes('pdf')) {
      return 'pdf';
    } else if (type.includes('word') || type.includes('doc')) {
      return 'word';
    } else if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) {
      return 'excel';
    } else if (type.includes('text') || type.includes('txt')) {
      return 'text';
    } else {
      return 'file';
    }
  }

  getDocumentTypeIcon(type: DocumentType): string {
    switch (type) {
      case DocumentType.PDF:
        return 'file-pdf';
      case DocumentType.DOC:
      case DocumentType.DOCX:
        return 'file-word';
      case DocumentType.XLS:
      case DocumentType.XLSX:
        return 'file-excel';
      case DocumentType.TXT:
        return 'file-text';
      default:
        return 'file';
    }
  }
}

