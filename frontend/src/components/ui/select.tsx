import { cn } from "../../lib/utils";
import { SelectHTMLAttributes, ButtonHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn("border rounded px-2 py-1 focus:outline-none", className)}
      {...props}
    >
      {children}
    </select>
  );
}

interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function SelectTrigger({
  className,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <button className={cn("border rounded px-2 py-1", className)} {...props}>
      {children}
    </button>
  );
}

export function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("border p-2", className)}>{children}</div>;
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}
