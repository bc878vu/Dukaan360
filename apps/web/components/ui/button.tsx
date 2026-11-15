import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg px-5 py-2.5 font-semibold",
        variant === "primary"
          ? "bg-primary text-white"
          : "border border-navy text-navy",
        className,
      )}
      {...props}
    />
  );
}
