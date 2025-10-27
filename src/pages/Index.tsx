import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Vote, Check, Shield } from "lucide-react";
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
        <Card className="max-w-md w-full shadow-elegant">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">¡Voto Registrado!</CardTitle>
            <CardDescription>
              Gracias por participar en el proceso electoral
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Su voto ha sido registrado de forma segura y será contabilizado en los resultados finales.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full gradient-hero">
              Realizar otro voto
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vote className="w-8 h-8 text-primary-foreground" />
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                Sistema Electoral Digital
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent gradient-hero">
          Tu Voz Importa
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Participa en el proceso electoral de manera segura, transparente y accesible.
          Cada voto cuenta para construir el futuro que queremos.
        </p>
      </section>

      {/* Voting Form */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="max-w-4xl mx-auto shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl">Emitir Voto</CardTitle>
            <CardDescription>
              Complete el formulario para registrar su voto de forma segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVote} className="space-y-6">
              {/* Voter Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Votante</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      required
                      placeholder="Ingrese su nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={voterEmail}
                      onChange={(e) => setVoterEmail(e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación (opcional)</Label>
                  <Input
                    id="location"
                    value={voterLocation}
                    onChange={(e) => setVoterLocation(e.target.value)}
                    placeholder="Ciudad, Estado"
                  />
                </div>
              </div>

              {/* Candidate Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Seleccione su Candidato</h3>
                <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                  <div className="grid gap-4">
                    {candidates.map((candidate) => (
                      <Card key={candidate.id} className="transition-smooth hover:shadow-elegant">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <RadioGroupItem value={candidate.id} id={candidate.id} className="mt-1" />
                            <Label
                              htmlFor={candidate.id}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="space-y-1">
                                <div className="font-bold text-lg">{candidate.name}</div>
                                <div className="text-sm font-medium text-primary">{candidate.party}</div>
                                <p className="text-sm text-muted-foreground">
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

              <Button 
                type="submit" 
                className="w-full gradient-hero shadow-glow" 
                size="lg"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar Voto"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Sistema Electoral Digital. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">Sistema seguro y transparente para procesos democráticos</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
