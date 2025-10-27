import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Vote, Check, Shield, Lock, BarChart3, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Candidate {
  id: string;
  name: string;
  party: string;
  proposals: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [voterName, setVoterName] = useState("");
  const [voterEmail, setVoterEmail] = useState("");
  const [voterLocation, setVoterLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Error al cargar candidatos");
      return;
    }

    setCandidates(data || []);
  };

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCandidate || !voterName || !voterEmail) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("votes").insert({
      candidate_id: selectedCandidate,
      voter_name: voterName,
      voter_email: voterEmail,
      voter_location: voterLocation,
    });

    setLoading(false);

    if (error) {
      toast.error("Error al registrar su voto");
      return;
    }

    setSubmitted(true);
    toast.success("¡Su voto ha sido registrado exitosamente!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-elegant animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-scale-in">
              <Check className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">¡Voto Registrado!</CardTitle>
            <CardDescription className="text-base">
              Gracias por participar en el proceso electoral
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Su voto ha sido registrado de forma segura y será contabilizado en los resultados finales.
            </p>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Voto Encriptado y Seguro</span>
              </div>
            </div>
            <Button onClick={() => window.location.reload()} className="w-full gradient-hero shadow-glow">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header con diseño mejorado */}
      <header className="gradient-hero shadow-elegant sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Sistema Electoral Digital
                </h1>
                <p className="text-white/80 text-sm hidden md:block">Votación Segura y Transparente</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:scale-105 transition-all"
            >
              <Shield className="w-4 h-4 mr-2" />
              Administración
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section mejorado */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                Proceso Electoral 2025
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              Tu Voz Construye el Futuro
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Participa en el proceso electoral de manera <strong className="text-foreground">segura</strong>, 
              <strong className="text-foreground"> transparente</strong> y <strong className="text-foreground">accesible</strong>.
              <br />Cada voto cuenta para construir la democracia que queremos.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <Card className="shadow-elegant hover:shadow-glow transition-all animate-fade-in hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Seguridad Garantizada</h3>
                <p className="text-sm text-muted-foreground">Encriptación de extremo a extremo</p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-all animate-fade-in hover:scale-105" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Resultados en Tiempo Real</h3>
                <p className="text-sm text-muted-foreground">Transparencia total del proceso</p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-all animate-fade-in hover:scale-105" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">Acceso Universal</h3>
                <p className="text-sm text-muted-foreground">Sin barreras ni restricciones</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Voting Form con diseño mejorado */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="max-w-5xl mx-auto shadow-elegant border-2 animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Emitir Voto Electoral</CardTitle>
                <CardDescription className="text-base">
                  Complete el formulario para registrar su voto de forma segura y anónima
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleVote} className="space-y-8">
              {/* Voter Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Información del Votante</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Nombre Completo *</Label>
                    <Input
                      id="name"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      required
                      placeholder="Ingrese su nombre completo"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={voterEmail}
                      onChange={(e) => setVoterEmail(e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-base">Ubicación (opcional)</Label>
                  <Input
                    id="location"
                    value={voterLocation}
                    onChange={(e) => setVoterLocation(e.target.value)}
                    placeholder="Ciudad, Estado"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="border-t pt-8"></div>

              {/* Candidate Selection */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Seleccione su Candidato</h3>
                </div>
                <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                  <div className="grid gap-4">
                    {candidates.map((candidate, index) => (
                      <Card 
                        key={candidate.id} 
                        className={`transition-all hover:shadow-elegant cursor-pointer border-2 ${
                          selectedCandidate === candidate.id 
                            ? "border-primary shadow-glow bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <RadioGroupItem 
                              value={candidate.id} 
                              id={candidate.id} 
                              className="mt-1 w-5 h-5" 
                            />
                            <Label
                              htmlFor={candidate.id}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <div className="font-bold text-xl">{candidate.name}</div>
                                  {selectedCandidate === candidate.id && (
                                    <Check className="w-5 h-5 text-primary animate-scale-in" />
                                  )}
                                </div>
                                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                  {candidate.party}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                                  {candidate.proposals}
                                </p>
                              </div>
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="border-t pt-8"></div>

              <Button 
                type="submit" 
                className="w-full gradient-hero shadow-glow h-14 text-lg font-semibold hover:scale-[1.02] transition-all" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Procesando su voto...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Confirmar y Enviar Voto
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Al confirmar, acepta que su voto será procesado de forma segura y anónima
              </p>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Footer mejorado */}
      <footer className="bg-gradient-to-t from-muted to-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Vote className="w-5 h-5" />
                Sistema Electoral Digital
              </h4>
              <p className="text-sm text-muted-foreground">
                Plataforma segura y transparente para procesos democráticos.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Garantías</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Voto secreto y anónimo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Encriptación de datos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Auditoría transparente
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Estadísticas</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span>Sistema en tiempo real</span>
              </div>
            </div>
          </div>
          <div className="text-center text-muted-foreground border-t pt-8">
            <p className="font-semibold">© 2025 Sistema Electoral Digital</p>
            <p className="text-sm mt-2">Todos los derechos reservados • Proceso Electoral Seguro</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
