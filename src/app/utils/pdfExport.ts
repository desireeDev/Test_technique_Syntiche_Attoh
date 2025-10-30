import jsPDF from "jspdf";
import { QuestionnaireResponse } from "@/types/questionnaire";

export const exportToPDF = (responses: QuestionnaireResponse): void => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("Developer Profile Results", 20, 20);
  
  doc.setFontSize(12);
  let yPosition = 40;
  
  Object.entries(responses).forEach(([key, value]) => {
    const displayValue = Array.isArray(value) ? value.join(", ") : value;
    doc.text(`${key}: ${displayValue}`, 20, yPosition);
    yPosition += 10;
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  doc.save(`developer-profile-${new Date().toISOString().split("T")[0]}.pdf`);
};
