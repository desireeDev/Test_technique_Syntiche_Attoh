// app/lib/services/sessionService.ts
import clientPromise from '@/app/lib/mongodb';

/**
 * SERVICE : Logique métier pour la gestion des sessions questionnaire
 * Séparation claire entre logique métier et routes API
 */
export class SessionService {
  
  /**
   * Sauvegarde ou met à jour une session questionnaire
   * @param sessionData - Données de la session à sauvegarder
   * @returns Résultat de l'opération MongoDB
   */
  async saveSession(sessionData: {
    sessionId: string;
    responses: Record<string, any>;
    progress: any;
    totalScore?: number;
    userId?: string;
  }) {
    const client = await clientPromise;
    const db = client.db('questionnaire_db');
    
    const { sessionId, responses, progress, totalScore, userId } = sessionData;

    const result = await db.collection('sessions').updateOne(
      { sessionId },
      {
        $set: {
          responses,
          progress,
          totalScore: totalScore || 0,
          userId: userId || null,
          updatedAt: new Date(),
          // Marquer comme complété si dernière étape atteinte
          ...(progress.currentStep === progress.totalSteps && {
            isCompleted: true,
            completedAt: new Date()
          })
        },
        $setOnInsert: {
          createdAt: new Date(),
          startedAt: new Date(),
          questionnaireId: 'dev-profile-2024'
        }
      },
      { upsert: true }
    );

    return {
      success: true,
      sessionId,
      created: result.upsertedCount > 0,
      modified: result.modifiedCount > 0
    };
  }
}