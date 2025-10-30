// app/api/responses/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

/**
 * POST /api/responses
 * 
 * Endpoint pour sauvegarder ou mettre à jour les réponses d'un questionnaire
 * 
 * Fonctionnalités :
 * - Validation des données reçues
 * - Sauvegarde en base de données (MongoDB)
 * - Gestion des sessions (création ou mise à jour)
 * - Calcul automatique du statut "complété"
 * 
 * @param request - Requête HTTP contenant les données du questionnaire
 * @returns Réponse JSON avec le résultat de l'opération
 */
export async function POST(request: Request) {
  try {
    // 1. Récupération et parsing des données de la requête
    const body = await request.json();
    
    // 2. Validation des champs obligatoires
    // Vérifie que les données essentielles sont présentes
    if (!body.sessionId || !body.responses || !body.progress) {
      return NextResponse.json(
        { error: 'sessionId, responses et progress sont requis' },
        { status: 400 } // 400 Bad Request - données manquantes
      );
    }

    // 3. Extraction des données depuis le body
    const { sessionId, responses, progress, totalScore, userId } = body;
    
    // 4. Connexion à la base de données MongoDB
    const client = await clientPromise;
    const db = client.db('questionnaire_db');
    
    // 5. Opération UPSERT (UPDATE or INSERT)
    // - Si la session existe : mise à jour
    // - Si la session n'existe pas : création
    const result = await db.collection('sessions').updateOne(
      // Filtre : recherche par sessionId
      { sessionId },
      {
        // Opérateur $set : met à jour les champs
        $set: {
          responses,           // Réponses utilisateur
          progress,            // Progression dans le questionnaire
          totalScore: totalScore || 0, // Score total (0 par défaut)
          userId: userId || null,      // ID utilisateur (null si anonyme)
          updatedAt: new Date(),       // Horodatage de mise à jour
          
          // Si c'est la dernière étape, marquer comme complété
          ...(progress.currentStep === progress.totalSteps && {
            isCompleted: true,         // Statut complété
            completedAt: new Date()    // Date de complétion
          })
        },
        // Opérateur $setOnInsert : champs définis seulement à l'insertion
        $setOnInsert: {
          createdAt: new Date(),       // Date de création
          startedAt: new Date(),       // Date de début
          questionnaireId: 'dev-profile-2024' // Identifiant du questionnaire
        }
      },
      { upsert: true } // Option UPSERT : créer si n'existe pas
    );
    
    // 6. Réponse de succès
    return NextResponse.json({ 
      success: true,
      sessionId,
      created: result.upsertedCount > 0,  // True si nouvelle session créée
      modified: result.modifiedCount > 0  // True si session mise à jour
    }, { 
      // Statut HTTP : 201 Created si nouvelle session, 200 OK si mise à jour
      status: result.upsertedCount > 0 ? 201 : 200 
    });
    
  } catch (error) {
    // 7. Gestion des erreurs
    console.error('Erreur sauvegarde:', error);
    
    // Réponse d'erreur serveur
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 } // 500 Internal Server Error
    );
  }
}