import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from '../reducers/category.reducer';

export const selectCategoryState = createFeatureSelector<CategoryState>('category');

export const selectAllCategories = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.categories
);

export const selectCategoryLoading = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.loading
);

export const selectCategoryError = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.error
);

export const selectSelectedCategory = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.selectedCategory
);

export const selectIsEditMode = createSelector(
  selectSelectedCategory,
  (selectedCategory) => !!selectedCategory
); 