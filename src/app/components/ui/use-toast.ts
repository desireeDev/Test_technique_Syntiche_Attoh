// Import du hook personnalisé `useToast` et de la fonction `toast`
// depuis le fichier local "@/hooks/use-toast"
import { useToast, toast } from "@/app/hooks/use-toast";

// Réexport de `useToast` et `toast`
// Cela permet de les importer depuis ce fichier plutôt que de devoir utiliser le chemin complet
// Exemple :
// import { useToast, toast } from "@/components/ui/toast" au lieu de "@/hooks/use-toast"
export { useToast, toast };
