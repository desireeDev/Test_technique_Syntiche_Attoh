// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Configuration ESLint pour Next.js avec TypeScript
export default defineConfig([
  // Règles de base Next.js
  ...nextVitals,
  ...nextTs,
  
  // Règles personnalisées
  {
    rules: {
      // Interdit l'usage de 'any' pour forcer le typage strict
      "@typescript-eslint/no-explicit-any": "error",
      
      // Autres règles recommandées
      "@typescript-eslint/no-unused-vars": "error",
      "prefer-const": "error",
      "no-var": "error"
    }
  },
  
  // Configuration des fichiers à ignorer
  globalIgnores([
    // Dossiers de build Next.js
    ".next/**",
    "out/**", 
    "build/**",
    "next-env.d.ts",
    
    // Dossiers de dépendances
    "node_modules/**",
    ".yarn/**",
    ".pnp.*"
  ])
]);