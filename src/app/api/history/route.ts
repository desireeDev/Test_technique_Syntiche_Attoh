// app/api/history/route.ts
import { NextResponse } from 'next/server';
import { HistoryService } from '@/app/services/history/historyService';

/**
 * GET /api/history
 * Endpoint pour récupérer l'historique des questionnaires complétés
 * 
 * Bonnes pratiques implémentées :
 * Séparation logique métier (HistoryService)
 * Pagination et filtrage
 * Gestion d'erreurs structurée
 */
export async function GET(request: Request) {
  try {
    // 1. Récupération des paramètres de requête
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // 2. Appel du service métier
    const historyService = new HistoryService();
    const result = await historyService.getHistory({
      userId: userId || undefined,
      limit,
      page
    });

    // 3. Réponse de succès
    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    // 4. GESTION D'ERREURS
    console.error('❌ Erreur récupération historique:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération de l\'historique',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        })
      },
      { status: 500 }
    );
  }
}