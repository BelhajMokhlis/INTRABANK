import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AppState } from '../../../store/state/app.state';
import { CategoryRequest, CategoryResponse } from '../../../shared/models/category.model';
import * as CategoryActions from '../../../store/actions/category.actions';
import * as CategorySelectors from '../../../store/selectors/category.selectors';

@Component({
  selector: 'app-category-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './category-new.component.html',
  styleUrl: './category-new.component.scss'
})
export class CategoryNewComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  categories: CategoryResponse[] = [];
  editMode = false;
  
  // Toast notification properties
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  toastTimeout: any;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private actions$: Actions
  ) {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    
  }
  
  ngOnInit(): void {
    this.store.dispatch(CategoryActions.loadCategories());
    
    // Subscribe to the categories from the store
    this.store.select(CategorySelectors.selectAllCategories)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(categories => {
        this.categories = categories || [];
      });
    
    // Subscribe to the selected category for edit mode
    this.store.select(CategorySelectors.selectSelectedCategory)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(selectedCategory => {
        this.editMode = !!selectedCategory;
        if (selectedCategory) {
          this.categoryForm.patchValue({
            id: selectedCategory.id,
            name: selectedCategory.name,
            description: selectedCategory.description
          });
        }
      });
    
    // Subscribe to errors for toast notifications
    this.store.select(CategorySelectors.selectCategoryError)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(error => {
        if (error) {
          this.showNotification('An error occurred', 'error');
        }
      });

    // Listen for successful actions
    this.actions$.pipe(
      ofType(
        CategoryActions.createCategorySuccess,
        CategoryActions.updateCategorySuccess,
        CategoryActions.deleteCategorySuccess
      ),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      if (action.type === CategoryActions.createCategorySuccess.type) {
        this.showNotification('Category created successfully', 'success');
      } else if (action.type === CategoryActions.updateCategorySuccess.type) {
        this.showNotification('Category updated successfully', 'success');
      } else if (action.type === CategoryActions.deleteCategorySuccess.type) {
        this.showNotification('Category deleted successfully', 'success');
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData: CategoryRequest = this.categoryForm.value;
      
      if (this.editMode) {
        this.store.dispatch(CategoryActions.updateCategory({ category: categoryData }));
      } else {
        this.store.dispatch(CategoryActions.createCategory({ category: categoryData }));
      }
      
      this.resetForm();
    }
  }
  
  editCategory(category: CategoryResponse): void {
    this.store.dispatch(CategoryActions.setSelectedCategory({ category }));
  }
  
  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.store.dispatch(CategoryActions.deleteCategory({ id }));
    }
  }
  
  resetForm(): void {
    this.categoryForm.reset();
    this.store.dispatch(CategoryActions.resetCategoryForm());
  }

  // Toast notification methods
  showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 3000);
  }
  
  hideToast(): void {
    this.toastVisible = false;
  }
}
