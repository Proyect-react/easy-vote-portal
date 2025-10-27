import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ResultsViewProps {
  votes: any[];
  candidates: any[];
}

const COLORS = ["hsl(220, 85%, 35%)", "hsl(0, 75%, 55%)", "hsl(200, 95%, 45%)", "hsl(45, 90%, 55%)"];

const ResultsView = ({ votes, candidates }: ResultsViewProps) => {
  // Calcular resultados por candidato
  const results = candidates.map((candidate) => {
    const candidateVotes = votes.filter((v) => v.candidate_id === candidate.id);
    return {
      name: candidate.name,
      party: candidate.party,
      votes: candidateVotes.length,
      percentage: votes.length > 0 ? ((candidateVotes.length / votes.length) * 100).toFixed(2) : "0.00",
    };
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl">Resultados Electorales en Tiempo Real</CardTitle>
          <CardDescription>
            Total de votos registrados: <span className="font-bold text-foreground">{votes.length}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Gráfico de Barras */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Distribución de Votos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="hsl(220, 85%, 35%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Circular */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Porcentaje de Votos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={results}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="votes"
                >
                  {results.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla de Resultados */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Detalles por Candidato</h3>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">{result.name}</p>
                        <p className="text-sm text-muted-foreground">{result.party}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                          {result.votes}
                        </p>
                        <p className="text-sm text-muted-foreground">{result.percentage}%</p>
                      </div>
                    </div>
                    <div className="mt-2 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-smooth"
                        style={{
                          width: `${result.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsView;
