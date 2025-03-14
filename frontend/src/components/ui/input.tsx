import { cn } from "../../lib/utils";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-400",
        className
      )}
      {...props}
    />
  );
}
