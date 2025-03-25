import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentState } from '../state/app.state';

export const selectDocumentState = createFeatureSelector<DocumentState>('document');

export const selectSelectedDocument = createSelector(
  selectDocumentState,
  state => state.selectedDocument
);

export const selectDocumentLoading = createSelector(
  selectDocumentState,
  state => state.loading
);

export const selectDocumentError = createSelector(
  selectDocumentState,
  state => state.error
);

export const selectDocumentSuccess = createSelector(
  selectDocumentState,
  state => state.success
);

export const selectVersionCreationState = (state: { document: DocumentState }) => state.document.versionCreation;

export const selectVersionCreationLoading = createSelector(
  selectVersionCreationState,
  (state) => state.loading
);

export const selectVersionCreationError = createSelector(
  selectVersionCreationState,
  (state) => state.error
);

export const selectVersionCreationSuccess = createSelector(
  selectVersionCreationState,
  (state) => state.success
);

export const selectCreatedVersion = createSelector(
  selectVersionCreationState,
  (state) => state.version
);
