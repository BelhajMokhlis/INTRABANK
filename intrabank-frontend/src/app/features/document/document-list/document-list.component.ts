import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { DocumentService } from "../../../core/service/document/document.service"
import { DocumentResponse, DocumentType, DocumentStatus, PagedDocumentResponse } from "../../../shared/models/document.models"
import { BehaviorSubject, Observable, catchError, finalize, of, switchMap, map, tap } from "rxjs"

@Component({
  selector: "app-document-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./document-list.component.html",
  styles: [],
})
export class DocumentListComponent implements OnInit {
  documents$: Observable<DocumentResponse[]>;
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);
  refresh$ = new BehaviorSubject<void>(undefined);
  
  // Provide Math for the template
  Math = Math;
  
  // Search and filter properties
  searchTerm = '';
  selectedType: DocumentType | 'ALL' = 'ALL';
  selectedStatus: DocumentStatus | 'ALL' = 'ALL';
  
  // Keep a reference to all types for the filter dropdown
  documentTypes = Object.values(DocumentType);
  documentStatuses = Object.values(DocumentStatus);

  // Pagination from API response
  totalElements = 0;
  totalPages = 1;
  currentPage = 0; // API uses 0-based indexing
  pageSize = 5; // Set default to 5
  
  constructor(
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {
    this.documents$ = this.refresh$.pipe(
      switchMap(() => {
        return this.documentService.getAllDocuments(this.currentPage, this.pageSize).pipe(
          map((response: PagedDocumentResponse) => {
            if (!response || !response.content) {
              console.error('Invalid API response format:', response);
              this.error$.next('Received invalid data format from server');
              return [];
            }
            
            // Handle paginated response
            this.totalElements = response.totalElements;
            this.totalPages = response.totalPages;
            this.currentPage = response.number;
            this.pageSize = response.size;
            
            // Return just the documents array
            return response.content;
          }),
          catchError(error => {
            console.error('Error fetching documents:', error);
            this.error$.next('Failed to load documents. Please try again later.');
            return of([]);
          }),
          finalize(() => {
            this.ngZone.run(() => {
              setTimeout(() => {
                this.loading$.next(false);
                this.appRef.tick();
              });
            });
          })
        );
      })
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loadDocuments();
    });
  }

  loadDocuments(): void {
    this.loading$.next(true);
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.refresh$.next();
    });
  }

  // Only filter the documents for display (no pagination logic)
  getFilteredDocuments(documents: DocumentResponse[]): DocumentResponse[] {
    if (!documents) {
      console.log('No documents to filter');
      return [];
    }

    
    // Apply search and filters
    return documents
      .filter(doc => {
        // Search term filtering
        if (this.searchTerm && !doc.titre.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          return false;
        }
        
        // Type filtering
        if (this.selectedType !== 'ALL' && doc.type !== this.selectedType) {
          return false;
        }
        
        // Status filtering
        if (this.selectedStatus !== 'ALL' && doc.status !== this.selectedStatus) {
          return false;
        }
        
        return true;
      });
  }

  onSearch(): void {
    // Apply filter and reload
    this.loadDocuments();
  }

  onFilterChange(): void {
    // Apply filter and reload
    this.loadDocuments();
  }

  onPageSizeChange(): void {
    this.currentPage = 0; // Reset to first page when changing page size
    // Make sure to trigger the data fetch with new page size
    this.loadDocuments();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) { 
      this.currentPage++;
      this.loadDocuments();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) { 
      this.currentPage--;
      this.loadDocuments();
    }
  }

  deleteDocument(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      this.loading$.next(true);
      this.cdr.detectChanges();
      
      this.documentService.deleteDocument(id)
        .pipe(
          finalize(() => {
            setTimeout(() => {
              this.loading$.next(false);
              this.cdr.detectChanges();
            });
          })
        )
        .subscribe({
          next: () => {
            this.loadDocuments();
          },
          error: (error) => {
            console.error('Error deleting document:', error);
            this.error$.next('Failed to delete document. Please try again.');
            this.cdr.detectChanges();
          }
        });
    }
  }

  getStatusClass(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.EN_ATTENTE:
        return 'bg-yellow-100 text-yellow-800';
      case DocumentStatus.VALIDE:
        return 'bg-green-100 text-green-800';
      case DocumentStatus.REJETE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.EN_ATTENTE:
        return 'Pending';
      case DocumentStatus.VALIDE:
        return 'Approved';
      case DocumentStatus.REJETE:
        return 'Rejected';
      default:
        return status;
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

  trackById(index: number, item: DocumentResponse): string {
    return item.id;
  }
}

