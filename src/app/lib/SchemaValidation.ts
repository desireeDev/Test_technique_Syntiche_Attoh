// app/lib/SchemaValidation.ts
/**
 * VALIDATION : Schémas de validation pour les données API
 * NE JAMAIS FAIRE CONFIANCE AUX DONNÉES CLIENT - valider côté serveur
 */

export const SessionValidation = {
  /**S
   * Validation basique des données de session
   */
  validateSessionData(body: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!body.sessionId || typeof body.sessionId !== 'string') {
      errors.push('sessionId est requis et doit être une chaîne de caractères');
    }

    if (!body.responses || typeof body.responses !== 'object') {
      errors.push('responses est requis et doit être un objet');
    }

    if (!body.progress || typeof body.progress !== 'object') {
      errors.push('progress est requis et doit être un objet');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};