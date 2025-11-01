"use client";
import { cn } from "@/app/(backend)/lib/utils";

export const Card = ({ className, ...props }) => (
  <div className={cn("card", className)} {...props} />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-xl font-semibold text-foreground", className)} {...props} />
);

export const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

export const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center justify-end p-6 pt-0 gap-2", className)} {...props} />
);