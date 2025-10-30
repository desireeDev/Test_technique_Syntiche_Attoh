// app/layout.tsx oiur le routing de l'application
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/app/components/ui/toaster";
import { Toaster as Sonner } from "@/app/components/ui/sonner";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}  {/* Page spécifique s’affichera ici */}
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
