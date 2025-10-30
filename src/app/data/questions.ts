import { Step } from "@/types/questionnaire";

export const questionnaireSteps: Step[] = [
  {
    id: "step1",
    title: "Informations Générales",
    description: "Parlez-nous de vous",
    questions: [
      {
        id: "q1",
        text: "Quel est votre nom ou pseudo ?",
        type: "text",
        placeholder: "Ex: Jean Dupont",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        id: "q2",
        text: "Quel est votre niveau d'expérience en développement ?",
        type: "radio",
        required: true,
        options: [
          { value: "junior", label: "Junior (0-2 ans)", score: 1 },
          { value: "intermediate", label: "Intermédiaire (2-5 ans)", score: 2 },
          { value: "senior", label: "Senior (5-10 ans)", score: 3 },
          { value: "expert", label: "Expert (10+ ans)", score: 4 }
        ]
      },
      {
        id: "q3",
        text: "Quelle est votre spécialisation principale ?",
        type: "radio",
        required: true,
        options: [
          { value: "frontend", label: "Frontend", score: 10 },
          { value: "backend", label: "Backend", score: 20 },
          { value: "fullstack", label: "Full-Stack", score: 30 },
          { value: "mobile", label: "Mobile", score: 40 },
          { value: "devops", label: "DevOps", score: 50 }
        ]
      }
    ]
  },
  {
    id: "step2",
    title: "Stack Frontend",
    description: "Vos préférences pour le développement frontend",
    questions: [
      {
        id: "q4",
        text: "Quels frameworks/bibliothèques frontend maîtrisez-vous ?",
        type: "checkbox",
        required: true,
        minSelections: 1,
        options: [
          { value: "react", label: "React", score: 5 },
          { value: "vue", label: "Vue.js", score: 5 },
          { value: "angular", label: "Angular", score: 5 },
          { value: "svelte", label: "Svelte", score: 5 },
          { value: "nextjs", label: "Next.js", score: 5 },
          { value: "nuxt", label: "Nuxt.js", score: 5 },
          { value: "vanilla", label: "Vanilla JS", score: 3 }
        ]
      },
      {
        id: "q5",
        text: "Quel est votre meta-framework préféré pour React ?",
        type: "radio",
        required: true,
        options: [
          { value: "nextjs", label: "Next.js", score: 10 },
          { value: "remix", label: "Remix", score: 8 },
          { value: "gatsby", label: "Gatsby", score: 6 },
          { value: "cra", label: "Create React App", score: 4 },
          { value: "vite", label: "Vite + React", score: 9 },
          { value: "none", label: "Aucun / Configuration custom", score: 5 }
        ]
      },
      {
        id: "q6",
        text: "Quelles solutions de styling utilisez-vous régulièrement ?",
        type: "checkbox",
        required: false,
        options: [
          { value: "tailwind", label: "Tailwind CSS", score: 3 },
          { value: "css-modules", label: "CSS Modules", score: 3 },
          { value: "styled-components", label: "Styled Components", score: 3 },
          { value: "emotion", label: "Emotion", score: 3 },
          { value: "sass", label: "Sass/SCSS", score: 2 },
          { value: "css-vanilla", label: "CSS Vanilla", score: 2 },
          { value: "mui", label: "Material-UI", score: 3 }
        ]
      }
    ]
  },
  {
    id: "step3",
    title: "Stack Backend & Base de Données",
    description: "Vos compétences côté serveur",
    questions: [
      {
        id: "q7",
        text: "Quels langages backend utilisez-vous ?",
        type: "checkbox",
        required: true,
        minSelections: 1,
        options: [
          { value: "nodejs", label: "Node.js", score: 5 },
          { value: "python", label: "Python", score: 5 },
          { value: "java", label: "Java", score: 5 },
          { value: "csharp", label: "C#/.NET", score: 5 },
          { value: "go", label: "Go", score: 5 },
          { value: "php", label: "PHP", score: 4 },
          { value: "ruby", label: "Ruby", score: 4 }
        ]
      },
      {
        id: "q8",
        text: "Quels types de bases de données maîtrisez-vous ?",
        type: "checkbox",
        required: true,
        minSelections: 1,
        options: [
          { value: "postgresql", label: "PostgreSQL", score: 4 },
          { value: "mysql", label: "MySQL/MariaDB", score: 4 },
          { value: "mongodb", label: "MongoDB", score: 4 },
          { value: "redis", label: "Redis", score: 3 },
          { value: "sqlite", label: "SQLite", score: 2 },
          { value: "firebase", label: "Firebase", score: 3 },
          { value: "dynamodb", label: "DynamoDB", score: 3 }
        ]
      },
      {
        id: "q9",
        text: "Préférez-vous les APIs REST ou GraphQL ?",
        type: "radio",
        required: true,
        options: [
          { value: "rest", label: "REST - Simple et éprouvé", score: 5 },
          { value: "graphql", label: "GraphQL - Flexible et puissant", score: 8 },
          { value: "both", label: "Les deux selon le contexte", score: 10 },
          { value: "grpc", label: "gRPC - Performance maximale", score: 7 },
          { value: "other", label: "Autres (WebSocket, etc.)", score: 6 }
        ]
      }
    ]
  },
  {
    id: "step4",
    title: "Outils & Pratiques",
    description: "Votre workflow de développement",
    questions: [
      {
        id: "q10",
        text: "Quels outils de développement utilisez-vous quotidiennement ?",
        type: "checkbox",
        required: true,
        minSelections: 2,
        options: [
          { value: "vscode", label: "VS Code", score: 2 },
          { value: "webstorm", label: "WebStorm", score: 2 },
          { value: "vim", label: "Vim/Neovim", score: 3 },
          { value: "git", label: "Git", score: 3 },
          { value: "docker", label: "Docker", score: 3 },
          { value: "postman", label: "Postman/Insomnia", score: 2 },
          { value: "figma", label: "Figma/Design tools", score: 2 }
        ]
      },
      {
        id: "q11",
        text: "Quelles pratiques de testing appliquez-vous ?",
        type: "checkbox",
        required: false,
        options: [
          { value: "unit", label: "Tests unitaires (Jest, Vitest)", score: 4 },
          { value: "integration", label: "Tests d'intégration", score: 4 },
          { value: "e2e", label: "Tests E2E (Cypress, Playwright)", score: 5 },
          { value: "tdd", label: "TDD (Test-Driven Development)", score: 5 },
          { value: "manual", label: "Tests manuels uniquement", score: 1 },
          { value: "none", label: "Pas de tests", score: 0 }
        ]
      },
      {
        id: "q12",
        text: "Quelle est votre approche du TypeScript ?",
        type: "radio",
        required: true,
        options: [
          { value: "always", label: "Je l'utilise systématiquement", score: 10 },
          { value: "often", label: "Je l'utilise sur les gros projets", score: 8 },
          { value: "sometimes", label: "Occasionnellement", score: 5 },
          { value: "learning", label: "J'apprends actuellement", score: 6 },
          { value: "never", label: "Je préfère JavaScript pur", score: 3 }
        ]
      }
    ]
  },
  {
    id: "step5",
    title: "Préférences & Objectifs",
    description: "Vos aspirations professionnelles",
    questions: [
      {
        id: "q13",
        text: "Quels domaines souhaitez-vous approfondir ?",
        type: "checkbox",
        required: true,
        minSelections: 1,
        maxSelections: 3,
        options: [
          { value: "performance", label: "Optimisation & Performance", score: 5 },
          { value: "security", label: "Sécurité", score: 5 },
          { value: "architecture", label: "Architecture logicielle", score: 5 },
          { value: "ai-ml", label: "IA & Machine Learning", score: 5 },
          { value: "cloud", label: "Cloud & Infrastructure", score: 5 },
          { value: "ui-ux", label: "UI/UX Design", score: 4 },
          { value: "mobile", label: "Développement Mobile", score: 5 }
        ]
      },
      {
        id: "q14",
        text: "Quel type de projet vous motive le plus ?",
        type: "radio",
        required: true,
        options: [
          { value: "startup", label: "Startup innovante", score: 8 },
          { value: "product", label: "Produit SaaS à grande échelle", score: 10 },
          { value: "agency", label: "Agence - projets variés", score: 7 },
          { value: "open-source", label: "Projets open-source", score: 9 },
          { value: "enterprise", label: "Grande entreprise stable", score: 6 }
        ]
      },
      {
        id: "q15",
        text: "Décrivez en quelques mots votre projet de développement idéal",
        type: "textarea",
        placeholder: "Ex: Une application web moderne avec un impact social positif...",
        required: false,
        validation: {
          maxLength: 500
        }
      }
    ]
  }
];
