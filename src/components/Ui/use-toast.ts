"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastType = {
  variant: string;
  id: string;
  title?: string;
  description?: string;
  open: boolean;
};

type State = {
  toasts: ToastType[];
};

const TOAST_REMOVE_DELAY = 4000;

let listeners: ((state: State) => void)[] = [];
let memoryState: State = { toasts: [] };

function dispatch(action: { type: "ADD" | "REMOVE"; toast?: ToastType; toastId?: string }) {
  switch (action.type) {
    case "ADD":
      if (!action.toast) return;
      memoryState = { toasts: [action.toast, ...memoryState.toasts] };
      break;
    case "REMOVE":
      memoryState = {
        toasts: memoryState.toasts.filter((t) => t.id !== action.toastId),
      };
      break;
  }
  listeners.forEach((listener) => listener(memoryState));
}

export function toast({ title, description }: { title?: string; description?: string }) {
  const id = Date.now().toString();
  dispatch({ type: "ADD", toast: {
      id, title, description, open: true,
      variant: ""
  } });

  setTimeout(() => dispatch({ type: "REMOVE", toastId: id }), TOAST_REMOVE_DELAY);
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  return {
    toasts: state.toasts,
  };
}
