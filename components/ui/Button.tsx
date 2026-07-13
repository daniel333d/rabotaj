import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-blue-700 shadow-soft",
  secondary: "bg-navy text-white hover:bg-slate-800 shadow-soft",
  outline: "border border-border bg-white text-ink hover:border-brand hover:text-brand",
  ghost: "text-ink hover:bg-brand-light"
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base"
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} target={props.target} rel={props.rel} onClick={props.onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} onClick={buttonProps.onClick} disabled={buttonProps.disabled} aria-label={buttonProps["aria-label"]}>
      {children}
    </button>
  );
}
