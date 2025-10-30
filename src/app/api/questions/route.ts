// On importe NextResponse pour pouvoir renvoyer des réponses HTTP depuis une route Next.js
import { NextResponse } from 'next/server';
// On importe la promesse de connexion à MongoDB depuis notre fichier lib/mongodb
import clientPromise from '@/app/lib/mongodb';

// Fonction qui gère les requêtes HTTP GET vers cette API
export async function GET() {
  try {
    // On attend que la connexion à MongoDB soit établie
    const client = await clientPromise;

    // On choisit la base de données "questionnaire_db"
    const db = client.db('questionnaire_db');
    
    // On cherche un questionnaire actif dans la collection "questions"
    const questionnaire = await db
      .collection('questions')
      .findOne({ isActive: true }); // Trouve le premier document avec isActive = true
    
    // Si aucun questionnaire actif n'est trouvé
    if (!questionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire non trouvé' }, // Message d'erreur
        { status: 404 } // Code HTTP 404 = Not Found
      );
    }
    
    // Si un questionnaire est trouvé, on le renvoie sous forme JSON
    return NextResponse.json(questionnaire);
  } catch (error) {
    // Si une erreur survient lors de la connexion ou de la requête
    return NextResponse.json(
      { error: 'Erreur serveur' }, // Message générique
      { status: 500 } // Code HTTP 500 = Internal Server Error
    );
  }
}
