"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/app/components/ui/toaster";
import { Toaster as Sonner } from "@/app/components/ui/sonner";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full min-h-screen bg-gradient-to-br from-primary to-secondary text-foreground font-sans">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {/* Toasters */}
            <Toaster />
            <Sonner />

            {/* Wrapper principal */}
            <main className="flex flex-col min-h-screen p-8 gap-8">
              
              {/* Card container pour centraliser le contenu */}
              <div className="max-w-4xl w-full mx-auto p-6 bg-card rounded-lg shadow-elegant">
                {children}
              </div>
            </main>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
