import { createAction, props } from '@ngrx/store';
import { CategoryRequest, CategoryResponse } from '../../shared/models/category.model';

// Load Categories
export const loadCategories = createAction('[Category] Load Categories');
export const loadCategoriesSuccess = createAction(
  '[Category] Load Categories Success',
  props<{ categories: CategoryResponse[] }>()
);
export const loadCategoriesFailure = createAction(
  '[Category] Load Categories Failure',
  props<{ error: any }>()
);

// Create Category
export const createCategory = createAction(
  '[Category] Create Category',
  props<{ category: CategoryRequest }>()
);
export const createCategorySuccess = createAction(
  '[Category] Create Category Success',
  props<{ category: CategoryResponse }>()
);
export const createCategoryFailure = createAction(
  '[Category] Create Category Failure',
  props<{ error: any }>()
);

// Update Category
export const updateCategory = createAction(
  '[Category] Update Category',
  props<{ category: CategoryRequest }>()
);
export const updateCategorySuccess = createAction(
  '[Category] Update Category Success',
  props<{ category: CategoryResponse }>()
);
export const updateCategoryFailure = createAction(
  '[Category] Update Category Failure',
  props<{ error: any }>()
);

// Delete Category
export const deleteCategory = createAction(
  '[Category] Delete Category',
  props<{ id: string }>()
);
export const deleteCategorySuccess = createAction(
  '[Category] Delete Category Success',
  props<{ id: string }>()
);
export const deleteCategoryFailure = createAction(
  '[Category] Delete Category Failure',
  props<{ error: any }>()
);

// Set Selected Category
export const setSelectedCategory = createAction(
  '[Category] Set Selected Category',
  props<{ category: CategoryResponse | null }>()
);

// Reset Form
export const resetCategoryForm = createAction('[Category] Reset Form'); 