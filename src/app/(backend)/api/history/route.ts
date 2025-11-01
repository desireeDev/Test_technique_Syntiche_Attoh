// app/api/history/route.ts - VERSION ULTRA SIMPLE
import { NextResponse } from 'next/server';
import clientPromise from '@/app/(backend)/lib/mongodb';

export async function GET() {
  try {
    console.log(" Requête historique directe MongoDB");

    const client = await clientPromise;
    const db = client.db('questionnaire_db');

    // Récupération directe
    const sessions = await db.collection('sessions')
      .find({ 
        isCompleted: true,
        totalScore: { $exists: true } 
      })
      .sort({ completedAt: -1 })
      .limit(50)
      .toArray();

    // Formatage simple
    const history = sessions.map(session => ({
      id: session._id?.toString(),
      sessionId: session.sessionId,
      responses: session.responses,
      totalScore: session.totalScore || 0, // ⚠️ FALLBACK CRITIQUE
      completedAt: session.completedAt,
      createdAt: session.createdAt
    }));


    return NextResponse.json({
      success: true,
      history: history,
      count: history.length,
      message: `${history.length} sessions récupérées`
    });

  } catch (error) {
    console.error('❌ Erreur historique MongoDB:', error);
    return NextResponse.json(
      { error: 'Erreur de chargement de l\'historique' },
      { status: 500 }
    );
  }
}