"use client";
import { useToast, ToastType } from "./use-toast";
import { ToastClose } from "@/app/components/ui/toast";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="toaster-container fixed bottom-4 right-4 flex flex-col gap-3 z-50">
      <AnimatePresence>
        {toasts.map((t: ToastType) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "toast-custom border rounded-xl shadow-2xl p-4 w-80 flex justify-between items-start backdrop-blur-sm",
              t.variant === "destructive" 
                ? "toast-destructive-custom bg-destructive/95 text-destructive-foreground border-destructive" 
                : "toast-default-custom bg-card/95 border-primary/20"
            )}
          >
            <div className="flex flex-col gap-1 flex-1 mr-2">
              {t.title && <p className="toast-title-custom font-semibold text-sm">{t.title}</p>}
              {t.description && <p className="toast-description-custom text-sm text-muted-foreground">{t.description}</p>}
            </div>
            <ToastClose className="toast-close-custom hover:bg-primary/10 rounded transition-colors" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Fonction utilitaire pour les classes conditionnelles
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}