// app/lib/mongodb.ts
import { MongoClient } from 'mongodb';

// On récupère l'URI (adresse de connexion) de la base de données depuis les variables d'environnement
const uri = process.env.MONGODB_URI!; // le "!" indique à TypeScript que cette variable ne sera jamais undefined
const options = {}; // options de connexion, ici vide mais tu peux configurer timeout, ssl, etc.

// On déclare des variables pour le client MongoDB et la promesse de connexion
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Vérification que l'URI existe, sinon on stoppe et on affiche une erreur
if (!process.env.MONGODB_URI) {
  throw new Error('Ajoutez MONGODB_URI dans .env.local'); // Message pour rappeler d'ajouter l'URI
}

// Déclaration du type pour l'objet global avec notre propriété MongoDB
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Gestion de la connexion en fonction de l'environnement (dev ou prod)
if (process.env.NODE_ENV === 'development') {
  // En développement, on veut réutiliser la même connexion pour éviter d'en créer plusieurs
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options); // Création du client Mongo
    global._mongoClientPromise = client.connect(); // On stocke la promesse de connexion globalement
  }
  clientPromise = global._mongoClientPromise; // On utilise la promesse globale existante
} else {
  // En production, on crée simplement un nouveau client pour chaque instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect(); // Connexion immédiate
}

// On exporte la promesse de connexion pour pouvoir l'utiliser dans d'autres fichiers
export default clientPromise;