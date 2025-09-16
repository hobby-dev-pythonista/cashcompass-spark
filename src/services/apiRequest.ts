// API request functions using axios

import axios, { AxiosResponse } from 'axios';
import {
  LoginRequest,
  CreateExpenseTypeRequest,
  UpdateExpenseTypeRequest,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  CreateRecurringExpenseRequest,
  UpdateRecurringExpenseRequest,
  BulkUploadFile,
} from '../types/apiTypes';
import {
  LoginResponse,
  LogoutResponse,
  ExpenseTypeResponse,
  ExpenseTypesResponse,
  ExpenseResponse,
  ExpensesResponse,
  ExpenseSummaryResponse,
  RecurringExpenseResponse,
  RecurringExpensesResponse,
  BulkUploadPreviewResponse,
  BulkUploadResponse,
  ApiResponse,
} from '../types/apiResponse';

// Base API configuration
const BASE_URL = 'mydomain.com/api';
const API_VERSION = 'v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: `${BASE_URL}/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const loginRequest = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const logoutRequest = async (): Promise<LogoutResponse> => {
  const response: AxiosResponse<LogoutResponse> = await apiClient.post('/auth/logout');
  return response.data;
};

// Expense Types API calls
export const getExpenseTypesRequest = async (): Promise<ExpenseTypesResponse> => {
  const response: AxiosResponse<ExpenseTypesResponse> = await apiClient.get('/expense-types');
  return response.data;
};

export const getExpenseTypeRequest = async (id: string): Promise<ExpenseTypeResponse> => {
  const response: AxiosResponse<ExpenseTypeResponse> = await apiClient.get(`/expense-types/${id}`);
  return response.data;
};

export const createExpenseTypeRequest = async (data: CreateExpenseTypeRequest): Promise<ExpenseTypeResponse> => {
  const response: AxiosResponse<ExpenseTypeResponse> = await apiClient.post('/expense-types', data);
  return response.data;
};

export const updateExpenseTypeRequest = async (id: string, data: UpdateExpenseTypeRequest): Promise<ExpenseTypeResponse> => {
  const response: AxiosResponse<ExpenseTypeResponse> = await apiClient.put(`/expense-types/${id}`, data);
  return response.data;
};

export const deleteExpenseTypeRequest = async (id: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await apiClient.delete(`/expense-types/${id}`);
  return response.data;
};

// Expenses API calls
export const getExpensesRequest = async (params?: {
  page?: number;
  per_page?: number;
  expense_type_id?: string;
  date_from?: string;
  date_to?: string;
  payment_method?: string;
}): Promise<ExpensesResponse> => {
  const response: AxiosResponse<ExpensesResponse> = await apiClient.get('/expenses', { params });
  return response.data;
};

export const getExpenseRequest = async (id: string): Promise<ExpenseResponse> => {
  const response: AxiosResponse<ExpenseResponse> = await apiClient.get(`/expenses/${id}`);
  return response.data;
};

export const createExpenseRequest = async (data: CreateExpenseRequest): Promise<ExpenseResponse> => {
  const response: AxiosResponse<ExpenseResponse> = await apiClient.post('/expenses', data);
  return response.data;
};

export const updateExpenseRequest = async (id: string, data: UpdateExpenseRequest): Promise<ExpenseResponse> => {
  const response: AxiosResponse<ExpenseResponse> = await apiClient.put(`/expenses/${id}`, data);
  return response.data;
};

export const deleteExpenseRequest = async (id: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await apiClient.delete(`/expenses/${id}`);
  return response.data;
};

export const getExpenseSummaryRequest = async (params?: {
  date_from?: string;
  date_to?: string;
}): Promise<ExpenseSummaryResponse> => {
  const response: AxiosResponse<ExpenseSummaryResponse> = await apiClient.get('/expenses/summary', { params });
  return response.data;
};

// Recurring Expenses API calls
export const getRecurringExpensesRequest = async (params?: {
  page?: number;
  per_page?: number;
}): Promise<RecurringExpensesResponse> => {
  const response: AxiosResponse<RecurringExpensesResponse> = await apiClient.get('/recurring-expenses', { params });
  return response.data;
};

export const createRecurringExpenseRequest = async (data: CreateRecurringExpenseRequest): Promise<RecurringExpenseResponse> => {
  const response: AxiosResponse<RecurringExpenseResponse> = await apiClient.post('/recurring-expenses', data);
  return response.data;
};

export const updateRecurringExpenseRequest = async (id: string, data: UpdateRecurringExpenseRequest): Promise<RecurringExpenseResponse> => {
  const response: AxiosResponse<RecurringExpenseResponse> = await apiClient.put(`/recurring-expenses/${id}`, data);
  return response.data;
};

export const deleteRecurringExpenseRequest = async (id: string): Promise<ApiResponse> => {
  const response: AxiosResponse<ApiResponse> = await apiClient.delete(`/recurring-expenses/${id}`);
  return response.data;
};

// Bulk Upload API calls
export const bulkUploadPreviewRequest = async (file: BulkUploadFile): Promise<BulkUploadPreviewResponse> => {
  const formData = new FormData();
  formData.append('file', file.file);
  formData.append('type', file.type);

  const response: AxiosResponse<BulkUploadPreviewResponse> = await apiClient.post('/bulk-upload/preview', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const bulkUploadConfirmRequest = async (file: BulkUploadFile): Promise<BulkUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file.file);
  formData.append('type', file.type);

  const response: AxiosResponse<BulkUploadResponse> = await apiClient.post('/bulk-upload/confirm', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};