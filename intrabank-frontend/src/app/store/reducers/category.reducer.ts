import { createReducer, on } from '@ngrx/store';
import { CategoryResponse } from '../../shared/models/category.model';
import * as CategoryActions from '../actions/category.actions';

export interface CategoryState {
  categories: CategoryResponse[];
  selectedCategory: CategoryResponse | null;
  loading: boolean;
  error: any;
}

export const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null
};

export const categoryReducer = createReducer(
  initialState,
  
  // Load Categories
  on(CategoryActions.loadCategories, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
    error: null
  })),
  on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Category
  on(CategoryActions.createCategory, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CategoryActions.createCategorySuccess, (state, { category }) => ({
    ...state,
    categories: [...state.categories, category],
    loading: false,
    error: null
  })),
  on(CategoryActions.createCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Category
  on(CategoryActions.updateCategory, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CategoryActions.updateCategorySuccess, (state, { category }) => ({
    ...state,
    categories: state.categories.map(item => 
      item.id === category.id ? category : item
    ),
    selectedCategory: null,
    loading: false,
    error: null
  })),
  on(CategoryActions.updateCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Category
  on(CategoryActions.deleteCategory, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CategoryActions.deleteCategorySuccess, (state, { id }) => ({
    ...state,
    categories: state.categories.filter(category => category.id !== id),
    loading: false,
    error: null
  })),
  on(CategoryActions.deleteCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Set Selected Category
  on(CategoryActions.setSelectedCategory, (state, { category }) => ({
    ...state,
    selectedCategory: category
  })),
  
  // Reset Form
  on(CategoryActions.resetCategoryForm, state => ({
    ...state,
    selectedCategory: null,
    error: null
  }))
); 