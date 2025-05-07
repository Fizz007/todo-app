export interface User {
  id: number;
  email: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface TodoFormData {
  title: string;
  description: string;
  dueDate: string;
  status: TodoStatus;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
