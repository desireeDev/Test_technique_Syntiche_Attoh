// app/(backend)/services/score/scoreCalculatorService.ts

/**
 * SERVICE DE CALCUL DES SCORES 
 */

export class ScoreCalculatorService {
  
  /**
   * Calcule le score total basé sur toutes les réponses - VERSION DEBUG
   */
  calculateTotalScore(responses: Record<string, any>): number {
    console.log("DÉBUT CALCUL SCORE DEBUG ");
    console.log(" TOUTES LES RÉPONSES:", JSON.stringify(responses, null, 2));
    
    // ====================================================================
    // ANALYSE COMPLÈTE DE LA STRUCTURE DES RÉPONSES
    // ====================================================================
    console.log(" ANALYSE DÉTAILLÉE DES RÉPONSES:");
    Object.entries(responses).forEach(([questionKey, response]) => {
      console.log(`   ${questionKey}:`, {
        type: typeof response,
        valeur: response,
        aProprieteAnswer: response?.answer !== undefined,
        aProprieteValue: response?.value !== undefined,
        estTableau: Array.isArray(response),
        estString: typeof response === 'string'
      });
    });

    let totalScore = 0;
    let answeredQuestions = 0;
    const maxScorePerQuestion = 10;

    // ====================================================================
    // QUESTION 1 : Nom 
    // ====================================================================
    const q1Answer = this.extractAnswer(responses.q1);
    if (q1Answer) {
      totalScore += 2;
      answeredQuestions++;
      console.log(`Merci  d'avoir répondu très cher`);
    } else {
      console.log(` Q1 - Pas de réponse`);
    }

    // ====================================================================
    // QUESTION 2 : Expérience 
    // ====================================================================
    const q2Answer = this.extractAnswer(responses.q2);
    if (q2Answer) {
      const experienceScore = this.calculateExperienceScore(q2Answer);
      totalScore += experienceScore;
      answeredQuestions++;
      console.log(`Merci d'avoir répondu très cher`);
    } else {
      console.log(` Q2 - Pas de réponse`);
    }

    // ====================================================================
    // QUESTION 3 : Spécialisation 
    // ====================================================================
    const q3Answer = this.extractAnswer(responses.q3);
    if (q3Answer) {
      const specializationScore = this.calculateSpecializationScore(q3Answer);
      totalScore += specializationScore;
      answeredQuestions++;
      console.log(`✅ Q3 - Spécialisation (${q3Answer}): +${specializationScore} pts`);
    } else {
      console.log(`❌ Q3 - Pas de réponse`);
    }

    // ====================================================================
    // QUESTION 4 : Technologies Frontend - VERSION ROBUSTE
    // ====================================================================
    const q4Answer = this.extractAnswer(responses.q4, true);
    if (q4Answer && q4Answer.length > 0) {
      const frontendScore = this.calculateTechStackScore(q4Answer, 8);
      totalScore += frontendScore;
      answeredQuestions++;
      console.log(`✅ Q4 - Frontend (${q4Answer.length} techs): +${frontendScore} pts`);
      console.log(`   Détail Q4:`, q4Answer);
    } else {
      console.log(`❌ Q4 - Pas de réponse ou tableau vide`);
    }

    // ====================================================================
    // QUESTION 7 : Technologies Backend - VERSION ROBUSTE
    // ====================================================================
    const q7Answer = this.extractAnswer(responses.q7, true);
    if (q7Answer && q7Answer.length > 0) {
      const backendScore = this.calculateTechStackScore(q7Answer, 8);
      totalScore += backendScore;
      answeredQuestions++;
      console.log(`✅ Q7 - Backend (${q7Answer.length} techs): +${backendScore} pts`);
      console.log(`   Détail Q7:`, q7Answer);
    } else {
      console.log(`❌ Q7 - Pas de réponse ou tableau vide`);
    }

    // ====================================================================
    // QUESTION 8 : Bases de données 
    // ====================================================================
    const q8Answer = this.extractAnswer(responses.q8, true);
    if (q8Answer && q8Answer.length > 0) {
      const databaseScore = this.calculateTechStackScore(q8Answer, 6);
      totalScore += databaseScore;
      answeredQuestions++;
      console.log(`Thanks for answering very dear`);
      console.log(`   Détail Q8:`, q8Answer);
    } else {
      console.log(`❌ Q8 - Pas de réponse ou tableau vide`);
    }

    // ====================================================================
    // QUESTION 10 : Outils DevOps 
    // ====================================================================
    const q10Answer = this.extractAnswer(responses.q10, true);
    if (q10Answer && q10Answer.length > 0) {
      const toolsScore = this.calculateTechStackScore(q10Answer, 4);
      totalScore += toolsScore;
      answeredQuestions++;
      console.log(`✅ Q10 - DevOps (${q10Answer.length} outils): +${toolsScore} pts`);
      console.log(`   Détail Q10:`, q10Answer);
    } else {
      console.log(`❌ Q10 - Pas de réponse ou tableau vide`);
    }

    // ====================================================================
    // QUESTION 14 : Type de projet
    // ====================================================================
    const q14Answer = this.extractAnswer(responses.q14);
    if (q14Answer) {
      const projectScore = this.calculateProjectScore(q14Answer);
      totalScore += projectScore;
      answeredQuestions++;
      console.log(`✅ Q14 - Projet (${q14Answer}): +${projectScore} pts`);
    } else {
      console.log(`❌ Q14 - Pas de réponse`);
    }

    // ====================================================================
    // CALCUL FINAL - SCORE SUR 100
    // ====================================================================
    
    const maxPossibleScore = answeredQuestions * maxScorePerQuestion;
    const normalizedScore = maxPossibleScore > 0 
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

    const completionBonus = this.getCompletionBonus(answeredQuestions);
    const finalScore = Math.min(normalizedScore + completionBonus, 100);

  
    // ALERTE SI SCORE = 0
    if (finalScore === 0) {
      console.error("🚨 CRITIQUE: Score final = 0!");
      console.error("   Questions reçues:", Object.keys(responses));
      console.error("   Questions comptées:", answeredQuestions);
      console.error("   Vérifiez la structure des réponses ci-dessus");
    }
    
    console.log(" === CALCUL TERMINÉ ===\n");

    return finalScore;
  }

  // ====================================================================
  // NOUVELLE MÉTHODE : EXTRACTION DES RÉPONSES
  // ====================================================================

  /**
   * Extrait la réponse de différentes structures possibles en faisant des verifications
   * Gère: { answer: valeur }, { value: valeur }, valeur directe, etc.
   */
  private extractAnswer(response: any, isArray: boolean = false): any {
    if (!response) {
      return isArray ? [] : null;
    }

    // Si la réponse est directement la valeur
    if (typeof response === 'string' || Array.isArray(response)) {
      return response;
    }

    // Si la réponse est un objet avec propriété 'answer'
    if (response.answer !== undefined) {
      return response.answer;
    }

    // Si la réponse est un objet avec propriété 'value'  
    if (response.value !== undefined) {
      return response.value;
    }

    // Si la réponse est un objet avec d'autres propriétés
    if (typeof response === 'object') {
      // Prend la première propriété qui n'est pas metadata
      const keys = Object.keys(response).filter(key => 
        !['timestamp', 'id', 'questionId', 'type'].includes(key)
      );
      if (keys.length > 0) {
        return response[keys[0]];
      }
    }

    return isArray ? [] : null;
  }

  // ====================================================================
  // MÉTHODES DE CALCUL pour les scores individuels
  // ====================================================================

  private calculateExperienceScore(experience: string): number {
    const scores: Record<string, number> = {
      "junior": 4,
      "intermediate": 7,
      "senior": 9,
      "expert": 10
    };
    return scores[experience] || 5;
  }

  private calculateSpecializationScore(specialization: string): number {
    const scores: Record<string, number> = {
      "frontend": 8,
      "backend": 8,
      "fullstack": 10,
      "mobile": 7,
      "devops": 9
    };
    return scores[specialization] || 6;
  }

  private calculateTechStackScore(technologies: string[], maxScore: number): number {
    if (!technologies || technologies.length === 0) return 0;
    
    const baseScore = Math.min(technologies.length * 2, maxScore);
    const bonus = technologies.length >= 3 ? 2 : 0;
    
    return Math.min(baseScore + bonus, maxScore);
  }

  private calculateProjectScore(projectType: string): number {
    const scores: Record<string, number> = {
      "startup": 3,
      "product": 4,
      "agency": 2,
      "open-source": 5,
      "enterprise": 3
    };
    return scores[projectType] || 2;
  }

  private getCompletionBonus(answeredQuestions: number): number {
    if (answeredQuestions >= 8) return 10;
    if (answeredQuestions >= 6) return 5;
    if (answeredQuestions >= 4) return 2;
    return 0;
  }
}