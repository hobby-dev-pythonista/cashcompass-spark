// Shared types for API requests and responses

export type Category = 'Expense' | 'Income';

export type PaymentMethod = 
  | 'Cash' 
  | 'Credit Card' 
  | 'Debit Card' 
  | 'Bank Transfer' 
  | 'UPI' 
  | 'PhonePe' 
  | 'GPay' 
  | 'Other';

export type RecurrenceType = 'Weekly' | 'Monthly' | 'Yearly';

export interface ExpenseType {
  id: string;
  category: Category;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  expense_type_id: string;
  amount: number;
  date: string;
  note?: string;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  expense_type?: ExpenseType;
}

export interface RecurringExpense {
  id: string;
  expense_type_id: string;
  amount: number;
  recurrence_type: RecurrenceType;
  start_date: string;
  end_date?: string;
  note?: string;
  payment_method: PaymentMethod;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expense_type?: ExpenseType;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Request DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateExpenseTypeRequest {
  category: Category;
  name: string;
  icon: string;
}

export interface UpdateExpenseTypeRequest {
  category?: Category;
  name?: string;
  icon?: string;
}

export interface CreateExpenseRequest {
  expense_type_id: string;
  amount: number;
  date: string;
  note?: string;
  payment_method: PaymentMethod;
}

export interface UpdateExpenseRequest {
  expense_type_id?: string;
  amount?: number;
  date?: string;
  note?: string;
  payment_method?: PaymentMethod;
}

export interface CreateRecurringExpenseRequest {
  expense_type_id: string;
  amount: number;
  recurrence_type: RecurrenceType;
  start_date: string;
  end_date?: string;
  note?: string;
  payment_method: PaymentMethod;
}

export interface UpdateRecurringExpenseRequest {
  expense_type_id?: string;
  amount?: number;
  recurrence_type?: RecurrenceType;
  start_date?: string;
  end_date?: string;
  note?: string;
  payment_method?: PaymentMethod;
  is_active?: boolean;
}

// Bulk upload types
export interface BulkUploadFile {
  file: File;
  type: 'csv' | 'excel' | 'phonepe' | 'gpay';
}

export interface BulkUploadPreview {
  total_records: number;
  valid_records: number;
  invalid_records: number;
  preview_data: Partial<Expense>[];
  errors: string[];
}