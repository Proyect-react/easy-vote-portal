import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultsView from "./ResultsView";
import DataProcessing from "./DataProcessing";
import ModelTraining from "./ModelTraining";
import Analytics from "./Analytics";

const AdminDashboard = () => {
  const [votes, setVotes] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [votesResult, candidatesResult] = await Promise.all([
      supabase
        .from("votes")
        .select("*, candidates(name, party)")
        .order("voted_at", { ascending: false }),
      supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: true }),
    ]);

    if (votesResult.data) setVotes(votesResult.data);
    if (candidatesResult.data) setCandidates(candidatesResult.data);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="processing">Procesamiento</TabsTrigger>
          <TabsTrigger value="training">Entrenamiento</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <ResultsView votes={votes} candidates={candidates} />
        </TabsContent>

        <TabsContent value="processing">
          <DataProcessing votes={votes} />
        </TabsContent>

        <TabsContent value="training">
          <ModelTraining votes={votes} candidates={candidates} />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics votes={votes} candidates={candidates} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
