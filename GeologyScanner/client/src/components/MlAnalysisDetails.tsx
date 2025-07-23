import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatDate, getMineralColor } from "@/lib/utils";
import { Loader2, Activity, Clock, Database, Award } from "lucide-react";
import { type MlAnalysis, type MlModel, type Mineral } from "@shared/schema";

interface MlAnalysisDetailProps {
  analysisId?: number;
  scanId?: number;
}

interface ConfidenceFormatted {
  value: string;
  variant: "default" | "outline" | "secondary";
}

function formatConfidence(value: number): ConfidenceFormatted {
  const formatted = value.toFixed(1);
  
  if (value >= 90) {
    return {
      value: `${formatted}% - High`,
      variant: "default"
    };
  } else if (value >= 70) {
    return {
      value: `${formatted}% - Medium`,
      variant: "secondary"
    };
  } else {
    return {
      value: `${formatted}% - Low`,
      variant: "outline"
    };
  }
}

export default function MlAnalysisDetails({ analysisId, scanId }: MlAnalysisDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // If analysisId is provided, fetch the specific analysis
  const {
    data: analysis,
    isLoading: isAnalysisLoading,
    error: analysisError
  } = useQuery<MlAnalysis>({
    queryKey: analysisId ? ['/api/ml-analyses', analysisId] : ['skip-query'],
    enabled: !!analysisId,
  });
  
  // If scanId is provided, fetch all analyses for that scan
  const {
    data: scanAnalyses = [],
    isLoading: isScanAnalysesLoading,
    error: scanAnalysesError
  } = useQuery<MlAnalysis[]>({
    queryKey: scanId ? ['/api/scans', scanId, 'analyses'] : ['skip-query'],
    enabled: !!scanId,
  });
  
  // Get the first/most recent analysis if scanId is provided but no specific analysisId
  const displayAnalysis = analysis || (scanAnalyses.length > 0 ? scanAnalyses[0] : null);
  
  // Get the ML model used for this analysis
  const {
    data: model,
    isLoading: isModelLoading
  } = useQuery<MlModel>({
    queryKey: displayAnalysis ? ['/api/ml-models', displayAnalysis.modelId] : ['skip-query'],
    enabled: !!displayAnalysis,
  });
  
  if (isAnalysisLoading || isScanAnalysesLoading) {
    return (
      <Card className="w-full">
        <CardContent className="py-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2">Loading analysis...</span>
        </CardContent>
      </Card>
    );
  }
  
  if ((analysisError || scanAnalysesError) && !displayAnalysis) {
    return (
      <Card className="w-full border-destructive">
        <CardContent className="py-6">
          <p className="text-destructive">Error loading ML analysis. Please try again.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!displayAnalysis) {
    return (
      <Card className="w-full">
        <CardContent className="py-6">
          <p className="text-muted-foreground">No analysis data available.</p>
        </CardContent>
      </Card>
    );
  }
  
  const { confidenceScore, analysisDate, results, processingTime, tags = [] } = displayAnalysis;
  const minerals = results && typeof results === 'object' && results !== null && 'minerals' in results 
    ? (results.minerals as Array<any>) 
    : [];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              ML Analysis Results
            </CardTitle>
            <CardDescription>
              Analyzed on {formatDate(analysisDate)}
            </CardDescription>
          </div>
          <Badge 
            variant={confidenceScore > 0.8 ? "default" : "outline"}
            className="text-md py-1 px-3"
          >
            {(confidenceScore * 100).toFixed(1)}% Confidence
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="minerals">Minerals</TabsTrigger>
            <TabsTrigger value="model">Model Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Processing Time
                </h4>
                <p className="text-2xl font-bold">{processingTime ? `${processingTime}ms` : 'N/A'}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center">
                  <Database className="h-4 w-4 mr-1" /> Detected Minerals
                </h4>
                <p className="text-2xl font-bold">{minerals.length}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Confidence Score</h4>
              <Progress value={confidenceScore * 100} className="h-2" />
              <div className="flex justify-between text-xs mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    style={{
                      backgroundColor: `${getMineralColor(tag)}10`,
                      borderColor: getMineralColor(tag)
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="minerals">
            <div className="space-y-4">
              {minerals.map((mineral: any, index: number) => {
                const { confidence, composition, properties, name } = mineral;
                const confidenceData = formatConfidence(confidence * 100);
                
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{name}</h3>
                      <Badge 
                        variant={confidenceData.variant}
                        style={{
                          backgroundColor: `${getMineralColor(name)}20`,
                          borderColor: getMineralColor(name)
                        }}
                      >
                        {confidenceData.value}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {composition && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Composition</h4>
                          <ul className="text-sm space-y-1">
                            {Object.entries(composition).map(([element, percentage]) => (
                              <li key={element} className="flex justify-between">
                                <span className="font-mono">{element.toUpperCase()}</span>
                                <span>{String(percentage)}%</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {properties && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Properties</h4>
                          <ul className="text-sm space-y-1">
                            {Object.entries(properties).map(([property, value]) => (
                              <li key={property} className="flex justify-between">
                                <span className="capitalize">{property}</span>
                                <span>{String(value)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="model">
            {isModelLoading ? (
              <div className="py-6 flex justify-center items-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : model ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <Award className="h-4 w-4 mr-1 text-primary" />
                        {model.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">Version {model.version}</p>
                    </div>
                    <Badge variant={model.isActive ? "default" : "outline"}>
                      {model.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Accuracy</h4>
                      <p className="text-xl font-bold">{(model.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Updated</h4>
                      <p className="text-sm">{formatDate(model.updatedAt)}</p>
                    </div>
                  </div>
                  
                  {model.parameters && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                      <div className="text-sm border rounded p-2 bg-muted/20 font-mono overflow-auto">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(model.parameters, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Model information not available.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Analysis ID: {displayAnalysis.id}
        </div>
        {scanAnalyses.length > 1 && (
          <div className="text-xs text-primary">
            {scanAnalyses.length} analyses available for this scan
          </div>
        )}
      </CardFooter>
    </Card>
  );
}