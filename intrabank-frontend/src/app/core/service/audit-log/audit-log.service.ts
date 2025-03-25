import { Injectable } from "@angular/core"
import {  HttpClient, HttpParams } from "@angular/common/http"
import  { Observable } from "rxjs"
import { environment } from "../../../../environments/environment.development"
import  { AuditLog } from "../../../shared/models/audit-log.model"
import { PageResponse } from "../../../shared/models/page.model"
@Injectable({
  providedIn: "root",
})
export class AuditLogService {
  private apiUrl = `${environment.apiUrl}/audit-logs`

  constructor(private http: HttpClient) {}

}

