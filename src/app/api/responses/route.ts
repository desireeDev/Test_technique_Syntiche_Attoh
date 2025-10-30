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

    // Ici tu pourrais continuer pour sauvegarder dans MongoDB ou faire d'autres traitements
  } catch (error) {
    // Si une erreur serveur survient
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 } // 500 = Internal Server Error
    );
  }
}
