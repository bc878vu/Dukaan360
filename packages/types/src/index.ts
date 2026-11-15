export type SupportedLocale = "en" | "ur";
export type BusinessRole = "owner" | "admin" | "branch_manager" | "accountant" | "cashier" | "inventory_manager" | "staff";
export interface BusinessSummary { id:string; name:string; businessType:string; currencyCode:string; countryCode:string; }
