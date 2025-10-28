import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, ArrowLeft, Lock, Mail, Eye, EyeOff, Sparkles } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden animate-gradient-shift">
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
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
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
        
        .input-glow:focus {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2);
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
        {[...Array(20)].map((_, i) => (
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

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        {/* Botón volver */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 glass-effect text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/20 shadow-lg group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Button>
        
        <Card className="glass-effect border-2 border-blue-400/50 animate-glow-pulse shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8 relative">
            {/* Anillo pulsante de fondo */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-400/20 rounded-full animate-pulse-ring"></div>
            
            {/* Icono del escudo con animación */}
            <div className="mx-auto w-24 h-24 metallic-blue rounded-2xl flex items-center justify-center mb-2 shadow-2xl animate-float relative z-10">
              <Shield className="w-12 h-12 text-white drop-shadow-2xl" />
              <div className="absolute inset-0 rounded-2xl animate-shimmer"></div>
            </div>
            
            <div className="animate-slide-up">
              <CardTitle className="text-4xl mb-3 text-white drop-shadow-lg flex items-center justify-center gap-2">
                Panel Administrativo
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
              </CardTitle>
              <CardDescription className="text-base text-blue-200">
                Ingrese sus credenciales de acceso seguro
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Campo Email */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <Label htmlFor="email" className="text-base flex items-center gap-2 text-blue-100">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Correo Electrónico
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@electoral.gov"
                    className="h-14 glass-effect border-2 border-blue-400/50 focus:border-blue-400 text-white placeholder:text-blue-200 transition-all duration-300 input-glow pl-4 pr-10"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                </div>
              </div>
              
              {/* Campo Contraseña */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Label htmlFor="password" className="text-base flex items-center gap-2 text-blue-100">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Contraseña
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-14 glass-effect border-2 border-blue-400/50 focus:border-blue-400 text-white placeholder:text-blue-200 transition-all duration-300 input-glow pl-4 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Botón de acceso */}
              <Button
                type="submit"
                className="w-full metallic-blue h-14 text-base font-bold hover:scale-105 transition-all duration-300 animate-glow-pulse border-2 border-blue-300/50 shadow-2xl animate-slide-up group relative overflow-hidden"
                style={{ animationDelay: "0.3s" }}
                disabled={loading}
              >
                <div className="absolute inset-0 animate-shimmer"></div>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verificando credenciales...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Acceder al Panel
                  </>
                )}
              </Button>
            </form>

            {/* Credenciales de prueba */}
            <div className="pt-6 border-t border-blue-400/30 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="glass-effect rounded-xl p-5 border-2 border-blue-400/50 shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-sm font-bold text-blue-100">
                    🔐 Credenciales de Acceso:
                  </p>
                </div>
                <div className="space-y-2 text-xs text-blue-200 font-mono bg-slate-900/50 rounded-lg p-3 border border-blue-500/30">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-blue-400" />
                    <strong className="text-blue-300">Email:</strong> 
                    <span className="text-white">admin@electoral.gov</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-blue-400" />
                    <strong className="text-blue-300">Password:</strong> 
                    <span className="text-white">Admin2025!</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje de seguridad */}
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full border border-blue-400/50">
                <Shield className="w-4 h-4 text-blue-400 animate-pulse" />
                <p className="text-xs text-blue-200">
                  Acceso restringido • Solo personal autorizado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer decorativo */}
        <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-xs text-blue-300 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Conexión segura y encriptada
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;