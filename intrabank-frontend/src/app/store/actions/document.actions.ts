import { createAction, props } from '@ngrx/store';
import { DocumentRequest, DocumentResponse } from '../../shared/models/document.models';
import { CategoryResponse } from '../../shared/models/category.model';
import { VersionDocumentRequest, VersionDocumentResponse } from '../../shared/models/document.models';

// Upload document
export const uploadDocument = createAction(
  '[Document] Upload Document',
  props<{ document: DocumentRequest }>()
);

export const uploadDocumentSuccess = createAction(
  '[Document] Upload Document Success',
  props<{ document: DocumentResponse }>()
);

export const uploadDocumentFailure = createAction(
  '[Document] Upload Document Failure',
  props<{ error: any }>()
);

// Load categories
export const loadCategories = createAction(
  '[Document] Load Categories'
);

export const loadCategoriesSuccess = createAction(
  '[Document] Load Categories Success',
  props<{ categories: CategoryResponse[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Document] Load Categories Failure',
  props<{ error: any }>()
);

// Reset state
export const resetDocumentState = createAction(
  '[Document] Reset State'
);

// Update document
export const updateDocument = createAction(
  '[Document] Update Document',
  props<{ documentId: string; document: Partial<DocumentRequest> }>()
);

export const updateDocumentSuccess = createAction(
  '[Document] Update Document Success',
  props<{ document: DocumentResponse }>()
);

export const updateDocumentFailure = createAction(
  '[Document] Update Document Failure',
  props<{ error: any }>()
);

export const createVersion = createAction(
  '[Document] Create Version',
  props<{ version: VersionDocumentRequest }>()
);

export const createVersionSuccess = createAction(
  '[Document] Create Version Success',
  props<{ version: VersionDocumentResponse }>()
);

export const createVersionFailure = createAction(
  '[Document] Create Version Failure',
  props<{ error: string }>()
); 