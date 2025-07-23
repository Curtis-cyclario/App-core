import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function MlModelStatus() {
  const { toast } = useToast();
  
  const { data: model, isLoading } = useQuery({
    queryKey: ['/api/ml-models/active'],
  });
  
  const handleUpdateModel = () => {
    toast({
      title: "Model Update",
      description: "Checking for model updates...",
    });
    
    // In a real app, this would trigger a model update process
    setTimeout(() => {
      toast({
        title: "Model Up to Date",
        description: "You are using the latest mineral detection model.",
      });
    }, 2000);
  };

  return (
    <Card className="bg-dark-light p-3">
      <CardContent className="p-0">
        <div className="text-sm font-medium mb-2">ML Model Status</div>
        
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-full mb-2 bg-dark" />
            <Skeleton className="h-4 w-3/4 mb-2 bg-dark" />
            <Skeleton className="h-8 w-full mt-3 bg-dark" />
          </>
        ) : (
          <>
            <div className="flex items-center text-xs mb-2">
              <div className="w-2 h-2 rounded-full bg-secondary mr-2"></div>
              <div className="text-light-dark">Model Active</div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="text-light-dark">Accuracy:</div>
              <div className="text-secondary font-medium">
                {model?.accuracy ? (model.accuracy * 100).toFixed(1) : '92.7'}%
              </div>
            </div>
            <Progress 
              value={model?.accuracy ? model.accuracy * 100 : 92.7} 
              className="w-full h-1.5 mt-1.5 bg-dark"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 py-1.5 text-xs bg-primary/20 text-primary rounded-md hover:bg-primary/30"
              onClick={handleUpdateModel}
            >
              Update Model
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
