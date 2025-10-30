"use client";
import * as React from "react";

interface ToastItem {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
}

let listeners: Array<(toasts: ToastItem[]) => void> = [];
let memoryState: ToastItem[] = [];

function dispatch(toasts: ToastItem[]) {
  memoryState = toasts;
  listeners.forEach((listener) => listener(memoryState));
}

function genId() {
  return Math.random().toString(36).substring(2, 9);
}

function toast({ title, description }: Omit<ToastItem, "id" | "open">) {
  const id = genId();
  const newToast: ToastItem = { id, title, description, open: true };
  dispatch([newToast, ...memoryState]);
  const dismiss = () => {
    dispatch(memoryState.filter((t) => t.id !== id));
  };
  return { id, dismiss };
}

function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>(memoryState);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id?: string) => {
      if (id) {
        dispatch(memoryState.filter((t) => t.id !== id));
      } else {
        dispatch([]);
      }
    },
  };
}

export { useToast, toast };
