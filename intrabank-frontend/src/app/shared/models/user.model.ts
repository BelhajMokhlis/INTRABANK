import { Role } from "./role.model"

export interface User {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    role:  Role
    department: string
    createdAt: string
    updatedAt: string
    phone?: string
    address?: string
  }
  
  