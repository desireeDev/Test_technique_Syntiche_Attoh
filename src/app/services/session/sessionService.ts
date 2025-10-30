// app/lib/services/sessionService.ts
import clientPromise from '@/app/lib/mongodb';
import { calculateTotalScore } from '@/app/utils/scoreCalculator';

/**
 * SERVICE : Logique métier pour la gestion des sessions questionnaire
 * 
 * Ce service encapsule toute la logique d'interaction avec la base de données MongoDB
 * pour les opérations CRUD sur les sessions de questionnaire.
 * 
 * Principes SOLID appliqués :
 * - Single Responsibility : Gère uniquement les opérations sessions
 * - Separation of Concerns : Sépare logique métier et couche données
 */
export class SessionService {
  
  /**
   * Sauvegarde ou met à jour une session questionnaire dans MongoDB
   * 
   * Utilise une opération "upsert" (update + insert) pour :
   * - Mettre à jour si la session existe déjà
   * - Créer si la session n'existe pas
   * 
   * NOUVEAU : Calcul automatique du score total si non fourni
   * 
   * @param sessionData - Les données de la session à sauvegarder
   * @param sessionData.sessionId - Identifiant unique de la session
   * @param sessionData.responses - Réponses aux questions (objet clé-valeur)
   * @param sessionData.progress - État d'avancement du questionnaire
   * @param sessionData.totalScore - Score total calculé (optionnel)
   * @param sessionData.userId - Identifiant utilisateur (optionnel)
   * 
   * @returns Promise<{success: boolean, sessionId: string, created: boolean, modified: boolean, calculatedScore: number}>
   *          Résultat de l'opération avec indicateurs de création/modification et score calculé
   */
  async saveSession(sessionData: {
    sessionId: string;
    responses: Record<string, any>;
    progress: any;
    totalScore?: number;
    userId?: string;
  }) {
    // Connexion à la base de données MongoDB
    const client = await clientPromise;
    const db = client.db('questionnaire_db');
    
    // Destructuration des données pour plus de clarté
    const { sessionId, responses, progress, totalScore, userId } = sessionData;

    // ====================================================================
    // 🎯 CALCUL AUTOMATIQUE DU SCORE SI NON FOURNI
    // ====================================================================
    const calculatedScore = totalScore !== undefined ? totalScore : calculateTotalScore(responses);
    
    console.log(" Score calculé:", {
      scoreFourni: totalScore,
      scoreCalcule: calculatedScore,
      reponses: Object.keys(responses).length
    });

    // Opération MongoDB : updateOne avec upsert=true
    const result = await db.collection('sessions').updateOne(
      // FILTRE : Recherche par sessionId
      { sessionId },
      {
        // OPERATEUR $set : Met à jour les champs existants
        $set: {
          responses,           // Réponses aux questions
          progress,            // Progression (étape actuelle, total)
          totalScore: calculatedScore, // ⚠️ UTILISE LE SCORE CALCULÉ
          userId: userId || null,      // ID utilisateur (null si anonyme)
          updatedAt: new Date(),       // Horodatage de mise à jour
          
          // Si c'est la dernière étape, marquer comme complété
          ...(progress.currentStep === progress.totalSteps && {
            isCompleted: true,         // Flag de complétion
            completedAt: new Date()    // Date de fin
          })
        },
        // OPERATEUR $setOnInsert : Définit les valeurs uniquement à l'insertion
        $setOnInsert: {
          createdAt: new Date(),       // Date de création
          startedAt: new Date(),       // Date de début
          questionnaireId: 'dev-profile-2024' // Identifiant du questionnaire
        }
      },
      // OPTION upsert : Crée le document s'il n'existe pas
      { upsert: true }
    );

    // Retourne un objet de résultat clair
    return {
      success: true,                    // Opération réussie
      sessionId,                       // ID de la session traitée
      created: result.upsertedCount > 0, // True si nouvelle création
      modified: result.modifiedCount > 0, // True si mise à jour
      calculatedScore: calculatedScore  // ⚠️ AJOUT : Score calculé retourné
    };
  }

  /**
   * Récupère une session spécifique par son identifiant unique
   * 
   * Utilisé pour afficher les détails d'une session particulière
   * sur la page de résultats détaillés.
   * 
   * @param sessionId - L'identifiant unique de la session à récupérer
   * @returns Promise<Session | null> - La session trouvée ou null si non trouvée
   */
  async getSessionById(sessionId: string) {
    try {
      // Connexion à la base de données
      const client = await clientPromise;
      const db = client.db('questionnaire_db');
      
      // Recherche de la session avec projection pour sélectionner les champs
      const session = await db.collection('sessions').findOne(
        // FILTRE : Par sessionId exact
        { sessionId },
        {
          // PROJECTION : Sélectionne uniquement les champs nécessaires
          projection: {
            _id: 0,           // Exclut l'ID interne MongoDB (sécurité)
            sessionId: 1,     // Inclut l'ID métier
            responses: 1,     // Réponses aux questions
            progress: 1,      // État de progression
            totalScore: 1,    // Score total
            completedAt: 1,   // Date de complétion
            createdAt: 1,     // Date de création
            isCompleted: 1    // Flag de complétion
          }
        }
      );

      return session;
    } catch (error) {
      // Log détaillé en cas d'erreur (console serveur)
      console.error('❌ Erreur récupération session:', error);
      // Propagation de l'erreur pour gestion au niveau supérieur
      throw error;
    }
  }

  /**
   * Récupère toutes les sessions complétées pour l'historique
   * 
   * Retourne les sessions triées par date de complétion décroissante
   * (les plus récentes en premier). Seules les sessions marquées
   * comme "complétées" sont retournées.
   * 
   * @returns Promise<Array<Session>> - Tableau des sessions complétées
   */
  async getAllSessions() {
    try {
      const client = await clientPromise;
      const db = client.db('questionnaire_db');
      
      // Requête MongoDB avec filtre, projection et tri
      const sessions = await db.collection('sessions')
        .find(
          // FILTRE : Uniquement les sessions complétées
          { isCompleted: true },
          {
            // PROJECTION : Champs à inclure dans le résultat
            projection: {
              _id: 0,           // Exclut l'ID MongoDB
              sessionId: 1,     // ID de session
              responses: 1,     // Réponses
              totalScore: 1,    // Score
              completedAt: 1,   // Date fin
              createdAt: 1      // Date création
            }
          }
        )
        // TRI : Par date de complétion décroissante (récent → ancien)
        .sort({ completedAt: -1 })
        // CONVERSION : Curseur MongoDB → Tableau JavaScript
        .toArray();

      return sessions;
    } catch (error) {
      console.error('❌ Erreur récupération sessions:', error);
      throw error;
    }
  }

  /**
   * Récupère les sessions d'un utilisateur spécifique
   * 
   * Version filtrée de getAllSessions() pour un utilisateur donné.
   * Utile pour un système d'authentification multi-utilisateurs.
   * 
   * @param userId - Identifiant de l'utilisateur
   * @returns Promise<Array<Session>> - Sessions de l'utilisateur
   */
  async getUserSessions(userId: string) {
    try {
      const client = await clientPromise;
      const db = client.db('questionnaire_db');
      
      const sessions = await db.collection('sessions')
        .find(
          // FILTRE COMBINÉ : Utilisateur + sessions complétées
          { userId, isCompleted: true },
          {
            projection: {
              _id: 0,
              sessionId: 1,
              responses: 1,
              totalScore: 1,
              completedAt: 1
            }
          }
        )
        .sort({ completedAt: -1 })
        .toArray();

      return sessions;
    } catch (error) {
      console.error('❌ Erreur récupération sessions utilisateur:', error);
      throw error;
    }
  }

  /**
   * Met à jour uniquement le score d'une session existante
   * 
   * Utile pour recalculer les scores si la logique de calcul change
   * 
   * @param sessionId - Identifiant de la session
   * @param newScore - Nouveau score à appliquer
   * @returns Promise<{success: boolean, modified: boolean}>
   */
  async updateSessionScore(sessionId: string, newScore: number) {
    try {
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

      return {
        success: true,
        modified: result.modifiedCount > 0
      };
    } catch (error) {
      console.error('❌ Erreur mise à jour score:', error);
      throw error;
    }
  }

  /**
   * Supprime une session spécifique
   * 
   * @param sessionId - Identifiant de la session à supprimer
   * @returns Promise<{success: boolean, deleted: boolean}>
   */
  async deleteSession(sessionId: string) {
    try {
      const client = await clientPromise;
      const db = client.db('questionnaire_db');
      
      const result = await db.collection('sessions').deleteOne({ sessionId });

      return {
        success: true,
        deleted: result.deletedCount > 0
      };
    } catch (error) {
      console.error('❌ Erreur suppression session:', error);
      throw error;
    }
  }
}