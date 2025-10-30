// app/api/history/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const client = await clientPromise;
    const db = client.db('questionnaire_db');

    // Construire la requête de filtrage
    const query: any = { isCompleted: true }; // Seulement les sessions complétées
    
    if (userId) {
      query.userId = userId;
    }

    // Récupérer l'historique avec pagination
    const history = await db.collection('sessions')
      .find(query)
      .sort({ completedAt: -1 }) // Plus récent en premier
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Compter le total pour la pagination
    const total = await db.collection('sessions').countDocuments(query);

    // Formater les données pour la réponse
    const formattedHistory = history.map(session => ({
      id: session._id?.toString(),
      sessionId: session.sessionId,
      userId: session.userId,
      questionnaireId: session.questionnaireId,
      responses: session.responses,
      progress: session.progress,
      totalScore: session.totalScore,
      isCompleted: session.isCompleted,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }));

    return NextResponse.json({
      success: true,
      history: formattedHistory,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération historique:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de la récupération de l\'historique',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}