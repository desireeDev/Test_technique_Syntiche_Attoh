//  Importation des fonctionnalités nécessaires de React
import * as React from "react";

//  Définition du seuil (breakpoint) pour la détection mobile
// Si la largeur de l’écran est inférieure à 768px, on considère que c’est un appareil mobile
const MOBILE_BREAKPOINT = 768;

/**
 *  Hook personnalisé : useIsMobile
 * Ce hook permet de détecter si l’utilisateur utilise un appareil mobile
 * en fonction de la taille de la fenêtre du navigateur.
 */
export function useIsMobile() {
  // État local qui indique si l’écran est mobile ou non
  // Valeur initiale : undefined (on ne sait pas encore)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  //  Effet qui s’exécute une seule fois après le montage du composant
  React.useEffect(() => {
    // Création d’un MediaQueryList : écoute les changements de largeur d’écran
    // Ici, "(max-width: 767px)" correspond à tout écran plus petit que 768px
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Fonction exécutée à chaque fois que la taille de la fenêtre change
    const onChange = () => {
      // Met à jour l’état selon la taille actuelle de la fenêtre
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Ajout d’un écouteur : dès que la taille d’écran change, on appelle onChange()
    mql.addEventListener("change", onChange);

    // Appel initial pour définir la bonne valeur dès le premier rendu
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    //  Nettoyage de l’écouteur lors du démontage du composant
    // (bonnes pratiques pour éviter les fuites de mémoire)
    return () => mql.removeEventListener("change", onChange);
  }, []); // [] => cet effet s’exécute une seule fois au montage

  //  Retourne un booléen strict (true ou false)
  // Même si isMobile est undefined au début, !!isMobile convertit la valeur
  return !!isMobile;
}
