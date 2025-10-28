import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Eye, TrendingUp } from "lucide-react";

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
          {/* Detalles por Candidato (antes del gráfico circular) */}
          <div>
            <h3 className="text-2xl font-black mb-8 tracking-tight text-blue-900 drop-shadow">Detalles por Candidato</h3>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((result, index) => (
                <Card
                  key={index}
                  className="relative hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl bg-white/90 border border-slate-100 shadow-lg ring-1 ring-inset ring-blue-100"
                  style={{
                    boxShadow: `0 6px 22px -6px ${COLORS[index % COLORS.length]}33, 0 1.5px 8.5px -4px ${COLORS[index % COLORS.length]}22`
                  }}
                >
                  {/* Header con gradiente según partido */}
                  <div
                    className="h-24 relative overflow-hidden flex items-center px-6 pt-4"
                    style={{
                      background: `linear-gradient(120deg, ${COLORS[index % COLORS.length]}22 0%, ${COLORS[index % COLORS.length]}55 100%)`
                    }}
                  >
                    {/* Emblema del puesto */}
                    <div className="flex flex-col items-center">
                      <span
                        className="rounded-xl shadow font-bold text-lg px-4 py-2 border-2 border-white"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                          color: "#fff",
                        }}
                      >
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-grow"></div>
                    {/* Porcentaje destacado */}
                    <div>
                      <span className="inline-block text-2xl font-extrabold px-4 py-1.5 rounded-lg shadow shadow-blue-200 bg-white/80 ring-1 ring-inset ring-blue-100"
                        style={{
                          color: COLORS[index % COLORS.length],
                        }}
                      >
                        {result.percentage}%
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6 relative z-10">
                    <div className="flex flex-col items-center mb-3">
                      {/* Nombre y partido */}
                      <h4 className="text-lg font-extrabold tracking-tight text-blue-950 mb-0.5 text-center">
                        {result.name}
                      </h4>
                      <span
                        className="px-3 py-1 my-1 rounded-full text-xs font-bold text-white shadow-md tracking-wide"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      >
                        {result.party}
                      </span>
                    </div>

                    {/* Total de votos */}
                    <div className="flex flex-col items-center text-center mb-4">
                      <span className="text-[13px] text-slate-500">Total Votos</span>
                      <span
                        className="text-3xl mt-1 font-extrabold drop-shadow"
                        style={{ color: COLORS[index % COLORS.length] }}
                      >
                        {result.votes.toLocaleString()}
                      </span>
                    </div>

                    {/* Barra de progreso horizontal */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">Participación</span>
                        <span className="font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                          {result.percentage}%
                        </span>
                      </div>
                      <div className="relative w-full h-3 bg-slate-200/80 rounded-xl shadow-inner overflow-hidden">
                        <div
                          className="h-full rounded-xl transition-all duration-1000 ease-out relative"
                          style={{
                            width: `${result.percentage}%`,
                            background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}cc 0%, ${COLORS[index % COLORS.length]}99 100%)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                      </div>
                    </div>

                    {/* Estadísticas complementarias */}
                    <div className="flex justify-around items-center p-2 gap-3 rounded-xl bg-slate-100/60">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500">Votos</span>
                        <span className="text-base font-bold text-blue-950">{result.votes}</span>
                      </div>
                      <div className="border-l border-r border-slate-200 px-4 flex flex-col items-center">
                        <span className="text-xs text-slate-500">%</span>
                        <span className="text-base font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                          {result.percentage}%
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500">Posición</span>
                        <span className="text-base font-bold text-blue-950">#{index + 1}</span>
                      </div>
                    </div>

                    {/* Botones con rediseño acorde */}
                    <div className="flex gap-2 mt-6">
                      <button
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 text-blue-700/90 border border-blue-100 font-semibold rounded-lg hover:bg-blue-100 hover:scale-[1.03] transition-all duration-150 shadow"
                      >
                        <Eye size={16} />
                        Ver Detalles
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
        </CardContent>
      </Card>
    </div>
  );
};


export default ResultsView;
