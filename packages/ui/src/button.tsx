import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base = "rounded-lg px-5 py-2.5 font-semibold";
  const style =
    variant === "primary"
      ? "bg-emerald-600 text-white"
      : "border border-slate-900 text-slate-900";
  return <button className={`${base} ${style} ${className}`} {...props} />;
}
