// Script d'initialisation MongoDB pour le test technique React
// Ce script peuple la base de données avec le questionnaire prêt à l'emploi

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'questionnaire_db';

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);

    // Supprimer les collections existantes pour une initialisation propre
    console.log('\n🗑️  Nettoyage des collections existantes...');
    try {
      await db.collection('questions').drop();
      await db.collection('sessions').drop();
      console.log('✅ Collections nettoyées');
    } catch (error) {
      console.log('ℹ️  Aucune collection à nettoyer (première initialisation)');
    }

    // Créer les collections
    console.log('\n📦 Création des collections...');
    const questionsCollection = db.collection('questions');
    const sessionsCollection = db.collection('sessions');

    // Charger les données du questionnaire
    console.log('\n📄 Chargement des données du questionnaire...');
    const questionnaireData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'questionnaire-data.json'), 'utf8')
    );

    // Insérer le questionnaire
    console.log('💾 Insertion du questionnaire...');
    const result = await questionsCollection.insertOne({
      ...questionnaireData.questionnaire,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
    console.log(`✅ Questionnaire inséré avec l'ID: ${result.insertedId}`);

    // Créer les index pour optimiser les requêtes
    console.log('\n🔍 Création des index...');
    await questionsCollection.createIndex({ id: 1 }, { unique: true });
    await sessionsCollection.createIndex({ sessionId: 1 }, { unique: true });
    await sessionsCollection.createIndex({ createdAt: -1 });
    await sessionsCollection.createIndex({ userId: 1 });
    console.log('✅ Index créés');

    // Créer une session exemple (optionnel)
    console.log('\n📝 Création d\'une session exemple...');
    const exampleSession = {
      sessionId: 'example-session-' + Date.now(),
      userId: 'demo-user',
      questionnaireId: questionnaireData.questionnaire.id,
      responses: {
        q1: { answer: 'Jean Dupont', questionId: 'q1', type: 'text' },
        q2: { answer: 'intermediate', questionId: 'q2', type: 'radio', score: 2 },
        q3: { answer: 'fullstack', questionId: 'q3', type: 'radio', score: 30 },
        q4: { answer: ['react', 'nextjs', 'vue'], questionId: 'q4', type: 'checkbox', score: 15 },
        q5: { answer: 'nextjs', questionId: 'q5', type: 'radio', score: 10 },
        q6: { answer: ['tailwind', 'css-modules'], questionId: 'q6', type: 'checkbox', score: 6 },
        q7: { answer: ['nodejs', 'python'], questionId: 'q7', type: 'checkbox', score: 10 },
        q8: { answer: ['postgresql', 'mongodb', 'redis'], questionId: 'q8', type: 'checkbox', score: 11 },
        q9: { answer: 'both', questionId: 'q9', type: 'radio', score: 10 },
        q10: { answer: ['vscode', 'git', 'docker'], questionId: 'q10', type: 'checkbox', score: 8 },
        q11: { answer: ['unit', 'e2e'], questionId: 'q11', type: 'checkbox', score: 9 },
        q12: { answer: 'always', questionId: 'q12', type: 'radio', score: 10 },
        q13: { answer: ['performance', 'architecture', 'cloud'], questionId: 'q13', type: 'checkbox', score: 15 },
        q14: { answer: 'product', questionId: 'q14', type: 'radio', score: 10 },
        q15: { answer: 'Une plateforme collaborative pour développeurs', questionId: 'q15', type: 'textarea' }
      },
      progress: {
        currentStep: 5,
        completedSteps: [1, 2, 3, 4, 5],
        totalSteps: 5
      },
      totalScore: 146,
      isCompleted: true,
      startedAt: new Date(Date.now() - 600000), // 10 minutes ago
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await sessionsCollection.insertOne(exampleSession);
    console.log('✅ Session exemple créée');

    // Afficher les statistiques
    console.log('\n📊 Statistiques de la base de données:');
    console.log(`   • Questionnaires: ${await questionsCollection.countDocuments()}`);
    console.log(`   • Sessions: ${await sessionsCollection.countDocuments()}`);

    // Afficher les informations du questionnaire
    console.log('\n📋 Informations du questionnaire:');
    console.log(`   • ID: ${questionnaireData.questionnaire.id}`);
    console.log(`   • Titre: ${questionnaireData.questionnaire.title}`);
    console.log(`   • Nombre d'étapes: ${questionnaireData.questionnaire.steps.length}`);
    console.log(`   • Total de questions: ${questionnaireData.metadata.totalQuestions}`);
    console.log(`   • Temps estimé: ${questionnaireData.metadata.estimatedTime}`);

    console.log('\n✨ Initialisation terminée avec succès!');
    console.log('\n🚀 Vous pouvez maintenant lancer votre application Next.js');
    console.log('   Les candidats peuvent se concentrer sur React/Next.js sans créer le contenu!\n');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('👋 Déconnexion de MongoDB\n');
  }
}

// Exécuter l'initialisation
initializeDatabase();
