// app/lib/services/questionService.ts
import clientPromise from '@/app/(backend)/lib/mongodb';

/**
 * SERVICE : Logique métier pour la gestion des questions
 */
export class QuestionService {
  
  /**
   * Récupère le questionnaire actif
   * @returns Questionnaire avec ses questions
   */
  async getActiveQuestionnaire() {
    const client = await clientPromise;
    const db = client.db('questionnaire_db');
    
    const questionnaire = await db.collection('questions')
      .findOne({ isActive: true });

    if (!questionnaire) {
      throw new Error('Aucun questionnaire actif trouvé');
    }

    return questionnaire;
  }
}