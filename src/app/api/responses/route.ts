// app/api/responses/route.ts
import { NextResponse } from 'next/server';
import { SessionService } from '@/app/services/session/sessionService';
import { SessionValidation } from '@/app/lib/SchemaValidation';

/**
 * POST /api/responses
 * Endpoint pour sauvegarder les réponses du questionnaire
 * 
 * NOUVEAU : Calcul automatique du score côté serveur
 * 
 * Bonnes pratiques implémentées :
 * ✅ Séparation logique métier (SessionService)
 * ✅ Validation des données client  
 * ✅ Gestion d'erreurs structurée
 * ✅ Logs d'erreurs serveur
 * ✅ Calcul automatique des scores
 */
export async function POST(request: Request) {
  try {
    console.log("📥 Requête POST reçue pour sauvegarder les réponses");
    
    // 1. Récupération et validation des données
    const body = await request.json();
    console.log("📦 Données reçues:", {
      sessionId: body.sessionId,
      progress: body.progress,
      nombreReponses: Object.keys(body.responses || {}).length
    });
    
    // 2. VALIDATION : Ne jamais faire confiance aux données client
    const validation = SessionValidation.validateSessionData(body);
    if (!validation.isValid) {
      console.warn("❌ Données invalides:", validation.errors);
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validation.errors 
        },
        { status: 400 } // 400 Bad Request
      );
    }

    // 3. Appel du service métier (calcul automatique du score intégré)
    const sessionService = new SessionService();
    const result = await sessionService.saveSession(body);

    console.log("✅ Session sauvegardée avec succès:", {
      sessionId: result.sessionId,
      scoreCalculé: result.calculatedScore,
      créée: result.created
    });

    // 4. Réponse de succès avec score calculé
    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      calculatedScore: result.calculatedScore, // ⚠️ NOUVEAU : Score calculé
      created: result.created,
      message: result.created ? 
        'Questionnaire complété et score calculé avec succès' : 
        'Progression sauvegardée et score mis à jour'
    }, { 
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
 * NOUVEAU : Retourne les scores calculés automatiquement
 * 
 * Bonnes pratiques implémentées :
 * ✅ Gestion des paramètres d'URL
 * ✅ Réponses HTTP appropriées (200, 404, 500) 
 * ✅ Logs d'erreurs serveur
 * ✅ Sécurité : ne pas exposer les erreurs techniques en production
 */
export async function GET(request: Request) {
  try {
    // 1. EXTRACTION DES PARAMÈTRES D'URL
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    console.log("🔍 Requête GET pour:", sessionId ? `session ${sessionId}` : 'toutes les sessions');

    // 2. INITIALISATION DU SERVICE MÉTIER
    const sessionService = new SessionService();

    // 3. LOGIQUE DE ROUTAGE SELON LES PARAMÈTRES
    if (sessionId) {
      // 🔍 MODE "SESSION SPÉCIFIQUE" - Récupération d'une session par son ID
      console.log("🔍 Recherche session spécifique:", sessionId);
      
      const session = await sessionService.getSessionById(sessionId);
      
      // 4. GESTION DU CAS "NON TROUVÉ"
      if (!session) {
        console.warn("❌ Session non trouvée:", sessionId);
        return NextResponse.json(
          { error: 'Session non trouvée' },
          { status: 404 } // 404 Not Found
        );
      }

      // 5. RÉPONSE DE SUCCÈS - Session trouvée avec score
      console.log("✅ Session trouvée - Score:", session.totalScore);
      return NextResponse.json({ 
        session,
        message: 'Session récupérée avec succès'
      });

    } else {
      // 📋 MODE "TOUTES LES SESSIONS" - Récupération de l'historique complet
      console.log("📋 Récupération de toutes les sessions");
      const sessions = await sessionService.getAllSessions();
      
      console.log(`✅ ${sessions.length} sessions récupérées`);
      
      // Retourne toujours un tableau, même vide
      return NextResponse.json({ 
        sessions,
        count: sessions.length,
        message: sessions.length > 0 ? 
          `${sessions.length} sessions récupérées` : 
          'Aucune session trouvée'
      });
    }

  } catch (error) {
    // 6. GESTION D'ERREURS GLOBALES
    console.error('❌ Erreur récupération sessions:', error);
    
    // 7. RÉPONSE D'ERREUR STANDARDISÉE
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération',
        // En développement, on inclut plus de détails pour le debug
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        })
        // En production, on ne expose pas les détails techniques pour la sécurité
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

/**
 * PUT /api/responses
 * Endpoint pour mettre à jour le score d'une session existante
 * 
 * UTILE pour : recalculer les scores si la logique de calcul change
 */
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Paramètre sessionId manquant' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { newScore } = body;

    if (typeof newScore !== 'number') {
      return NextResponse.json(
        { error: 'Le nouveau score doit être un nombre' },
        { status: 400 }
      );
    }

    const sessionService = new SessionService();
    const result = await sessionService.updateSessionScore(sessionId, newScore);

    return NextResponse.json({
      success: true,
      sessionId,
      newScore,
      modified: result.modified,
      message: 'Score mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour score:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la mise à jour du score',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        })
      },
      { status: 500 }
    );
  }
}