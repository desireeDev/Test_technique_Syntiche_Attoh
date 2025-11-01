"use client";
// Gestion des toasts (notifications temporaires)
import * as React from "react";
// Type définissant la structure d'un toast

export type ToastType = {
  variant: string;
  id: string;
  title?: string;
  description?: string;
  open: boolean;
};
// Type définissant l'état des toasts
type State = {
  toasts: ToastType[];
};
// Durée avant la suppression automatique d'un toast (en ms)
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
// Fonction toast()
// ------------------------------------------------------------
// Objectif : créer et afficher un nouveau toast
export function toast({ title, description }: { title?: string; description?: string }) {
  const id = Date.now().toString();
  dispatch({ type: "ADD", toast: {
      id, title, description, open: true,
      variant: ""
  } });

  setTimeout(() => dispatch({ type: "REMOVE", toastId: id }), TOAST_REMOVE_DELAY);
}
// Hook personnalisé : useToast
// ------------------------------------------------------------
// Objectif : fournir aux composants l'accès à la liste des toasts
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
