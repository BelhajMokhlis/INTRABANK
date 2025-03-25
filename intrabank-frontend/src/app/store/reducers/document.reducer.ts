import { createReducer, on } from '@ngrx/store';
import * as fromDocumentActions from '../actions/document.actions';
import { initialDocumentState} from '../state/app.state';

export const documentReducer = createReducer(
  initialDocumentState,
  
  // Upload document
  on(fromDocumentActions.uploadDocument, (state) => ({
    ...state,
    uploading: true,
    success: false,
    error: null
  })),
  
  on(fromDocumentActions.uploadDocumentSuccess, (state, { document }) => ({
    ...state,
    document,
    uploading: false,
    success: true
  })),
  
  on(fromDocumentActions.uploadDocumentFailure, (state, { error }) => ({
    ...state,
    uploading: false,
    error
  })),
  
  // Load categories
  on(fromDocumentActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(fromDocumentActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false
  })),
  
  on(fromDocumentActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update document
  on(fromDocumentActions.updateDocument, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(fromDocumentActions.updateDocumentSuccess, (state, { document }) => ({
    ...state,
    selectedDocument: document,
    loading: false,
    success: true
  })),
  
  on(fromDocumentActions.updateDocumentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Reset state
  on(fromDocumentActions.resetDocumentState, (state) => ({
    ...initialDocumentState
  })),

  on(fromDocumentActions.createVersion, (state) => ({
    ...state,
    versionCreation: {
      ...state.versionCreation,
      loading: true,
      error: null,
      success: false
    }
  })),
  
  on(fromDocumentActions.createVersionSuccess, (state, { version }) => ({
    ...state,
    versionCreation: {
      ...state.versionCreation,
      loading: false,
      success: true,
      version
    }
  })),
  
  on(fromDocumentActions.createVersionFailure, (state, { error }) => ({
    ...state,
    versionCreation: {
      ...state.versionCreation,
      loading: false,
      error,
      success: false
    }
  }))
); 