// Importation de la bibliothèque jsPDF pour générer un fichier PDF
import jsPDF from "jspdf";

// Importation du type QuestionnaireResponse (structure des réponses)
import { QuestionnaireResponse } from "@/app/types/questionnaire";

// Fonction exportée qui génère et télécharge un PDF à partir des réponses d'un questionnaire
export const exportToPDF = (responses: QuestionnaireResponse): void => {
  // Création d'une nouvelle instance de document PDF
  const doc = new jsPDF();

  // Définition de la taille de police pour le titre
  doc.setFontSize(20);
  // Ajout du titre principal du document à la position (x=20, y=20)
  doc.text("Developer Profile Results", 20, 20);

  // Réduction de la taille de police pour le contenu
  doc.setFontSize(12);
  // Position verticale initiale pour le texte des réponses
  let yPosition = 40;

  // Parcours de chaque clé et valeur de l’objet "responses"
  Object.entries(responses).forEach(([key, value]) => {
    // Si la valeur est un tableau, on la convertit en chaîne de texte séparée par des virgules
    const displayValue = Array.isArray(value) ? value.join(", ") : value;

    // Écriture de la paire clé/valeur dans le document
    doc.text(`${key}: ${displayValue}`, 20, yPosition);

    // Déplacement vertical pour la prochaine ligne
    yPosition += 10;

    // Vérifie si on dépasse la limite verticale d'une page
    if (yPosition > 270) {
      // Ajout d'une nouvelle page si nécessaire
      doc.addPage();
      // Réinitialisation de la position verticale
      yPosition = 20;
    }
  });

  // Génération et téléchargement du fichier PDF
  // Le nom inclut la date du jour, ex: "developer-profile-2025-10-30.pdf"
  doc.save(`developer-profile-${new Date().toISOString().split("T")[0]}.pdf`);
};
