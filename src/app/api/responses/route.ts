// On importe NextResponse pour pouvoir renvoyer des réponses HTTP depuis cette API
import { NextResponse } from 'next/server';
// On importe la connexion à MongoDB
import clientPromise from '@/app/lib/mongodb';

/**
 * Fonction pour valider les données envoyées dans la requête POST
 * @param body - objet contenant les données de la session
 * @returns un objet avec valid = true si tout est correct, sinon false avec la liste des erreurs
 */
function validateSessionData(body: any) {
  const errors: string[] = []; // Tableau pour stocker les erreurs

  // Vérifie que sessionId existe et est une chaîne de caractères
  if (!body.sessionId || typeof body.sessionId !== 'string') {
    errors.push('sessionId est requis et doit être une string');
  }

  // Vérifie que responses existe et est un objet
  if (!body.responses || typeof body.responses !== 'object') {
    errors.push('responses est requis et doit être un objet');
  }

  // Vérifie que progress existe et est un objet
  if (!body.progress || typeof body.progress !== 'object') {
    errors.push('progress est requis');
  }

  // Si des erreurs ont été détectées, on retourne valid = false
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sinon, tout est correct
  return { valid: true, errors: [] };
}

/**
 * Fonction qui gère les requêtes POST pour sauvegarder une session
 * @param request - la requête HTTP envoyée par le client
 */
export async function POST(request: Request) {
  try {
    // 1. On récupère et parse le body de la requête JSON
    const body = await request.json();

    // 2. On valide les données reçues avec notre fonction validateSessionData
    const validation = validateSessionData(body);

    // Si les données sont invalides, on renvoie un message d'erreur 400
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 } // 400 = Bad Request
      );
    }

    // 3. On récupère les valeurs du body (après validation)
    const { sessionId, responses, progress, totalScore } = body;

    // 4. Connexion à MongoDB
    const client = await clientPromise;
    const db = client.db(); // Utilise la base de données par défaut

    // 5. Préparer les données pour l'insertion
    const sessionData = {
      sessionId,
      responses,
      progress,
      totalScore: totalScore || 0, // Valeur par défaut si non fournie
      completedAt: new Date(),
      createdAt: new Date(),
    };

    // 6. Insérer dans la collection "sessions" (ou le nom que tu veux)
    const result = await db.collection('sessions').insertOne(sessionData);

    // 7. Retourner une réponse de succès
    return NextResponse.json(
      { 
        success: true, 
        message: 'Session sauvegardée avec succès',
        sessionId: sessionId,
        insertedId: result.insertedId 
      },
      { status: 201 } // 201 = Created
    );

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    
    // Si une erreur serveur survient
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la sauvegarde',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}

/**
 * Fonction pour gérer les requêtes GET (optionnel - pour récupérer les sessions)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    const client = await clientPromise;
    const db = client.db();

    if (sessionId) {
      // Récupérer une session spécifique
      const session = await db.collection('sessions').findOne({ sessionId });
      
      if (!session) {
        return NextResponse.json(
          { error: 'Session non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json({ session });
    } else {
      // Récupérer toutes les sessions (optionnel)
      const sessions = await db.collection('sessions')
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      return NextResponse.json({ sessions });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération' },
      { status: 500 }
    );
  }
}