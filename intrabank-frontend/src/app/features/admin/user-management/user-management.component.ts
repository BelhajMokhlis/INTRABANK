import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Store } from "@ngrx/store"
import { Observable, tap, map, take, combineLatest } from "rxjs"
import { AppState } from "../../../store/state/app.state"
import * as UserActions from "../../../store/actions/user.actions"
import * as UserSelectors from "../../../store/selectors/user.selectors"
import { User } from "../../../shared/models/user.model"
import { Role } from "../../../shared/models/role.model"
import { PageResponse } from "../../../shared/models/page.model"
@Component({
  selector: "app-user-management",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./user-management.component.html",
})
export class UserManagementComponent implements OnInit {
  users$: Observable<PageResponse<User>>
  isLoading$: Observable<boolean>
  error$: Observable<string | null>
  searchForm: FormGroup
  userForm: FormGroup
  showUserModal = false
  editingUser: User | null = null
  searchTerm = ''
  selectedRole = ''
  selectedStatus = ''
  selectedDepartment = ''
  currentPage = 1
  pageSize: number = 10
  totalItems = 0
  totalPages = 1
  pages: number[] = []
  readonly Role = Role
  readonly Math = Math
  initialFormValues: any = {}
  formHasChanges = false

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) {
    this.store.select(state => state).subscribe(state => {
      console.log('Entire store state:', state);
    });

    this.users$ = this.store.select(UserSelectors.selectUserState).pipe(
      tap(state => {
        console.log('Raw state from store:', state);
      }),
      map(state => {
        if (!state || !state.pageResponse) {
          console.log('No state or pageResponse found, returning empty state');
          return {
            content: [],
            pageable: {
              pageNumber: 0,
              pageSize: this.pageSize,
              sort: { empty: true, unsorted: true, sorted: false },
              offset: 0,
              unpaged: false,
              paged: true
            },
            last: true,
            totalPages: 0,
            totalElements: 0,
            first: true,
            size: this.pageSize,
            number: 0,
            sort: { empty: true, unsorted: true, sorted: false },
            numberOfElements: 0,
            empty: true
          };
        }
        
        console.log('PageResponse content:', state.pageResponse.content);
        return state.pageResponse;
      }),
      tap(page => {
        console.log('Final mapped page:', page);
        this.totalItems = page.totalElements;
        this.totalPages = page.totalPages;
        this.pages = Array.from({ length: page.totalPages }, (_, i) => i + 1);
        this.currentPage = page.number + 1;
      })
    );

    this.isLoading$ = this.store.select(UserSelectors.selectUsersLoading);
    this.error$ = this.store.select(UserSelectors.selectUsersError);

    this.searchForm = this.fb.group({
      search: [''],
      role: [''],
      department: [''],
      status: ['']
    });

    // Subscribe to form value changes
    this.searchForm.valueChanges.subscribe(values => {
      this.searchTerm = values.search || '';
      this.selectedRole = values.role || '';
      this.selectedDepartment = values.department || '';
      this.selectedStatus = values.status || '';
    });

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      phone: [''],
      address: [''],
      role: ['USER', Validators.required],
      password: ['', Validators.required]
    });

    // Subscribe to form changes
    this.userForm.valueChanges.subscribe(() => {
      if (this.editingUser) {
        this.formHasChanges = !this.isFormUnchanged();
      } else {
        this.formHasChanges = true;
      }
    });
  }

  ngOnInit(): void {
    console.log('Loading users...');
    this.loadUsers();
  }

  loadUsers(): void {
    this.store.dispatch(UserActions.loadUsers({ 
      page: this.currentPage - 1, 
      size: this.pageSize,
      searchTerm: this.searchTerm,
      department: this.selectedDepartment,
      role: this.selectedRole
    }));
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.loadUsers();
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page when filters change
    this.loadUsers();
  }

  resetSearch(): void {
    this.searchForm.reset({
      search: '',
      role: '',
      department: '',
      status: ''
    });
    this.currentPage = 1;
    this.loadUsers();
  }

  openCreateUserModal(): void {
    this.editingUser = null
    this.userForm.reset({ role: 'USER' })
    this.showUserModal = true
  }

  closeUserModal(): void {
    this.showUserModal = false
    this.userForm.reset()
    this.editingUser = null
    this.initialFormValues = {}
    this.formHasChanges = false
  }

  editUser(user: User): void {
    this.editingUser = user
    const formData = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      department: user.department,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role
    }
    
    this.userForm.patchValue(formData)
    // Store initial values for comparison
    this.initialFormValues = { ...formData }
    this.formHasChanges = false
    
    // Remove password validator for edit mode
    const passwordControl = this.userForm.get('password')
    if (passwordControl) {
      passwordControl.clearValidators()
      passwordControl.updateValueAndValidity()
    }
    
    this.showUserModal = true
  }

  private isFormUnchanged(): boolean {
    const currentValues = this.userForm.value
    return Object.keys(this.initialFormValues).every(key => 
      this.initialFormValues[key] === currentValues[key]
    )
  }

  saveUser(): void {
    if (this.userForm.valid && this.formHasChanges) {
      const userData = this.userForm.value;
      
      if (this.editingUser) {
        // Only include changed fields when updating
        const changedData = this.getChangedFields(userData);
        if (Object.keys(changedData).length > 0) {
          this.store.dispatch(UserActions.updateUser({ 
            id: this.editingUser.id, 
            user: changedData 
          }));
        }
      } else {
        this.store.dispatch(UserActions.createUser({ user: userData }));
      }
      
      // Handle success/failure
      this.handleSaveResponse();
    } else {
      this.showValidationErrors();
    }
  }

  private getChangedFields(currentData: any): Partial<User> {
    const changedFields: Partial<User> = {};
    Object.keys(this.initialFormValues).forEach(key => {
      if (currentData[key] !== this.initialFormValues[key] && currentData[key] !== '') {
        changedFields[key as keyof User] = currentData[key];
      }
    });
    return changedFields;
  }

  private handleSaveResponse(): void {
    // Subscribe to both error and success states
    combineLatest([
      this.store.select(UserSelectors.selectUsersError),
      this.store.select(UserSelectors.selectUserSaveSuccess)
    ]).pipe(
      take(1),
      tap(([error, success]) => {
        if (success) {
          this.closeUserModal();
          // You might want to show a success toast/notification here
        } else if (error) {
          // Show error message to user
          console.error('Error saving user:', error);
        }
      })
    ).subscribe();
  }

  private showValidationErrors(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  toggleUserStatus(user: User): void {
    this.store.dispatch(UserActions.deleteUser({ id: user.id }));
    this.loadUsers();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
      this.loadUsers()
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
      this.loadUsers()
    }
  }

  goToPage(page: number): void {
    this.currentPage = page
    this.loadUsers()
  }

  onPageSizeChange(): void {
    this.currentPage = 1
    this.loadUsers()
  }
}

