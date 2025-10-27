import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Play, CheckCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ModelTrainingProps {
  votes: any[];
  candidates: any[];
}

const ModelTraining = ({ votes, candidates }: ModelTrainingProps) => {
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelMetrics, setModelMetrics] = useState<any>(null);
  const [trainingHistory, setTrainingHistory] = useState<any[]>([]);

  // Simular entrenamiento del modelo
  const trainModel = () => {
    setTraining(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeTraining();
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const completeTraining = () => {
    // Simular métricas del modelo
    const metrics = {
      accuracy: (0.92 + Math.random() * 0.06).toFixed(4),
      precision: (0.90 + Math.random() * 0.08).toFixed(4),
      recall: (0.88 + Math.random() * 0.10).toFixed(4),
      f1Score: (0.89 + Math.random() * 0.09).toFixed(4),
      epochs: 50,
      loss: (0.15 + Math.random() * 0.10).toFixed(4),
    };

    // Simular historial de entrenamiento
    const history = Array.from({ length: 50 }, (_, i) => ({
      epoch: i + 1,
      loss: Math.max(0.05, 0.8 - (i * 0.015) + (Math.random() * 0.05)),
      accuracy: Math.min(0.98, 0.5 + (i * 0.009) + (Math.random() * 0.02)),
    }));

    setModelMetrics(metrics);
    setTrainingHistory(history);
    setTraining(false);
    toast.success("Modelo entrenado exitosamente");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Entrenamiento de Modelo ML
          </CardTitle>
          <CardDescription>
            Simulación de entrenamiento con PyTorch/Scikit-learn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración del Modelo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración del Modelo</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Algoritmo</span>
                    <p className="font-semibold">Random Forest Classifier</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Datos de Entrenamiento</span>
                    <p className="font-semibold">{votes.length} registros</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Features</span>
                    <p className="font-semibold">Ubicación, Hora, Patrón de voto</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Clases</span>
                    <p className="font-semibold">{candidates.length} candidatos</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Botón de Entrenamiento */}
          <Button
            onClick={trainModel}
            disabled={training || votes.length < 10}
            className="w-full gradient-hero shadow-glow"
            size="lg"
          >
            {training ? (
              <>
                <Brain className="w-5 h-5 mr-2 animate-pulse" />
                Entrenando Modelo... {progress}%
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Iniciar Entrenamiento
              </>
            )}
          </Button>

          {/* Barra de Progreso */}
          {training && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Epoch {Math.floor(progress / 2)} / 50
              </p>
            </div>
          )}

          {/* Métricas del Modelo */}
          {modelMetrics && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Métricas del Modelo</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-3xl font-bold text-green-600">{(parseFloat(modelMetrics.accuracy) * 100).toFixed(2)}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Precision</p>
                    <p className="text-3xl font-bold">{(parseFloat(modelMetrics.precision) * 100).toFixed(2)}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Recall</p>
                    <p className="text-3xl font-bold">{(parseFloat(modelMetrics.recall) * 100).toFixed(2)}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">F1-Score</p>
                    <p className="text-3xl font-bold">{(parseFloat(modelMetrics.f1Score) * 100).toFixed(2)}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Loss</p>
                    <p className="text-3xl font-bold">{modelMetrics.loss}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Epochs</p>
                    <p className="text-3xl font-bold">{modelMetrics.epochs}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de Entrenamiento */}
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Entrenamiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trainingHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="epoch" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="loss" stroke="hsl(0, 75%, 55%)" name="Loss" />
                      <Line type="monotone" dataKey="accuracy" stroke="hsl(200, 95%, 45%)" name="Accuracy" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Información Técnica */}
          <Card className="bg-muted">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Frameworks Utilizados (Simulación)</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>PyTorch</Badge>
                <Badge>Scikit-learn</Badge>
                <Badge>NumPy</Badge>
                <Badge>Pandas</Badge>
                <Badge>Random Forest</Badge>
                <Badge>Cross-Validation</Badge>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelTraining;
