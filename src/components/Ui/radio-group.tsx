"use client";
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/app/(backend)/lib/utils";
// Composant : RadioGroup
// ------------------------------------------------------------
// Objectif : afficher un groupe de boutons radio stylisés
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn("radio-group", className)} {...props} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
// Composant : RadioGroupItem
// ------------------------------------------------------------
// Objectif : afficher un bouton radio stylisé
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "radio-item aspect-square h-5 w-5 rounded-full border-2 border-[var(--border)] bg-[var(--card)] transition-all",
      "data-[state=checked]:border-[var(--primary)] data-[state=checked]:bg-[var(--primary)]",
      "hover:border-[var(--primary-light)] hover:shadow-md",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-[var(--primary-foreground)]">
      <Circle className="h-2.5 w-2.5 fill-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
