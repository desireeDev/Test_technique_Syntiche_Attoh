// app/api/responses/route.ts
import { NextResponse } from 'next/server';
import { sessionService } from '@/app/(backend)/services/session/sessionService'; // ⚠️ SINGLETON
import { SessionValidation } from '@/app/(backend)/lib/SchemaValidation';

/**
 * POST /api/responses
 * Endpoint pour sauvegarder les réponses du questionnaire
 */
export async function POST(request: Request) {
  try {
    console.log(" Requête POST reçue pour sauvegarder les réponses");
    
    // 1. Récupération et validation des données
    const body = await request.json();
    console.log(" Données reçues:", {
      sessionId: body.sessionId,
      progress: body.progress,
      nombreReponses: Object.keys(body.responses || {}).length
    });
    
    // 2. Validation des données client
    const validation = SessionValidation.validateSessionData(body);
    if (!validation.isValid) {
      console.warn("❌ Données invalides:", validation.errors);
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // 3. Sauvegarde avec le singleton
    const result = await sessionService.saveSession(body);

    console.log(" Session sauvegardée avec succès:", {
      sessionId: result.sessionId,
      scoreCalculé: result.calculatedScore,
      créée: result.created
    });

    // 4. Réponse de succès
    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      calculatedScore: result.calculatedScore,
      created: result.created,
      message: result.created ? 
        'Questionnaire complété et score calculé avec succès' : 
        'Progression sauvegardée et score mis à jour'
    }, { 
      status: result.created ? 201 : 200 
    });

  } catch (error) {
    console.error('❌ Erreur sauvegarde session:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la sauvegarde',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        })
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/responses
 * Endpoint pour récupérer les sessions questionnaire
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    console.log("Requête GET pour:", sessionId ? `session ${sessionId}` : 'toutes les sessions');

    if (sessionId) {
      // 🔍 MODE "SESSION SPÉCIFIQUE"
      console.log(" Recherche session spécifique:", sessionId);
      
      const session = await sessionService.getSessionById(sessionId);
      
      if (!session) {
        console.warn(" Session non trouvée:", sessionId);
        return NextResponse.json(
          { error: 'Session non trouvée' },
          { status: 404 }
        );
      }

      console.log(" Session trouvée - Score:", session.totalScore);
      return NextResponse.json({ 
        session,
        message: 'Session récupérée avec succès'
      });

    } else {
      // 📋 MODE "TOUTES LES SESSIONS"
      console.log(" Récupération de toutes les sessions");
      const sessions = await sessionService.getAllSessions();
      
      console.log(` ${sessions.length} sessions récupérées`);
      
      return NextResponse.json({ 
        sessions,
        count: sessions.length,
        message: sessions.length > 0 ? 
          `${sessions.length} sessions récupérées` : 
          'Aucune session trouvée'
      });
    }

  } catch (error) {
    console.error(' Erreur récupération sessions:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Erreur inconnue'
        })
      },
      { status: 500 }
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

    const result = await sessionService.updateSessionScore(sessionId, newScore);

    return NextResponse.json({
      success: true,
      sessionId,
      newScore,
      modified: result.modified,
      message: 'Score mis à jour avec succès'
    });

  } catch (error) {
    console.error(' Erreur mise à jour score:', error);
    
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