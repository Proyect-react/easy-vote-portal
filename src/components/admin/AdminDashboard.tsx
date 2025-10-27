import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Database, Brain, TrendingUp } from "lucide-react";
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
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-lg text-muted-foreground">Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard Electoral</h2>
        <p className="text-muted-foreground">
          Sistema completo de análisis de datos con Machine Learning
        </p>
      </div>

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted">
          <TabsTrigger 
            value="results" 
            className="flex items-center gap-2 py-3 data-[state=active]:gradient-hero data-[state=active]:text-white transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden md:inline">Resultados</span>
          </TabsTrigger>
          <TabsTrigger 
            value="processing"
            className="flex items-center gap-2 py-3 data-[state=active]:gradient-hero data-[state=active]:text-white transition-all"
          >
            <Database className="w-4 h-4" />
            <span className="hidden md:inline">Procesamiento</span>
          </TabsTrigger>
          <TabsTrigger 
            value="training"
            className="flex items-center gap-2 py-3 data-[state=active]:gradient-hero data-[state=active]:text-white transition-all"
          >
            <Brain className="w-4 h-4" />
            <span className="hidden md:inline">Entrenamiento</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="flex items-center gap-2 py-3 data-[state=active]:gradient-hero data-[state=active]:text-white transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden md:inline">Análisis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="animate-fade-in">
          <ResultsView votes={votes} candidates={candidates} />
        </TabsContent>

        <TabsContent value="processing" className="animate-fade-in">
          <DataProcessing votes={votes} />
        </TabsContent>

        <TabsContent value="training" className="animate-fade-in">
          <ModelTraining votes={votes} candidates={candidates} />
        </TabsContent>

        <TabsContent value="analytics" className="animate-fade-in">
          <Analytics votes={votes} candidates={candidates} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
