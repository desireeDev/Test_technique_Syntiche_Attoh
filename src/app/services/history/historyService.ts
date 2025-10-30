// app/lib/services/historyService.ts
import clientPromise from '@/app/lib/mongodb';

/**
 * SERVICE : Logique métier pour la gestion de l'historique
 */
export class HistoryService {
  
  /**
   * Récupère l'historique des sessions complétées
   * @param options - Options de filtrage et pagination
   * @returns Historique formaté avec pagination
   */
  async getHistory(options: {
    userId?: string;
    limit?: number;
    page?: number;
  }) {
    const client = await clientPromise;
    const db = client.db('questionnaire_db');

    const { userId, limit = 20, page = 1 } = options;

    // Construction de la requête - SEULEMENT les sessions complétées
    const query: any = { isCompleted: true };
    if (userId) query.userId = userId;

    // Récupération avec pagination
    const history = await db.collection('sessions')
      .find(query)
      .sort({ completedAt: -1 }) // Plus récent en premier
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Comptage total pour la pagination
    const total = await db.collection('sessions').countDocuments(query);

    // Formatage des données pour la réponse
    const formattedHistory = history.map(session => ({
      id: session._id?.toString(),
      sessionId: session.sessionId,
      userId: session.userId,
      questionnaireId: session.questionnaireId,
      responses: session.responses,
      progress: session.progress,
      totalScore: session.totalScore,
      isCompleted: session.isCompleted,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }));

    return {
      history: formattedHistory,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}