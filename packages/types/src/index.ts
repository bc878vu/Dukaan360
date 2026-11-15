// Dukaan360 canonical types — mirrors the Supabase schema (PRD Part 5).
// Web + mobile import these; never redefine entities per app.

export type CurrencyCode = string; // ISO 4217, e.g. "PKR", "USD"
export type Role =
  | "owner"
  | "admin"
  | "branch_manager"
  | "accountant"
  | "cashier"
  | "inventory_manager"
  | "staff";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  preferred_language: "en" | "ur";
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  country_code: string;
  currency_code: CurrencyCode;
  timezone: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  role: Role;
  status: "active" | "invited" | "suspended";
  created_at: string;
}

export interface Branch {
  id: string;
  business_id: string;
  name: string;
  address: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  business_id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  sku: string | null;
  barcode: string | null;
  unit: string;
  purchase_price: number;
  selling_price: number;
  reorder_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  opening_balance: number;
  created_at: string;
}

export interface Supplier {
  id: string;
  business_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  opening_balance: number;
  created_at: string;
}

export interface SaleItem {
  id: string;
  business_id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax: number;
  line_total: number;
}

export interface Sale {
  id: string;
  business_id: string;
  branch_id: string | null;
  customer_id: string | null;
  invoice_number: string;
  status: "draft" | "completed" | "returned" | "void";
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  created_by: string | null;
  created_at: string;
  items?: SaleItem[];
}

export interface Expense {
  id: string;
  business_id: string;
  branch_id: string | null;
  description: string;
  amount: number;
  expense_date: string;
  created_by: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  business_id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
