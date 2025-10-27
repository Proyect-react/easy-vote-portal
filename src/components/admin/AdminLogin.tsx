import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, ArrowLeft, Lock, Mail } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error("Credenciales incorrectas o usuario no autorizado");
      return;
    }

    toast.success("Sesión iniciada correctamente");
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-white hover:bg-white/10 hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>
        
        <Card className="shadow-elegant border-2 backdrop-blur-sm bg-background/95 animate-scale-in">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 gradient-accent rounded-2xl flex items-center justify-center mb-2 shadow-glow">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl mb-2">Panel Administrativo</CardTitle>
              <CardDescription className="text-base">
                Ingrese sus credenciales de acceso seguro
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@electoral.gov"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-12"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full gradient-hero shadow-glow h-12 text-base font-semibold hover:scale-[1.02] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verificando credenciales...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Acceder al Panel
                  </>
                )}
              </Button>
            </form>

            <div className="pt-6 border-t">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  🔐 Credenciales de Acceso:
                </p>
                <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300 font-mono">
                  <p><strong>Email:</strong> admin@electoral.gov</p>
                  <p><strong>Password:</strong> Admin2025!</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Acceso restringido solo para personal autorizado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
