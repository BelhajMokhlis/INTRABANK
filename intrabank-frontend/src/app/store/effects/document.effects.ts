import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap, tap, switchMap } from 'rxjs/operators';
import { DocumentService } from '../../core/service/document/document.service';
import * as DocumentActions from '../actions/document.actions';
import { CategoryService } from '../../core/service/document/category.service';
import { DocumentUpdateRequest } from '../../core/service/document/document.service';

@Injectable()
export class DocumentEffects {
  constructor(
    private actions$: Actions,
    private documentService: DocumentService,
    private categoryService: CategoryService
  ) {
  }

  // Debug Effect to log all document actions
  logDocumentActions$ = createEffect(() => 
    this.actions$.pipe(
      tap(action => {
        if (action.type.startsWith('[Document]')) {
          console.log('[DocumentEffects] Action dispatched:', action.type, action);
        }
      })
    ), 
    { dispatch: false } // Don't dispatch any actions from this effect
  );

  uploadDocument$ = createEffect(() => 
    this.actions$.pipe(
      ofType(DocumentActions.uploadDocument),
      tap(action => console.log('[DocumentEffects] Upload Document Action:', {
        titre: action.document.titre,
        type: action.document.type,
        categoryId: action.document.categoryId,
        hasVersions: !!action.document.versions && action.document.versions.length > 0,
        hasFiles: !!action.document.versions && 
                 action.document.versions.length > 0 && 
                 !!action.document.versions[0].fichiers &&
                 action.document.versions[0].fichiers.length > 0
      })),
      mergeMap(action => {
        console.log('[DocumentEffects] Starting document upload...');
        // Validate document structure before sending to API
        const document = action.document;
        if (!document.titre || !document.type || !document.categoryId) {
          console.error('[DocumentEffects] Document missing required fields:', document);
          return of(DocumentActions.uploadDocumentFailure({ 
            error: 'Document is missing required fields (title, type, or categoryId)' 
          }));
        }
        
        if (!document.versions || document.versions.length === 0) {
          console.error('[DocumentEffects] Document has no versions:', document);
          return of(DocumentActions.uploadDocumentFailure({ 
            error: 'Document has no versions' 
          }));
        }
        
        const version = document.versions[0];
        if (!version.fichiers || version.fichiers.length === 0) {
          console.error('[DocumentEffects] Document version has no files:', version);
          return of(DocumentActions.uploadDocumentFailure({ 
            error: 'Document version has no files' 
          }));
        }
        
        // Call service to create document
        console.log('[DocumentEffects] Calling DocumentService.createDocument()');
        return this.documentService.createDocument(document).pipe(
          tap(result => console.log('[DocumentEffects] Document created successfully:', result)),
          map(newDocument => DocumentActions.uploadDocumentSuccess({ document: newDocument })),
          catchError(error => {
            console.error('[DocumentEffects] Error creating document:', error);
            
            // Enhanced error reporting based on status code
            let errorMessage = 'Unknown error occurred';
            
            if (error) {
              console.error('[DocumentEffects] Error status:', error.status);
              console.error('[DocumentEffects] Error details:', {
                status: error.status,
                statusText: error.statusText,
                message: error.message,
                error: error.error
              });
              
              // Check for JSON parsing errors which might indicate malformed response
              if (error.message && error.message.includes('JSON')) {
                console.error('[DocumentEffects] JSON parsing error detected');
                console.error('[DocumentEffects] This could indicate a malformed API response');
                errorMessage = 'Error parsing server response. The document may have been created, but the response format was incorrect.';
              } else if (error.status === 400) {
                errorMessage = 'Bad request: The document format is incorrect';
                // Log specific validation errors if available
                if (error.error && error.error.message) {
                  console.error('[DocumentEffects] Validation error:', error.error.message);
                  errorMessage += ` - ${error.error.message}`;
                }
              } else if (error.status === 401) {
                errorMessage = 'Unauthorized: Please log in again';
              } else if (error.status === 403) {
                errorMessage = 'Forbidden: You don\'t have permission to create documents';
              } else if (error.status === 0) {
                errorMessage = 'Network error: Could not connect to the server';
                console.error('[DocumentEffects] Network error - CORS issue or server not reachable');
                console.error('[DocumentEffects] Check the following:');
                console.error('1. Is the API server running?');
                console.error('2. Is there a CORS issue? Check browser console for details');
                console.error('3. Is the API URL correct?');
              }
            }
            
            return of(DocumentActions.uploadDocumentFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.loadCategories),
      tap(() => console.log('[DocumentEffects] Load categories action received')),
      switchMap(() => {
        console.log('[DocumentEffects] Calling CategoryService.getAllCategories');
        return this.categoryService.getAllCategories().pipe(
          tap(categories => console.log('[DocumentEffects] Categories fetched successfully:', categories)),
          map(categories => {
            console.log('[DocumentEffects] Dispatching loadCategoriesSuccess');
            return DocumentActions.loadCategoriesSuccess({ categories });
          }),
          catchError(error => {
            console.error('[DocumentEffects] Error loading categories:', error);
            return of(DocumentActions.loadCategoriesFailure({ 
              error: error.message || error.statusText || 'Unknown error'
            }));
          })
        );
      })
    )
  );

  updateDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.updateDocument),
      tap(action => console.log('[DocumentEffects] Update document action received:', action)),
      mergeMap(action => {
        console.log('[DocumentEffects] Calling DocumentService.updateDocument');
        const updateRequest: DocumentUpdateRequest = {
          titre: action.document.titre || '',
          categoryId: action.document.categoryId || '',
          auteurId: action.document.auteurId || ''
        };
        return this.documentService.updateDocument(action.documentId, updateRequest).pipe(
          tap(updatedDocument => console.log('[DocumentEffects] Document updated successfully:', updatedDocument)),
          map(updatedDocument => DocumentActions.updateDocumentSuccess({ document: updatedDocument })),
          catchError(error => {
            console.error('[DocumentEffects] Error updating document:', error);
            return of(DocumentActions.updateDocumentFailure({ 
              error: error.message || error.statusText || 'Unknown error'
            }));
          })
        );
      })
    )
  );

  createVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.createVersion),
      mergeMap(({ version }) =>
        this.documentService.newVersion(version).pipe(
          map((response) => DocumentActions.createVersionSuccess({ version: response })),
          catchError((error) =>
            of(DocumentActions.createVersionFailure({ error: error.message }))
          )
        )
      )
    )
  );
} 