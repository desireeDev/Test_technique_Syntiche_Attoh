// app/api/responses/route.ts
import { NextResponse } from 'next/server';
import { SessionService } from '@/app/services/session/sessionService';
import { SessionValidation } from '@/app/lib/SchemaValidation';

/**
 * POST /api/responses
 * Endpoint pour sauvegarder les réponses du questionnaire
 * 
 * Bonnes pratiques implémentées :
 * ✅ Séparation logique métier (SessionService)
 * ✅ Validation des données client
 * ✅ Gestion d'erreurs structurée
 * ✅ Logs d'erreurs serveur
 */
export async function POST(request: Request) {
  try {
    // 1. Récupération et validation des données
    const body = await request.json();
    
    // 2. VALIDATION : Ne jamais faire confiance aux données client
    const validation = SessionValidation.validateSessionData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validation.errors 
        },
        { status: 400 } // 400 Bad Request
      );
    }

    // 3. Appel du service métier
    const sessionService = new SessionService();
    const result = await sessionService.saveSession(body);

    // 4. Réponse de succès
    return NextResponse.json(result, { 
      status: result.created ? 201 : 200 
    });

  } catch (error) {
    // 5. GESTION D'ERREURS : Logs serveur + réponse appropriée
    console.error('❌ Erreur sauvegarde session:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la sauvegarde',
        // Ne pas exposer les détails techniques en production
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        })
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}