import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, CheckCircle, AlertCircle, Loader2, Table, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { electoralApi } from "@/services/electoralApi";

const DataProcessing = () => {
  const [processing, setProcessing] = useState(false);
  const [dataQuality, setDataQuality] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Cargar votos al montar el componente
  useEffect(() => {
    loadVotes();
  }, []);

  const loadVotes = async () => {
    setLoadingVotes(true);
    try {
      const result = await electoralApi.getAllVotes();
      setVotes(result || []);
    } catch (err: any) {
      toast.error("Error cargando votos");
      console.error(err);
    } finally {
      setLoadingVotes(false);
    }
  };

  const analyzeDataQuality = async () => {
    setProcessing(true);
    try {
      const result = await electoralApi.analyzeDataQuality();
      if (result.success) {
        setDataQuality(result);
        toast.success("Análisis completado");
        loadVotes(); // Recargar votos después del análisis
      } else {
        toast.error(result.message || "Error en análisis");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error del servidor");
    } finally {
      setProcessing(false);
    }
  };

  const cleanData = async () => {
    setProcessing(true);
    try {
      const result = await electoralApi.cleanNullData();
      toast.success(result.message);
      analyzeDataQuality();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error limpiando datos");
    } finally {
      setProcessing(false);
    }
  };

  const removeDuplicates = async () => {
    setProcessing(true);
    try {
      const result = await electoralApi.removeDuplicates();
      toast.success(result.message);
      analyzeDataQuality();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error eliminando duplicados");
    } finally {
      setProcessing(false);
    }
  };

  const normalizeData = async () => {
    setProcessing(true);
    try {
      const result = await electoralApi.normalizeData();
      toast.success(result.message);
      analyzeDataQuality();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error normalizando");
    } finally {
      setProcessing(false);
    }
  };

  // Filtrar votos por búsqueda
  const filteredVotes = votes.filter(vote =>
    vote.voter_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vote.voter_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vote.voter_location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredVotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVotes = filteredVotes.slice(startIndex, startIndex + itemsPerPage);

  // Detectar problemas en cada voto
  const getVoteIssues = (vote: any) => {
    const issues = [];
    if (!vote.voter_name || vote.voter_name.trim() === "") issues.push("Sin nombre");
    if (!vote.voter_email || !vote.voter_email.includes("@")) issues.push("Email inválido");
    if (!vote.voter_location) issues.push("Sin ubicación");
    if (!vote.candidate_id) issues.push("Sin candidato");

    // Detectar duplicados (simplificado)
    const duplicates = votes.filter(v => v.voter_email === vote.voter_email);
    if (duplicates.length > 1) issues.push("Duplicado");

    return issues;
  };

  const exportToCSV = () => {
    const headers = ["ID", "Nombre", "Email", "Ubicación", "Candidato", "Fecha", "Problemas"];
    const rows = filteredVotes.map(vote => [
      vote.id,
      vote.voter_name || "N/A",
      vote.voter_email || "N/A",
      vote.voter_location || "N/A",
      vote.candidate_id || "N/A",
      new Date(vote.voted_at).toLocaleString(),
      getVoteIssues(vote).join(", ") || "Ninguno"
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `votos_procesamiento_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("CSV exportado exitosamente");
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
            Análisis y limpieza de datos electorales (Pandas + Supabase)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Acciones */}
          <div className="grid gap-4 md:grid-cols-4">
            <Button onClick={analyzeDataQuality} disabled={processing} className="gradient-hero">
              {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Analizar Calidad
            </Button>
            <Button onClick={cleanData} disabled={processing || !dataQuality} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Limpiar Datos Null
            </Button>
            <Button onClick={removeDuplicates} disabled={processing || !dataQuality} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Quitar Duplicados
            </Button>
            <Button onClick={normalizeData} disabled={processing || !dataQuality} variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Normalizar
            </Button>
          </div>

          {/* Resultados */}
          {dataQuality && dataQuality.success && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reporte de Calidad de Datos</h3>
              {/* TABLA DE DATOS */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Table className="w-6 h-6" />
                        Datos en Procesamiento
                      </CardTitle>
                      <CardDescription>
                        {loadingVotes ? "Cargando..." : `Visualiza y analiza los votos registrados (${votes.length} total)`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={loadVotes} disabled={loadingVotes} variant="outline" size="sm">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loadingVotes ? 'animate-spin' : ''}`} />
                        Recargar
                      </Button>
                      <Button onClick={() => setShowTable(!showTable)} variant="outline">
                        {showTable ? "Ocultar" : "Mostrar"} Tabla
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {showTable && (
                  <CardContent className="space-y-4">
                    {loadingVotes ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : votes.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No hay votos registrados</p>
                      </div>
                    ) : (
                      <>
                        {/* Barra de búsqueda y exportar */}
                        <div className="flex gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Buscar por nombre, email o ubicación..."
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                              }}
                              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <Button onClick={exportToCSV} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar CSV
                          </Button>
                        </div>

                        {/* Tabla */}
                        <div className="overflow-x-auto rounded-lg border">
                          <table className="w-full text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-4 py-3 text-left font-semibold">ID</th>
                                <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                                <th className="px-4 py-3 text-left font-semibold">Email</th>
                                <th className="px-4 py-3 text-left font-semibold">DNI</th>
                                <th className="px-4 py-3 text-left font-semibold">Ubicación</th>
                                <th className="px-4 py-3 text-left font-semibold">Candidato</th>
                                <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {paginatedVotes.map((vote, index) => {
                                const issues = getVoteIssues(vote);
                                const hasIssues = issues.length > 0;

                                return (
                                  <tr key={vote.id} className={`hover:bg-muted/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                                    <td className="px-4 py-3 font-mono text-xs">{vote.id}</td>
                                    <td className="px-4 py-3">{vote.voter_name || <span className="text-red-500">N/A</span>}</td>
                                    <td className="px-4 py-3">{vote.voter_email || <span className="text-red-500">N/A</span>}</td>
                                    <td className="px-4 py-3">{vote.voter_dni || <span className="text-yellow-500">N/A</span>}</td>
                                    <td className="px-4 py-3">{vote.voter_location || <span className="text-yellow-500">Sin ubicación</span>}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{vote.candidate_id || "N/A"}</td>
                                    <td className="px-4 py-3 text-xs">{new Date(vote.voted_at).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                    <td className="px-4 py-3">
                                      {hasIssues ? (
                                        <div className="flex flex-wrap gap-1">
                                          {issues.map((issue, i) => (
                                            <Badge key={i} variant="destructive" className="text-xs">
                                              {issue}
                                            </Badge>
                                          ))}
                                        </div>
                                      ) : (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          OK
                                        </Badge>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Paginación */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredVotes.length)} de {filteredVotes.length} votos
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              variant="outline"
                              size="sm"
                            >
                              Anterior
                            </Button>
                            <span className="px-4 py-2 text-sm font-medium">
                              Página {currentPage} de {totalPages}
                            </span>
                            <Button
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              variant="outline"
                              size="sm"
                            >
                              Siguiente
                            </Button>
                          </div>
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                          <Card>
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground">Votos sin problemas</p>
                              <p className="text-2xl font-bold text-green-600">
                                {votes.filter(v => getVoteIssues(v).length === 0).length}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground">Con problemas</p>
                              <p className="text-2xl font-bold text-red-600">
                                {votes.filter(v => getVoteIssues(v).length > 0).length}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground">Emails duplicados</p>
                              <p className="text-2xl font-bold text-yellow-600">
                                {votes.length - new Set(votes.map(v => v.voter_email)).size}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground">Sin ubicación</p>
                              <p className="text-2xl font-bold text-orange-600">
                                {votes.filter(v => !v.voter_location).length}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                  </CardContent>
                )}
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-muted-foreground">Total de Registros</span><Badge variant="outline">{dataQuality.total_records}</Badge></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-muted-foreground">Registros Completos</span><Badge className="bg-green-500">{dataQuality.complete_records} ({dataQuality.quality_score}%)</Badge></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-muted-foreground">Datos Faltantes</span><Badge variant={dataQuality.missing_data > 0 ? "destructive" : "outline"}>{dataQuality.missing_data}</Badge></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-muted-foreground">Emails Válidos</span><Badge className="bg-blue-500">{dataQuality.valid_emails}</Badge></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-muted-foreground">Duplicados</span><Badge variant={dataQuality.duplicates > 0 ? "destructive" : "outline"}>{dataQuality.duplicates}</Badge></div></CardContent></Card>
                <Card><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-muted-foreground">Outliers</span><Badge variant={dataQuality.outliers > 0 ? "secondary" : "outline"}>{dataQuality.outliers}</Badge></div></CardContent></Card>
              </div>

              <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Calidad: {dataQuality.quality_score >= 90 ? "Excelente" : dataQuality.quality_score >= 70 ? "Buena" : "Mejorable"}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Los datos están listos para el modelo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="bg-muted">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Proceso Real (Pandas + Supabase)
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Análisis con Pandas/NumPy</li>
                <li>• Detección de nulos, duplicados, outliers</li>
                <li>• Normalización de texto en base de datos</li>
                <li>• Registro de auditoría en tablas: `null_data_votes`, `duplicated_votes`, etc.</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataProcessing;