"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/(backend)/lib/utils";
// Définition des variantes de styles pour le composant Button
const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-primary",
      outline: "button-outline",
      secondary: "button-secondary",
      ghost: "bg-transparent text-foreground hover:bg-muted",
      link: "text-primary underline-offset-4 hover:underline",
      destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
    },
    size: {
      default: "",
      sm: "button-sm",
      lg: "button-lg",
      icon: "h-10 w-10 p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
// Définition des props attendues par le composant Button
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
// Composant : Button
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };