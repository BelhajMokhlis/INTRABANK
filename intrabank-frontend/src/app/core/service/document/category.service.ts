import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { CategoryRequest, CategoryResponse } from "../../../shared/models/category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private http: HttpClient) {
  }

  // Get all categories
  getAllCategories(): Observable<CategoryResponse[]> {
    const url = `${environment.apiUrl}/users/categories`;
    return this.http.get<CategoryResponse[]>(url);
  }

  // Get category by ID
  getCategoryById(id: string): Observable<CategoryResponse> {
    const url = `${environment.apiUrl}/users/categories/${id}`;
    return this.http.get<CategoryResponse>(url);
  }

  // Create a new category
  createCategory(category: CategoryRequest): Observable<CategoryResponse> {
    const url = `${environment.apiUrl}/admin/categories`;
    return this.http.post<CategoryResponse>(url, category);
  }

  // Update category
  updateCategory(category: CategoryRequest): Observable<CategoryResponse> {
    const url = `${environment.apiUrl}/admin/categories/${category.id}`;
    return this.http.put<CategoryResponse>(url, category);
  }

  // Delete category
  deleteCategory(id: string): Observable<void> {
    const url = `${environment.apiUrl}/admin/categories/${id}`;
    return this.http.delete<void>(url);
  }
} 