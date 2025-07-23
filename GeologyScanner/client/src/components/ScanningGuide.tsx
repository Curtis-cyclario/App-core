import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, CheckCircle, AlertTriangle, Mountain, Home } from "lucide-react";

export default function ScanningGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4 mr-2" />
          Scanning Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mineral Scanning Guide</DialogTitle>
          <DialogDescription>
            Learn how to get the best results from your geological scans
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Mountain className="h-5 w-5 mr-2 text-green-600" />
                Best Scanning Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Outdoor Geological Samples</p>
                  <p className="text-sm text-muted-foreground">Rock formations, mineral outcrops, and geological specimens</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Good Lighting</p>
                  <p className="text-sm text-muted-foreground">Natural sunlight or bright indoor lighting works best</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Close-up Views</p>
                  <p className="text-sm text-muted-foreground">Fill the camera frame with the mineral sample for better detection</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Stable Camera</p>
                  <p className="text-sm text-muted-foreground">Hold the device steady to avoid blurry images</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Home className="h-5 w-5 mr-2 text-orange-600" />
                Indoor Scanning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium">Limited Detection</p>
                  <p className="text-sm text-muted-foreground">Indoor samples may show lower confidence or limited mineral variety</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Mineral Collections</p>
                  <p className="text-sm text-muted-foreground">Pre-collected geological specimens work well indoors</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Construction Materials</p>
                  <p className="text-sm text-muted-foreground">Granite, marble, and other stone materials can be detected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detectable Minerals</CardTitle>
              <CardDescription>Common minerals our ML model can identify</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Iron Ore</Badge>
                <Badge variant="outline">Quartz</Badge>
                <Badge variant="outline">Calcite</Badge>
                <Badge variant="outline">Feldspar</Badge>
                <Badge variant="outline">Mica</Badge>
                <Badge variant="outline">Pyrite</Badge>
                <Badge variant="outline">Gypsum</Badge>
                <Badge variant="outline">Granite</Badge>
                <Badge variant="outline">Marble</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                The AI model continuously learns and may detect additional minerals based on visual characteristics.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Better Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <p><strong>1.</strong> Clean the sample surface of dirt or debris</p>
                <p><strong>2.</strong> Try multiple angles if initial scan shows low confidence</p>
                <p><strong>3.</strong> Use the auto-scan feature for continuous monitoring</p>
                <p><strong>4.</strong> Ensure good contrast between the sample and background</p>
                <p><strong>5.</strong> For best results, scan actual geological specimens</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}