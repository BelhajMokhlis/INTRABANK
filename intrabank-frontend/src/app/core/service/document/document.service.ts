import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http"
import { Observable, tap } from "rxjs"
import { environment } from "../../../../environments/environment.development"
import { DocumentRequest, DocumentResponse, DocumentType, PagedDocumentResponse, VersionDocumentRequest, VersionDocumentResponse } from "../../../shared/models/document.models"

export interface DocumentUpdateRequest {
  titre: string;
  categoryId: string;
  auteurId: string;
}

export interface UploadDocumentRequest {
  titre: string;
  type: DocumentType;
  categoryId: string;
  auteurId: string;
  commentaire: string;
  files: File[];
}

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  constructor(private http: HttpClient) {
  }

  // Récupérer tous les documents
  getAllDocuments(page: number = 0, size: number = 20): Observable<PagedDocumentResponse> {
    const url = `${environment.apiUrl}/documents`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PagedDocumentResponse>(url, { params });
  }
  
  // Récupérer un document par ID
  getDocumentById(id: string): Observable<DocumentResponse> {
    const url = `${environment.apiUrl}/documents/${id}`;
    console.log('[DocumentService] getDocumentById - Making API call to:', url);
    return this.http.get<DocumentResponse>(url)
      .pipe(
        tap({
          next: (result) => console.log('[DocumentService] getDocumentById - API call successful'),
          error: (error) => console.error('[DocumentService] getDocumentById - API call failed:', error)
        })
      );
  }
  
  // Créer un nouveau document
  createDocument(document: DocumentRequest): Observable<DocumentResponse> {
    const url = `${environment.apiUrl}/documents`;
    console.log('[DocumentService] createDocument - Making API call to:', url, 'with payload:', {
      titre: document.titre,
      type: document.type,
      categoryId: document.categoryId,
      versionsCount: document.versions?.length
    });
    
    // Validate content type for the document
    if (document.versions && document.versions.length > 0 && 
        document.versions[0].fichiers && document.versions[0].fichiers.length > 0) {
      const fileType = document.versions[0].fichiers[0].typeFichier;
      
      // Log file size info
      const fichier = document.versions[0].fichiers[0];
      console.log('[DocumentService] File details:', {
        name: fichier.nomFichier,
        type: fichier.typeFichier,
        contentSizeKB: Math.round((fichier.fichier?.length || 0) * 0.75 / 1024), // Approximate size of base64 content
        tooLarge: (fichier.fichier?.length || 0) * 0.75 / 1024 / 1024 > 10 // Is it larger than 10MB?
      });
      
      if (document.type === DocumentType.DOC && !fileType.includes('msword') && !fileType.includes('document')) {
        console.warn('[DocumentService] Document type mismatch: Document type is DOC but file is', fileType);
        // Force the correct content type based on the actual file
        if (fileType.includes('pdf')) {
          console.log('[DocumentService] Correcting document type to PDF');
          document.type = DocumentType.PDF;
        }
      }
    }
    
    // Check for other potential issues in the document structure
    if (!document.auteurId) {
      console.warn('[DocumentService] Document missing auteurId');
    }
    
    if (!document.status) {
      console.warn('[DocumentService] Document missing status');
    }
    
    // Log versions info
    if (document.versions) {
      document.versions.forEach((version, idx) => {
        console.log(`[DocumentService] Version ${idx + 1}:`, {
          hasCommentaire: !!version.commentaire,
          hasEditeurId: !!version.editeurId,
          fichiers: version.fichiers?.length || 0
        });
      });
    }
    
    // Log the full document content for debugging
    console.log('[DocumentService] createDocument - Full document payload:', JSON.stringify(document, null, 2));
    
    // Add authorization header if token exists
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    console.log('[DocumentService] createDocument - Using headers:', {
      contentType: headers.get('Content-Type'),
      hasAuthHeader: !!headers.get('Authorization')
    });
    
    return this.http.post<DocumentResponse>(url, document, { headers })
      .pipe(
        tap({
          next: (result) => console.log('[DocumentService] createDocument - API call successful:', result),
          error: (error) => {
            console.error('[DocumentService] createDocument - API call failed:', error);
            console.error('[DocumentService] Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              error: error.error
            });
            
            // Log request details that might be causing issues
            console.error('[DocumentService] Request validation issues: Check if document matches expected API format');
            console.error('[DocumentService] Auth status:', !!localStorage.getItem('auth_token'));
            
            // Try to parse response if available
            try {
              if (error.error && typeof error.error === 'string') {
                console.error('[DocumentService] Parsed error response:', JSON.parse(error.error));
              }
            } catch (e) {
              console.error('[DocumentService] Could not parse error response');
            }
          }
        })
      );
  }
  
  // Mettre à jour un document
  updateDocument(id: string, document: DocumentUpdateRequest): Observable<DocumentResponse> {
    const url = `${environment.apiUrl}/documents/${id}`;
    console.log('[DocumentService] updateDocument - Making API call to:', url, 'with payload:', document);
    
    // Add authorization header if token exists
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
    
    return this.http.put<DocumentResponse>(url, document, { headers })
      .pipe(
        tap({
          next: (result) => console.log('[DocumentService] updateDocument - API call successful:', result),
          error: (error) => {
            console.error('[DocumentService] updateDocument - API call failed:', error);
            console.error('[DocumentService] Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              error: error.error
            });
          }
        })
      );
  }
  
  // Supprimer un document
  deleteDocument(id: string): Observable<void> {
    const url = `${environment.apiUrl}/documents/${id}`;
    console.log('[DocumentService] deleteDocument - Making API call to:', url);
    return this.http.delete<void>(url)
      .pipe(
        tap({
          next: () => console.log('[DocumentService] deleteDocument - API call successful'),
          error: (error) => console.error('[DocumentService] deleteDocument - API call failed:', error)
        })
      );
  }
  
  // Télécharger un fichier
  downloadFile(fileId: string): Observable<Blob> {
    const url = `${environment.apiUrl}/files/download/${fileId}`;
    console.log('[DocumentService] downloadFile - Making API call to:', url);
    
    return this.http.get(url, { 
      responseType: 'blob',
      observe: 'body'
    }).pipe(
      tap({
        next: () => console.log('[DocumentService] downloadFile - API call successful'),
        error: (error) => console.error('[DocumentService] downloadFile - API call failed:', error)
      })
    );
  }

  uploadDocument(id: string, request: UploadDocumentRequest): Observable<DocumentResponse> {
    const formData = new FormData();
    formData.append('titre', request.titre);
    formData.append('type', request.type);
    formData.append('categoryId', request.categoryId);
    formData.append('auteurId', request.auteurId);
    formData.append('commentaire', request.commentaire);
    
    request.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    return this.http.put<DocumentResponse>(`${environment.apiUrl}/documents/${id}`, formData);
  }


  newVersion(version: VersionDocumentRequest): Observable<VersionDocumentResponse> {
    const url = `${environment.apiUrl}/documents/version`;
    return this.http.post<VersionDocumentResponse>(url, version);
  }
}

