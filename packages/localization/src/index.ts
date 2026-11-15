import type { SupportedLocale } from "@dukaan360/types";
export const messages:Record<SupportedLocale,{appName:string;tagline:string}>={en:{appName:"Dukaan360",tagline:"Manage. Grow. Succeed."},ur:{appName:"دکان 360",tagline:"انتظام کریں۔ ترقی کریں۔ کامیاب ہوں۔"}};
export function isRtl(locale:SupportedLocale):boolean{return locale==="ur";}
