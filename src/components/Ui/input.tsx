"use client";
import * as React from "react";
import { cn } from "@/app/(backend)/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full rounded-[var(--radius)] border-2 border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] px-4 py-3 text-base transition-all duration-300 ease-in-out",
        "focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:-translate-y-[1px]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
