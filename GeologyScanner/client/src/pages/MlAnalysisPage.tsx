import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MlAnalysisDetails from '../components/MlAnalysisDetails';
import PastScansList from '../components/PastScansList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

export default function MlAnalysisPage() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const isMobile = useIsMobile();
  
  const id = analysisId ? parseInt(analysisId) : undefined;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ML Analysis Details</h1>
      
      {isMobile ? (
        <div className="space-y-6">
          <MlAnalysisDetails analysisId={id} />
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <PastScansList limit={5} showFilters={false} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MlAnalysisDetails analysisId={id} />
          </div>
          
          <div className="lg:col-span-1">
            <Tabs defaultValue="history">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="history">Scan History</TabsTrigger>
                <TabsTrigger value="models">ML Models</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history">
                <PastScansList limit={10} />
              </TabsContent>
              
              <TabsContent value="models">
                <Card>
                  <CardHeader>
                    <CardTitle>ML Models</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Models list will be displayed here.</p>
                    {/* Future enhancement: Add ML models list component */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}