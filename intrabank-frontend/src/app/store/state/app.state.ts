import type { User } from "../../shared/models/user.model"
import type { PageResponse } from "../../shared/models/page.model"
import { CategoryState } from "../reducers/category.reducer"
import { CategoryResponse } from "../../shared/models/category.model"
import { DocumentResponse, VersionDocumentResponse } from "../../shared/models/document.models"

export interface AppState {
  auth: AuthState
  user: UserState
  documents: DocumentState
  workflows: any
  auditLogs: any
  category: CategoryState
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface DocumentState {
  documents: DocumentResponse[]
  selectedDocument: DocumentResponse | null
  document?: DocumentResponse // Single document after upload
  categories?: CategoryResponse[] // Categories in document state
  isLoading: boolean
  loading?: boolean // Used in some reducers
  uploading?: boolean // For document upload
  success?: boolean // For upload success status
  error: string | null
  versionCreation: {
    loading: boolean
    error: string | null
    success: boolean
    version: VersionDocumentResponse | null
  }
}

export const initialDocumentState: DocumentState = {
  documents: [],
  selectedDocument: null,
  document: undefined,
  categories: [],
  isLoading: false,
  loading: false,
  uploading: false,
  success: false,
  error: null,
  versionCreation: {
    loading: false,
    error: null,
    success: false,
    version: null
  }
}

export interface UserState {
  users: User[]
  selectedUser: User | null
  isLoading: boolean
  error: string | null
  totalElements: number
  pageResponse: PageResponse<User> | null
}




