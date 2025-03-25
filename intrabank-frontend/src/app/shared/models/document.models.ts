export enum DocumentType {
  PDF = 'PDF',
  DOC = 'DOC',
  DOCX = 'DOCX',
  XLS = 'XLS',
  XLSX = 'XLSX',
  TXT = 'TXT',


  // Add other document types as needed
}

export enum DocumentStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  // Add other statuses as needed
}

export interface FichierDocumentRequest {
  versionId?: string;
  nomFichier: string;
  typeFichier: string;
  fichier: string; // base64 encoded content
}

export interface FichierDocumentResponse {
  id: string;
  versionId: string;
  nomFichier: string;
  typeFichier: string;
  cheminStockage: string;
}

export interface VersionDocumentRequest {
  documentId?: string;
  numeroVersion: number;
  editeurId: string;
  commentaire: string;
  fichiers: FichierDocumentRequest[];
}

export interface VersionDocumentResponse {
  id: string;
  documentId: string;
  numeroVersion: number;
  editeurId: string;
  dateMiseAJour: string;
  fichiers: FichierDocumentResponse[];
  commentaire: string;
}

export interface DocumentRequest {
  titre: string;
  type: DocumentType;
  status: DocumentStatus;
  categoryId: string;
  auteurId: string;
  versions: VersionDocumentRequest[];
}

export interface DocumentResponse {
  id: string;
  titre: string;
  type: DocumentType;
  status: DocumentStatus;
  categoryId: string;
  categoryName: string;
  auteurId: string;
  auteurNom: string;
  versions: VersionDocumentResponse[];
}

export interface DocumentUpdateRequest {
  titre: string;
  categoryId: string;
  auteurId: string;
}

export interface PagedDocumentResponse {
  content: DocumentResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  empty: boolean;
} 