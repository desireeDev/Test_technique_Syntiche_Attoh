"use client";

import { useToast, ToastType } from "./use-toast";
import { ToastClose } from "@/app/components/ui/toast";
import { AnimatePresence, motion } from "framer-motion";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
      <AnimatePresence>
        {toasts.map((t: ToastType) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border rounded-lg shadow-lg p-4 w-80 flex justify-between items-start"
          >
            <div className="flex flex-col gap-1">
              {t.title && <p className="font-semibold">{t.title}</p>}
              {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
            </div>
            <ToastClose onClick={() => {}} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
