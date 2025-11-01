//  "use client" : Indique à Next.js que ce fichier s'exécute côté client (navigateur)
// C'est nécessaire pour utiliser les hooks React (useState, useEffect, etc.)
"use client";

import * as React from "react";

/**
 *  Définition du type ToastItem
 * Un "toast" est une petite notification temporaire affichée à l’écran.
 * Chaque toast a :
 * - un id unique
 * - un titre (optionnel)
 * - une description (optionnelle)
 * - un état "open" (affiché ou non)
 */
interface ToastItem {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
}

/**
 *  listeners : une liste de fonctions abonnées aux changements d’état
 * Chaque fois que la liste des toasts change, ces fonctions sont appelées
 */
let listeners: Array<(toasts: ToastItem[]) => void> = [];

/**
 *  memoryState : la "mémoire" des toasts actuellement actifs
 * Ce tableau contient tous les toasts affichés
 */
let memoryState: ToastItem[] = [];

/**
 * Fonction dispatch()
 * Met à jour la liste des toasts et notifie tous les "listeners"
 */
function dispatch(toasts: ToastItem[]) {
  memoryState = toasts; // met à jour la mémoire interne
  // appelle chaque listener (par ex. les composants qui utilisent useToast)
  listeners.forEach((listener) => listener(memoryState));
}

/**
 *  Fonction genId()
 * Génère un identifiant aléatoire unique pour chaque toast
 */
function genId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 *  Fonction toast()
 * Crée un nouveau toast et l’ajoute à la liste
 */
function toast({ title, description }: Omit<ToastItem, "id" | "open">) {
  const id = genId(); // on génère un id unique
  const newToast: ToastItem = { id, title, description, open: true }; // création du toast
  dispatch([newToast, ...memoryState]); // on l’ajoute au début du tableau

  // Fonction pour supprimer ce toast spécifique
  const dismiss = () => {
    dispatch(memoryState.filter((t) => t.id !== id));
  };

  // Retourne l’id et la fonction pour le fermer
  return { id, dismiss };
}

/**
 *  Hook personnalisé : useToast()
 * Ce hook permet à un composant React d’afficher, suivre et fermer des toasts
 */
function useToast() {
  // État local du composant : liste des toasts actuels
  const [toasts, setToasts] = React.useState<ToastItem[]>(memoryState);

  // Quand le composant est monté, on l’ajoute à la liste des "listeners"
  React.useEffect(() => {
    listeners.push(setToasts); // on s'abonne aux changements
    return () => {
      // quand le composant se démonte, on se désabonne proprement
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  // On retourne les outils nécessaires pour gérer les toasts dans un composant
  return {
    toasts, // la liste actuelle des toasts visibles
    toast,  // fonction pour créer un nouveau toast
    dismiss: (id?: string) => {
      // permet de fermer un toast spécifique ou tous d’un coup
      if (id) {
        dispatch(memoryState.filter((t) => t.id !== id));
      } else {
        dispatch([]); // supprime tous les toasts
      }
    },
  };
}

//  On exporte le hook et la fonction toast pour les utiliser ailleurs
export { useToast, toast };
