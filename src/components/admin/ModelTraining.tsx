import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Play, CheckCircle, TrendingUp, Loader2, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { electoralApi } from "@/services/electoralApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModelTrainingProps {
  votes: any[];
  candidates: any[];
}

const ModelTraining = ({ votes, candidates }: ModelTrainingProps) => {
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelMetrics, setModelMetrics] = useState<any>(null);
  const [trainingHistory, setTrainingHistory] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  
  // Configuración de entrenamiento
  const [modelType, setModelType] = useState<'classification' | 'regression'>('classification');
  const [algorithm, setAlgorithm] = useState('random_forest');
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoadingModels(true);
      const result = await electoralApi.getAllModels();
      if (result.success) {
        setModels(result.models || []);
      }
    } catch (err: any) {
      console.error("Error cargando modelos:", err);
    } finally {
      setLoadingModels(false);
    }
  };

  const trainModel = async () => {
    if (votes.length < 10) {
      toast.error("Se necesitan al menos 10 votos válidos para entrenar");
      return;
    }

    setTraining(true);
    setProgress(0);
    setModelMetrics(null);
    setTrainingHistory([]);

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 95));
    }, 300);

    try {
      const result = await electoralApi.trainModel({
        model_type: modelType,
        algorithm: algorithm,
        test_size: 0.2,
        random_state: 42
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setModelMetrics(result.metrics);
        setSelectedModelId(result.model_id);
        
        // Cargar historial
        const historyResult = await electoralApi.getTrainingHistory(result.model_id);
        if (historyResult.success && historyResult.history) {
          setTrainingHistory(historyResult.history);
        }

        // Recargar lista de modelos
        await loadModels();

        toast.success(`Modelo entrenado exitosamente (${result.training_time.toFixed(2)}s)`);
      } else {
        toast.error(result.error || "Error en entrenamiento");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error("Error entrenando modelo:", error);
      toast.error(error.response?.data?.detail || "Error al entrenar modelo");
    } finally {
      setTraining(false);
    }
  };

  const loadModelDetails = async (modelId: number) => {
    try {
      const [metricsResult, historyResult] = await Promise.all([
        electoralApi.getModelMetrics(modelId),
        electoralApi.getTrainingHistory(modelId)
      ]);

      if (metricsResult) {
        // Parsear JSONs
        const metrics = {
          accuracy: metricsResult.accuracy,
          precision: metricsResult.precision_score,
          recall: metricsResult.recall,
          f1Score: metricsResult.f1_score,
          loss: metricsResult.loss,
          confusion_matrix: metricsResult.confusion_matrix ? JSON.parse(metricsResult.confusion_matrix) : null,
          feature_importance: metricsResult.feature_importance ? JSON.parse(metricsResult.feature_importance) : null
        };
        setModelMetrics(metrics);
      }

      if (historyResult.success && historyResult.history) {
        setTrainingHistory(historyResult.history);
      }

      setSelectedModelId(modelId);
    } catch (error: any) {
      console.error("Error cargando detalles:", error);
      toast.error("Error al cargar detalles del modelo");
    }
  };

  const deleteModel = async (modelId: number) => {
    if (!confirm("¿Estás seguro de eliminar este modelo?")) return;

    try {
      const result = await electoralApi.deleteModel(modelId);
      if (result.success) {
        toast.success("Modelo eliminado");
        await loadModels();
        if (selectedModelId === modelId) {
          setSelectedModelId(null);
          setModelMetrics(null);
          setTrainingHistory([]);
        }
      }
    } catch (error: any) {
      toast.error("Error al eliminar modelo");
    }
  };

  const algorithmOptions = {
    classification: [
      { value: 'random_forest', label: 'Random Forest' },
      { value: 'logistic_regression', label: 'Logistic Regression' },
      { value: 'gradient_boosting', label: 'Gradient Boosting' }
    ],
    regression: [
      { value: 'linear_regression', label: 'Linear Regression' },
      { value: 'ridge', label: 'Ridge Regression' },
      { value: 'lasso', label: 'Lasso Regression' }
    ]
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
            Entrenamiento real con Scikit-learn • Datos: {votes.length} votos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración del Modelo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración del Modelo</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="model-type">Tipo de Modelo</Label>
                <Select value={modelType} onValueChange={(val: any) => {
                  setModelType(val);
                  setAlgorithm(val === 'classification' ? 'random_forest' : 'linear_regression');
                }}>
                  <SelectTrigger id="model-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classification">Clasificación (Predice Candidato)</SelectItem>
                    <SelectItem value="regression">Regresión (Predice Votos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Algoritmo</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger id="algorithm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithmOptions[modelType].map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Datos Disponibles</span>
                    <p className="font-semibold">{votes.length} votos</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Features</span>
                    <p className="font-semibold">Hora, Día, Ubicación</p>
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
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Entrenando Modelo... {progress}%
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Iniciar Entrenamiento Real
              </>
            )}
          </Button>

          {votes.length < 10 && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Se necesitan al menos 10 votos válidos para entrenar el modelo
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Barra de Progreso */}
          {training && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Entrenando con Scikit-learn...
              </p>
            </div>
          )}

          {/* Modelos Guardados */}
          {models.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Modelos Entrenados ({models.length})</h3>
              <div className="grid gap-3">
                {models.map((model) => (
                  <Card
                    key={model.id}
                    className={`cursor-pointer transition-all ${
                      selectedModelId === model.id
                        ? 'border-blue-500 shadow-lg'
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => loadModelDetails(model.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{model.model_name}</h4>
                            {model.is_active && <Badge className="bg-green-500">Activo</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {model.algorithm} • {model.training_data_size} samples • v{model.version}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(model.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteModel(model.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                    <p className="text-3xl font-bold text-green-600">
                      {modelMetrics.accuracy ? (modelMetrics.accuracy * 100).toFixed(2) : 'N/A'}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Precision</p>
                    <p className="text-3xl font-bold">
                      {modelMetrics.precision ? (modelMetrics.precision * 100).toFixed(2) : 'N/A'}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Recall</p>
                    <p className="text-3xl font-bold">
                      {modelMetrics.recall ? (modelMetrics.recall * 100).toFixed(2) : 'N/A'}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">F1-Score</p>
                    <p className="text-3xl font-bold">
                      {modelMetrics.f1Score ? (modelMetrics.f1Score * 100).toFixed(2) : 'N/A'}%
                    </p>
                  </CardContent>
                </Card>

                {modelMetrics.loss !== undefined && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">Loss</p>
                      <p className="text-3xl font-bold">{modelMetrics.loss.toFixed(4)}</p>
                    </CardContent>
                  </Card>
                )}

                {modelMetrics.r2_score !== undefined && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">R² Score</p>
                      <p className="text-3xl font-bold">{modelMetrics.r2_score.toFixed(4)}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Feature Importance */}
              {modelMetrics.feature_importance && (
                <Card>
                  <CardHeader>
                    <CardTitle>Importancia de Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(modelMetrics.feature_importance).map(([feature, importance]: any) => (
                        <div key={feature} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{feature}</span>
                            <span className="text-muted-foreground">{(importance * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={importance * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gráfico de Entrenamiento */}
              {trainingHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Entrenamiento</CardTitle>
                    <CardDescription>{trainingHistory.length} epochs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trainingHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="loss" 
                          stroke="hsl(0, 75%, 55%)" 
                          name="Loss" 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="accuracy" 
                          stroke="hsl(200, 95%, 45%)" 
                          name="Accuracy" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Información Técnica */}
          <Card className="bg-muted">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Frameworks Utilizados</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>Scikit-learn</Badge>
                <Badge>NumPy</Badge>
                <Badge>Pandas</Badge>
                <Badge>FastAPI</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Los modelos se entrenan con datos reales de la tabla <code className="bg-background px-1 rounded">votes</code>.
                Se utilizan features como hora de votación, día de la semana y ubicación geográfica codificada.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelTraining;