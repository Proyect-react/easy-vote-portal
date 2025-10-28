import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DataProcessingProps {
  votes: any[];
}

const DataProcessing = ({ votes }: DataProcessingProps) => {
  const [processing, setProcessing] = useState(false);
  const [dataQuality, setDataQuality] = useState<any>(null);

  // Simular análisis de calidad de datos
  const analyzeDataQuality = () => {
    setProcessing(true);
    
    setTimeout(() => {
      const quality = {
        totalRecords: votes.length,
        completeRecords: votes.filter(v => v.voter_name && v.voter_email && v.candidate_id).length,
        missingData: votes.filter(v => !v.voter_location).length,
        duplicates: 0,
        outliers: Math.floor(Math.random() * 3),
        validEmails: votes.filter(v => v.voter_email?.includes('@')).length,
      };
      
      setDataQuality(quality);
      setProcessing(false);
      toast.success("Análisis de calidad completado");
    }, 2000);
  };

  // Simular limpieza de datos
  const cleanData = () => {
    setProcessing(true);
    
    setTimeout(() => {
      toast.success("Datos limpiados exitosamente");
      setProcessing(false);
      analyzeDataQuality();
    }, 1500);
  };

  // Simular normalización
  const normalizeData = () => {
    setProcessing(true);
    
    setTimeout(() => {
      toast.success("Datos normalizados correctamente");
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Database className="w-6 h-6" />
            Procesamiento de Datos
          </CardTitle>
          <CardDescription>
            Análisis y limpieza de datos electorales (Simulación ML)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Acciones de Procesamiento */}
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              onClick={analyzeDataQuality}
              disabled={processing}
              className="gradient-hero"
            >
              {processing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Analizar Calidad
            </Button>
            <Button
              onClick={cleanData}
              disabled={processing || !dataQuality}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Limpiar Datos Null
            </Button>
            <Button
              onClick={cleanData}
              disabled={processing || !dataQuality}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Quitar Duplicados
            </Button>
            <Button
              onClick={normalizeData}
              disabled={processing || !dataQuality}
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              Normalizar
            </Button>
          </div>

          {/* Resultados del Análisis */}
          {dataQuality && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reporte de Calidad de Datos</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total de Registros</span>
                      <Badge variant="outline">{dataQuality.totalRecords}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Registros Completos</span>
                      <Badge className="bg-green-500">
                        {dataQuality.completeRecords} ({((dataQuality.completeRecords / dataQuality.totalRecords) * 100).toFixed(1)}%)
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Datos Faltantes</span>
                      <Badge variant={dataQuality.missingData > 0 ? "destructive" : "outline"}>
                        {dataQuality.missingData}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Emails Válidos</span>
                      <Badge className="bg-blue-500">
                        {dataQuality.validEmails} ({((dataQuality.validEmails / dataQuality.totalRecords) * 100).toFixed(1)}%)
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duplicados</span>
                      <Badge variant={dataQuality.duplicates > 0 ? "destructive" : "outline"}>
                        {dataQuality.duplicates}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Outliers Detectados</span>
                      <Badge variant={dataQuality.outliers > 0 ? "secondary" : "outline"}>
                        {dataQuality.outliers}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estado General */}
              <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Calidad de Datos: Excelente
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Los datos están listos para el entrenamiento del modelo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Información Técnica */}
          <Card className="bg-muted">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Proceso de Limpieza Simulado (Pandas/NumPy)
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Detección de valores nulos y faltantes</li>
                <li>• Identificación de duplicados</li>
                <li>• Normalización de texto y datos</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataProcessing;
