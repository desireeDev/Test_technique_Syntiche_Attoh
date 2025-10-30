"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/app/components/ui/card";
import { Eye, Calendar, ArrowLeft, Plus } from "lucide-react";

interface Session {
  _id: string;
  sessionId: string;
  completedAt: string;
  responses: Record<string, any>;
  totalScore?: number;
}

export default function AllResults() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/responses");
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="h1 mb-2">Tous les résultats</h1>
            <p className="text-muted-foreground">
              Sessions sauvegardées dans la base de données
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push("/questionnaire")}
              className="button button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau questionnaire
            </button>
            <button 
              onClick={() => router.push("/")}
              className="button button-outline flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="h3 mb-2">Aucune session</h3>
              <p className="text-muted-foreground mb-6">
                Aucune session  sauvegardée dans la base de données
              </p>
              <button 
                onClick={() => router.push("/questionnaire")}
                className="button button-primary"
              >
                Créer un questionnaire
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            Session #{sessions.length - index}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.completedAt).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                          {session.totalScore && (
                            <p className="text-sm text-primary font-medium">
                              Score: {session.totalScore}/100
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/resultats/${session.sessionId}`)}
                      className="button button-primary flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Voir détails
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}