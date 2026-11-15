// English + Urdu strings. Keys are shared by web + mobile.
export type Locale = "en" | "ur";

export const strings = {
  en: {
    appName: "Dukaan360",
    tagline: "Manage. Grow. Succeed.",
    dashboard: "Dashboard",
    products: "Products",
    inventory: "Inventory",
    sales: "Sales",
    purchases: "Purchases",
    customers: "Customers",
    suppliers: "Suppliers",
    expenses: "Expenses",
    reports: "Reports",
    settings: "Settings",
    signIn: "Sign in",
    signOut: "Sign out",
    lowStock: "Low stock",
  },
  ur: {
    appName: "Dukaan360",
    tagline: "Manage karein. Grow karein. Kamyab hon.",
    dashboard: "Dashboard",
    products: "Products",
    inventory: "Inventory",
    sales: "Sales",
    purchases: "Purchases",
    customers: "Customers",
    suppliers: "Suppliers",
    expenses: "Expenses",
    reports: "Reports",
    settings: "Settings",
    signIn: "Sign in",
    signOut: "Sign out",
    lowStock: "Low stock",
  },
} satisfies Record<Locale, Record<string, string>>;

export function t(locale: Locale, key: keyof (typeof strings)["en"]): string {
  return strings[locale][key] ?? strings.en[key];
}
