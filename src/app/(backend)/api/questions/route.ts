// app/api/questions/route.ts
import { NextResponse } from 'next/server';
import { QuestionService } from '@/app/(backend)/services/question/questionService';

/**
 * GET /api/questions
 * Endpoint pour récupérer le questionnaire actif
 * 
 * Bonnes pratiques implémentées :
 * ✅ Séparation logique métier (QuestionService)
 * ✅ Gestion d'erreurs appropriée (404 vs 500)
 */
export async function GET() {
  try {
    // 1. Appel du service métier
    const questionService = new QuestionService();
    const questionnaire = await questionService.getActiveQuestionnaire();

    // 2. Réponse de succès
    return NextResponse.json(questionnaire);

  } catch (error) {
    // 3. GESTION D'ERREURS SPÉCIFIQUE
    console.error('Erreur récupération questions:', error);
    
    if (error instanceof Error && error.message.includes('Aucun questionnaire')) {
      // Erreur métier spécifique - 404 Not Found
      return NextResponse.json(
        { error: 'Questionnaire non trouvé' },
        { status: 404 }
      );
    }

    // Erreur serveur générique - 500 Internal Server Error
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}