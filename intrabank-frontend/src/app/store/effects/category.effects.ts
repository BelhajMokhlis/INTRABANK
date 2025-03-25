import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { CategoryService } from '../../core/service/document/category.service';
import * as CategoryActions from '../actions/category.actions';

@Injectable()
export class CategoryEffects {
  constructor(
    private actions$: Actions,
    private categoryService: CategoryService
  ) {
  }

  loadCategories$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap(() => {
        return this.categoryService.getAllCategories().pipe(
          map(categories => {
            return CategoryActions.loadCategoriesSuccess({ categories });
          }),
          catchError(error => {
            return of(CategoryActions.loadCategoriesFailure({ error: error.message || 'Unknown error' }));
          })
        );
      })
    )
  );

  createCategory$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CategoryActions.createCategory),
      mergeMap(({ category }) => {
        return this.categoryService.createCategory(category).pipe(
          map(newCategory => {
            return CategoryActions.createCategorySuccess({ category: newCategory });
          }),
          catchError(error => {
            return of(CategoryActions.createCategoryFailure({ error: error.message || 'Unknown error' }));
          })
        );
      })
    )
  );

  updateCategory$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CategoryActions.updateCategory),
      mergeMap(({ category }) => 
        this.categoryService.updateCategory(category).pipe(
          map(updatedCategory => CategoryActions.updateCategorySuccess({ category: updatedCategory })),
          catchError(error => {
            return of(CategoryActions.updateCategoryFailure({ error: error.message || 'Unknown error' }));
          })
        )
      )
    )
  );

  deleteCategory$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      mergeMap(({ id }) => 
        this.categoryService.deleteCategory(id).pipe(
          map(() => CategoryActions.deleteCategorySuccess({ id })),
          catchError(error => {
            return of(CategoryActions.deleteCategoryFailure({ error: error.message || 'Unknown error' }));
          })
        )
      )
    )
  );
} 