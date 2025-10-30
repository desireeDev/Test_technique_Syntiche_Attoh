"use client";
import * as React from "react";
import { cn } from "@/app/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("input", className)} // Utilise la classe CSS globale "input"
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };