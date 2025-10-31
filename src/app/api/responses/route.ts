// app/api/responses/route.ts
import { NextResponse } from 'next/server';
import { SessionService } from '@/app/services/session/sessionService';
import { SessionValidation } from '@/app/lib/SchemaValidation';

/**
 * POST /api/responses
 * Endpoint pour sauvegarder les réponses du questionnaire
 * 
 * Bonnes pratiques implémentées :
 *  Séparation logique métier (SessionService)
 * Validation des données client
 * Gestion d'erreurs structurée
 *  Logs d'erreurs serveur
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



/**
 * GET /api/responses
 * Endpoint pour récupérer les sessions questionnaire
 * 
 * Deux modes de fonctionnement :
 * - Sans paramètre : retourne toutes les sessions (pour l'historique)
 * - Avec sessionId : retourne une session spécifique (pour les détails)
 * 
 * Bonnes pratiques implémentées :
 *  Gestion des paramètres d'URL
 *  Réponses HTTP appropriées (200, 404, 500)
 *  Logs d'erreurs serveur
 * Sécurité : ne pas exposer les erreurs techniques en production
 */
export async function GET(request: Request) {
  try {
    // 1. EXTRACTION DES PARAMÈTRES D'URL
    // Récupère l'URL de la requête et ses paramètres de recherche
    const { searchParams } = new URL(request.url);
    // Récupère le paramètre sessionId s'il existe
    const sessionId = searchParams.get('sessionId');

    // 2. INITIALISATION DU SERVICE MÉTIER
    const sessionService = new SessionService();

    // 3. LOGIQUE DE ROUTAGE SELON LES PARAMÈTRES
    if (sessionId) {
      // 🔍 MODE "SESSION SPÉCIFIQUE" - Récupération d'une session par son ID
      console.log("🔍 Recherche session:", sessionId);
      
      // Appel du service pour récupérer la session
      const session = await sessionService.getSessionById(sessionId);
      
      // 4. GESTION DU CAS "NON TROUVÉ"
      if (!session) {
        return NextResponse.json(
          { error: 'Session non trouvée' },
          { status: 404 } // 404 Not Found
        );
      }

      // 5. RÉPONSE DE SUCCÈS - Session trouvée
      return NextResponse.json({ session });

    } else {
      //  MODE "TOUTES LES SESSIONS" - Récupération de l'historique complet
      const sessions = await sessionService.getAllSessions();
      
      // Retourne toujours un tableau, même vide
      return NextResponse.json({ sessions });
    }

  } catch (error) {
    // 6. GESTION D'ERREURS GLOBALES
    console.error('❌ Erreur récupération sessions:', error);
    
    // 7. RÉPONSE D'ERREUR STANDARDISÉE
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération',
        
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        })
        // En production, on ne expose pas les détails techniques pour la sécurité
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
