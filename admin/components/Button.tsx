import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ variant = "primary", className = "", children, ...props }: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-cyan text-background hover:bg-cyan/90",
    secondary: "border border-border hover:bg-white/5",
    danger: "bg-red-500/15 text-red-400 hover:bg-red-500/25",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
