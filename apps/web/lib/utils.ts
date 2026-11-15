// cn() — merge Tailwind class names (shadcn-style helper).
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
