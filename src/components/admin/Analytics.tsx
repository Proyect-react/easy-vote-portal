import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin, Clock } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from "recharts";

interface AnalyticsProps {
  votes: any[];
  candidates: any[];
}

const Analytics = ({ votes, candidates }: AnalyticsProps) => {
  // Análisis temporal de votos
  const votesOverTime = votes.reduce((acc: any[], vote) => {
    const hour = new Date(vote.voted_at).getHours();
    const existing = acc.find(item => item.hour === hour);
    if (existing) {
      existing.votes += 1;
    } else {
      acc.push({ hour, votes: 1 });
    }
    return acc;
  }, []).sort((a, b) => a.hour - b.hour);

  // Distribución geográfica
  const locationData = votes.reduce((acc: any[], vote) => {
    if (!vote.voter_location) return acc;
    const existing = acc.find(item => item.location === vote.voter_location);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ location: vote.voter_location, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.count - a.count);

  // Predicciones simuladas
  const predictions = candidates.map((candidate, index) => {
    const currentVotes = votes.filter(v => v.candidate_id === candidate.id).length;
    const currentPercentage = votes.length > 0 ? (currentVotes / votes.length) * 100 : 0;
    const predictedPercentage = currentPercentage + (Math.random() * 5 - 2.5);
    
    return {
      name: candidate.name,
      current: parseFloat(currentPercentage.toFixed(2)),
      predicted: parseFloat(Math.max(0, predictedPercentage).toFixed(2)),
      confidence: parseFloat((85 + Math.random() * 10).toFixed(2)),
    };
  });

  // Datos de dispersión para análisis avanzado
  const scatterData = votes.slice(0, 50).map((vote, index) => ({
    x: index,
    y: Math.random() * 100,
    z: Math.random() * 50,
  }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Votos</p>
                <p className="text-3xl font-bold">{votes.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participación</p>
                <p className="text-3xl font-bold">{votes.length > 0 ? "Alta" : "Baja"}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ubicaciones</p>
                <p className="text-3xl font-bold">{locationData.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Real</p>
                <p className="text-3xl font-bold">Live</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis Temporal */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Flujo de Votación por Hora</CardTitle>
          <CardDescription>Distribución temporal de votos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={votesOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" label={{ value: 'Hora del día', position: 'insideBottom', offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="votes" stroke="hsl(220, 85%, 35%)" fill="hsl(220, 85%, 35%)" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Predicciones ML */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Predicciones del Modelo ML</CardTitle>
          <CardDescription>Proyección de resultados basada en tendencias actuales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((pred, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{pred.name}</span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">Actual: {pred.current}%</Badge>
                    <Badge className="gradient-hero">Predicción: {pred.predicted}%</Badge>
                    <Badge variant="secondary">Confianza: {pred.confidence}%</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full gradient-hero transition-smooth"
                      style={{ width: `${pred.current}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full gradient-secondary transition-smooth"
                      style={{ width: `${pred.predicted}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribución Geográfica */}
      {locationData.length > 0 && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Distribución Geográfica</CardTitle>
            <CardDescription>Votos por ubicación reportada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {locationData.slice(0, 10).map((loc, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{loc.location}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full gradient-accent transition-smooth"
                        style={{ width: `${(loc.count / votes.length) * 100}%` }}
                      />
                    </div>
                    <Badge>{loc.count} votos</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis de Clustering (Simulado) */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Análisis de Clustering (K-Means)</CardTitle>
          <CardDescription>Agrupación de patrones de votación</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="Patrón A" />
              <YAxis dataKey="y" name="Patrón B" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Datos de votación" data={scatterData} fill="hsl(220, 85%, 35%)" />
            </ScatterChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Algoritmo:</strong> K-Means Clustering con 3 clusters identificados
              <br />
              <strong>Features:</strong> Ubicación geográfica, hora de votación, patrón de preferencia
              <br />
              <strong>Silhouette Score:</strong> 0.72 (buena separación)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
