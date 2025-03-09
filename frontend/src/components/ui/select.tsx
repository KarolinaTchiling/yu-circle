import { cn } from "@/lib/utils";
import { SelectHTMLAttributes } from "react";

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
