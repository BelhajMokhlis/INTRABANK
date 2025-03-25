import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { User } from "../../../shared/models/user.model"
import { environment } from "../../../../environments/environment"
import { PageResponse } from "../../../shared/models/page.model"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/admin/users`

  constructor(private http: HttpClient) {}

  getUsers(page = 0, size = 10, department = "", role = "", searchTerm = ""): Observable<PageResponse<User>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())

    if (department) params = params.set("department", department)
    if (role) params = params.set("role", role)
    if (searchTerm) params = params.set("search", searchTerm)

    return this.http.get<PageResponse<User>>(this.API_URL, { params })
  }


  getUserList(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/list`)
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`)
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.API_URL, user)
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, user)
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }
}

