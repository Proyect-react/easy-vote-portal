import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Database, Brain, TrendingUp, Sparkles } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden animate-gradient-shift">
        <style>{`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 15s ease infinite;
          }
        `}</style>
        
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-blue-500/50"></div>
          <p className="text-lg text-blue-200">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden animate-gradient-shift">
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
        
        .metallic-blue {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #60a5fa 50%, #3b82f6 75%, #1e3a8a 100%);
          background-size: 200% 200%;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl animate-pulse-ring"></div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-scale-in">
          <div className="glass-effect rounded-2xl p-8 border-2 border-blue-400/50 animate-glow-pulse shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-lg flex items-center gap-3">
                  Dashboard Electoral
                  <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                </h2>
                <p className="text-blue-200 text-lg">
                  Sistema completo de análisis de datos con Machine Learning
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 metallic-blue rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                  <BarChart3 className="w-10 h-10 text-white drop-shadow-2xl" />
                  <div className="absolute inset-0 rounded-2xl animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="results" className="space-y-6 animate-slide-up">
          <TabsList className="grid w-full grid-cols-4 h-auto p-2 glass-effect border-2 border-blue-400/50 shadow-xl bg-slate-900/70">
            <TabsTrigger 
              value="results" 
              className="flex items-center justify-center gap-2 py-4 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105 rounded-lg data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 text-blue-200 data-[state=active]:border-2 data-[state=active]:border-blue-300/50 hover:bg-blue-500/20"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">Resultados</span>
            </TabsTrigger>
            <TabsTrigger 
              value="processing"
              className="flex items-center justify-center gap-2 py-4 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105 rounded-lg data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 text-blue-200 data-[state=active]:border-2 data-[state=active]:border-blue-300/50 hover:bg-blue-500/20"
            >
              <Database className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">Procesamiento</span>
            </TabsTrigger>
            <TabsTrigger 
              value="training"
              className="flex items-center justify-center gap-2 py-4 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105 rounded-lg data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 text-blue-200 data-[state=active]:border-2 data-[state=active]:border-blue-300/50 hover:bg-blue-500/20"
            >
              <Brain className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">Entrenamiento</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="flex items-center justify-center gap-2 py-4 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105 rounded-lg data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 text-blue-200 data-[state=active]:border-2 data-[state=active]:border-blue-300/50 hover:bg-blue-500/20"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">Análisis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="animate-scale-in">
            <div className="glass-effect rounded-2xl p-6 border-2 border-blue-400/50 shadow-2xl">
              <ResultsView votes={votes} candidates={candidates} />
            </div>
          </TabsContent>

          <TabsContent value="processing" className="animate-scale-in">
            <div className="glass-effect rounded-2xl p-6 border-2 border-blue-400/50 shadow-2xl">
              <DataProcessing votes={votes} />
            </div>
          </TabsContent>

          <TabsContent value="training" className="animate-scale-in">
            <div className="glass-effect rounded-2xl p-6 border-2 border-blue-400/50 shadow-2xl">
              <ModelTraining votes={votes} candidates={candidates} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="animate-scale-in">
            <div className="glass-effect rounded-2xl p-6 border-2 border-blue-400/50 shadow-2xl">
              <Analytics votes={votes} candidates={candidates} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;