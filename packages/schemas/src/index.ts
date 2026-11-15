// Zod validation schemas — single source of truth for web + mobile forms.
// Install zod in the consuming app; this package only exports schemas.
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  unit: z.string().default("piece"),
  purchase_price: z.number().min(0),
  selling_price: z.number().min(0),
  reorder_level: z.number().min(0).default(0),
  category_id: z.string().uuid().optional().nullable(),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  opening_balance: z.number().default(0),
});

export const supplierSchema = customerSchema; // same shape for v1

export const saleItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().positive(),
  unit_price: z.number().min(0),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
});

export const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive(),
  expense_date: z.string().date(),
  branch_id: z.string().uuid().optional().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type SaleItemInput = z.infer<typeof saleItemSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
