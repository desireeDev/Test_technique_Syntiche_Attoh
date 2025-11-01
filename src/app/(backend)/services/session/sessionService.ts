// app/(backend)/services/session/sessionService.ts
import clientPromise from '@/app/(backend)/lib/mongodb';
import { ScoreCalculatorService } from '@/app/(backend)/services/score/scoreCalculatorService';

// ====================================================================
// INTERFACES ESSENTIELLES
// ====================================================================

/**
 * Données nécessaires pour sauvegarder une session
 */
interface SessionData {
  sessionId: string;
  responses: Record<string, any>;
  progress: {
    currentStep: number;
    totalSteps: number;
  };
  totalScore?: number;
  userId?: string;
}

/**
 * Session complète avec toutes les informations
 */
interface Session {
  sessionId: string;
  responses: Record<string, any>;
  progress: {
    currentStep: number;
    totalSteps: number;
  };
  totalScore?: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
  isCompleted?: boolean;
  questionnaireId?: string;
}

/**
 * Résultat des opérations de sauvegarde
 */
interface OperationResult {
  success: boolean;
  sessionId: string;
  created?: boolean;
  modified?: boolean;
  calculatedScore?: number;
}

// ====================================================================
// SERVICE PRINCIPAL - GESTION DES SESSIONS
// ====================================================================

/**
 * SERVICE : Gestion des sessions questionnaire
 * 
 * Responsabilités :
 * - Sauvegarder les sessions avec calcul automatique des scores
 * - Récupérer les sessions (individuelle ou historique)
 * - Gérer la progression du questionnaire
 */
export class SessionService {
  private scoreCalculator: ScoreCalculatorService;

  constructor() {
    this.scoreCalculator = new ScoreCalculatorService();
  }
  
  // ====================================================================
  // OPÉRATIONS PRINCIPALES
  // ====================================================================

  /**
   * SAUVEGARDE une session questionnaire
   * 
   * - Crée ou met à jour selon l'existence
   * - Calcule automatiquement le score si non fourni
   * - Marque comme complété si dernière étape atteinte
   */
  async saveSession(sessionData: SessionData): Promise<OperationResult> {
    try {
      console.log("💾 Sauvegarde session:", sessionData.sessionId);
      
      // Connexion à MongoDB
      const client = await clientPromise;
      const db = client.db('questionnaire_db');
      
      const { sessionId, responses, progress, totalScore, userId } = sessionData;

      // Calcul automatique du score si non fourni
      const calculatedScore = totalScore !== undefined 
        ? totalScore 
        : this.scoreCalculator.calculateTotalScore(responses);
      
      console.log("🎯 Score calculé:", {
        sessionId,
        score: calculatedScore,
        questions: Object.keys(responses).length
      });

      // Préparation des données
      const now = new Date();
      const isCompleted = progress.currentStep === progress.totalSteps;
      
      const updateData: any = {
        $set: {
          responses,
          progress,
          totalScore: calculatedScore,
          userId: userId || null,
          updatedAt: now,
        }
      };

      // Marquage comme complété si dernière étape
      if (isCompleted) {
        updateData.$set.isCompleted = true;
        updateData.$set.completedAt = now;
      }

      // Données pour nouvelle insertion
      updateData.$setOnInsert = {
        createdAt: now,
        startedAt: now,
        questionnaireId: 'dev-profile-2024'
      };

      // Exécution MongoDB
      const result = await db.collection('sessions').updateOne(
        { sessionId },
        updateData,
        { upsert: true }
      );

      const operationResult: OperationResult = {
        success: true,
        sessionId,
        created: result.upsertedCount > 0,
        modified: result.modifiedCount > 0,
        calculatedScore
      };

      console.log("✅ Sauvegarde réussie:", {
        sessionId,
        operation: operationResult.created ? 'CRÉATION' : 'MISE À JOUR'
      });

      return operationResult;

    } catch (error) {
      console.error('❌ Erreur sauvegarde session:', error);
      throw error;
    }
  }

  /**
   * RÉCUPÈRE une session par son identifiant
   * 
   * Utilisé pour afficher les résultats détaillés d'une session
   */
  async getSessionById(sessionId: string): Promise<Session | null> {
    try {
      console.log("🔍 Recherche session:", sessionId);
      
      const client = await clientPromise;
      const db = client.db('questionnaire_db');
      
      const session = await db.collection('sessions').findOne(
        { sessionId },
        {
          projection: {
            _id: 0,                    // Exclut l'ID interne MongoDB
            sessionId: 1,              // ID de la session
            responses: 1,              // Réponses aux questions
            progress: 1,               // Progression actuelle
            totalScore: 1,             // Score calculé
            userId: 1,                 // Utilisateur (si connecté)
            createdAt: 1,              // Date de création
            updatedAt: 1,              // Date de modification
            completedAt: 1,            // Date de complétion
            isCompleted: 1,            // Est complétée
            questionnaireId: 1         // Type de questionnaire
          }
        }
      );

      if (session) {
        console.log("✅ Session trouvée:", sessionId);
      }

      return session as Session | null;

    } catch (error) {
      console.error('❌ Erreur récupération session:', error);
      throw error;
    }
  }

  /**
   * RÉCUPÈRE toutes les sessions complétées
   * 
   * Utilisé pour l'historique des questionnaires
   * Retourne les sessions triées du plus récent au plus ancien
   */
  async getAllSessions(): Promise<Session[]> {
    try {
      console.log("📚 Récupération historique sessions");
      
      const client = await clientPromise;
      const db = client.db('questionnaire_db');
      
      const sessions = await db.collection('sessions')
        .find(
          { isCompleted: true },  // Seulement les sessions terminées
          {
            projection: {
              _id: 0,
              sessionId: 1,
              responses: 1,
              totalScore: 1,
              completedAt: 1,
              createdAt: 1,
              userId: 1
            }
          }
        )
        .sort({ completedAt: -1 })  // Plus récent en premier
        .toArray();

      console.log(`✅ ${sessions.length} sessions récupérées`);

      return sessions as Session[];

    } catch (error) {
      console.error('❌ Erreur récupération sessions:', error);
      throw error;
    }
  }

  /**
   * MET À JOUR le score d'une session
   * 
   * Utilisé pour corriger manuellement un score si nécessaire
   */
  async updateSessionScore(sessionId: string, newScore: number): Promise<OperationResult> {
    try {
      console.log("🔄 Mise à jour score:", { sessionId, newScore });
      
      const client = await clientPromise;
      const db = client.db('questionnaire_db');
      
      const result = await db.collection('sessions').updateOne(
        { sessionId },
        {
          $set: {
            totalScore: newScore,
            updatedAt: new Date()
          }
        }
      );

      const operationResult: OperationResult = {
        success: true,
        sessionId,
        modified: result.modifiedCount > 0
      };

      if (operationResult.modified) {
        console.log("✅ Score mis à jour");
      }

      return operationResult;

    } catch (error) {
      console.error('❌ Erreur mise à jour score:', error);
      throw error;
    }
  }
}

// ====================================================================
// SINGLETON POUR L'APPLICATION
// ====================================================================

/**
 * Instance unique utilisée dans toute l'application
 * Optimise les performances en évitant les multiples instances
 */
export const sessionService = new SessionService();

export default sessionService;