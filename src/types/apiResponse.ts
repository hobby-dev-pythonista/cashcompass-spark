// API Response types for all endpoints

import { User, ExpenseType, Expense, RecurringExpense, BulkUploadPreview } from './apiTypes';

// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Paginated response structure
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Authentication responses
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expires_at: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Expense Type responses
export interface ExpenseTypeResponse {
  success: boolean;
  message: string;
  data: ExpenseType;
}

export interface ExpenseTypesResponse {
  success: boolean;
  message: string;
  data: ExpenseType[];
}

// Expense responses
export interface ExpenseResponse {
  success: boolean;
  message: string;
  data: Expense;
}

export interface ExpensesResponse extends PaginatedResponse<Expense> {}

export interface ExpenseSummaryResponse {
  success: boolean;
  message: string;
  data: {
    total_income: number;
    total_expenses: number;
    net_amount: number;
    monthly_breakdown: {
      month: string;
      income: number;
      expenses: number;
      net: number;
    }[];
    category_breakdown: {
      category: string;
      amount: number;
      percentage: number;
    }[];
  };
}

// Recurring Expense responses
export interface RecurringExpenseResponse {
  success: boolean;
  message: string;
  data: RecurringExpense;
}

export interface RecurringExpensesResponse extends PaginatedResponse<RecurringExpense> {}

// Bulk upload responses
export interface BulkUploadPreviewResponse {
  success: boolean;
  message: string;
  data: BulkUploadPreview;
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  data: {
    total_processed: number;
    successful: number;
    failed: number;
    failed_records: Array<{
      row: number;
      errors: string[];
      data: Partial<Expense>;
    }>;
  };
}

// Error response structure
export interface ErrorResponse {
  success: false;
  message: string;
  errors: string[];
  status_code?: number;
}