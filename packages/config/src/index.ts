// App-wide constants.
export const APP_NAME = "Dukaan360";
export const APP_TAGLINE = "Manage. Grow. Succeed.";
export const DEFAULT_CURRENCY = "PKR";
export const DEFAULT_COUNTRY = "PK";
export const DEFAULT_TIMEZONE = "Asia/Karachi";
export const DEFAULT_LANGUAGE = "en" as const;

export const SUBSCRIPTION_PLANS = [
  { id: "free", name: "Free", priceMonthly: 0 },
  { id: "starter", name: "Starter", priceMonthly: 999 },
  { id: "business", name: "Business", priceMonthly: 2499 },
  { id: "enterprise", name: "Enterprise", priceMonthly: 5999 },
] as const;

export const BUSINESS_TYPES = [
  "retail",
  "general_store",
  "grocery",
  "garment",
  "wholesale",
  "restaurant",
  "service",
  "online_seller",
  "other",
] as const;
