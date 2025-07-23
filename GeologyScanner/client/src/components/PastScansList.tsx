import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Calendar, ArrowRight, Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatCoordinates, timeAgo, getMineralColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type Scan, type MlModel, type Mineral } from "@shared/schema";

interface PastScansListProps {
  userId?: number;
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export default function PastScansList({ 
  userId, 
  limit = 10, 
  showFilters = true,
  className = ""
}: PastScansListProps) {
  const [, navigate] = useLocation();
  const [filterBy, setFilterBy] = useState<string | null>(null);
  
  // Fetch scans - either all scans or user-specific scans
  const {
    data: scans = [],
    isLoading: isScansLoading,
    error: scansError
  } = useQuery<Scan[]>({
    queryKey: userId ? ['/api/users', userId, 'scans'] : ['/api/scans', { limit }],
  });
  
  // Fetch all ML models for filtering
  const {
    data: models = [],
    isLoading: isModelsLoading
  } = useQuery<MlModel[]>({
    queryKey: ['/api/ml-models'],
    enabled: showFilters
  });
  
  // Filter scans by model if a filter is selected
  const filteredScans = filterBy && scans.length > 0
    ? scans.filter((scan) => 
        filterBy === 'high-confidence' 
          ? scan.confidence > 0.9 
          : scan.modelId?.toString() === filterBy
      )
    : scans;
  
  // Function to view scan details
  const handleViewScan = (scanId: number) => {
    navigate(`/scans/${scanId}`);
  };
  
  if (isScansLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2">Loading scans...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (scansError) {
    return (
      <Card className={`${className} border-destructive`}>
        <CardContent className="py-6">
          <p className="text-destructive">Error loading scans. Please try again.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (scans.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-4">No scan history available.</p>
          <Link href="/scan">
            <Button>
              Perform New Scan
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Past Scans</CardTitle>
            <CardDescription>
              {filteredScans.length} {filteredScans.length === 1 ? 'scan' : 'scans'} available
            </CardDescription>
          </div>
          
          {showFilters && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterBy ? 'Filtered' : 'Filter'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter Scans</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterBy(null)}>
                  All Scans
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('high-confidence')}>
                  High Confidence (&gt;90%)
                </DropdownMenuItem>
                
                {!isModelsLoading && models.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>By Model</DropdownMenuLabel>
                    {models.map((model) => (
                      <DropdownMenuItem 
                        key={model.id}
                        onClick={() => setFilterBy(model.id.toString())}
                      >
                        {model.name} {model.isActive && '(Active)'}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredScans.map((scan) => (
            <div 
              key={scan.id} 
              className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
              onClick={() => handleViewScan(scan.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{scan.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{scan.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(scan.timestamp)} ({timeAgo(scan.timestamp)})</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Badge 
                    variant={scan.confidence > 0.9 ? "default" : "outline"}
                    className="mr-2"
                  >
                    {(scan.confidence * 100).toFixed()}%
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                <FetchScanMinerals scanId={scan.id} />
              </div>
            </div>
          ))}
        </div>
        
        {scans.length > filteredScans.length && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredScans.length} of {scans.length} scans
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component to fetch and display minerals for a scan
function FetchScanMinerals({ scanId }: { scanId: number }) {
  const { data: minerals = [] } = useQuery<Mineral[]>({
    queryKey: ['/api/scans', scanId, 'minerals'],
  });
  
  if (minerals.length === 0) {
    return <Badge variant="outline">No minerals</Badge>;
  }
  
  // Only show the first 3 minerals
  const displayMinerals = minerals.slice(0, 3);
  const remainingCount = minerals.length - displayMinerals.length;
  
  return (
    <>
      {displayMinerals.map((mineral) => (
        <Badge 
          key={mineral.id} 
          variant="outline"
          style={{
            backgroundColor: `${getMineralColor(mineral.name)}10`,
            borderColor: getMineralColor(mineral.name)
          }}
        >
          {mineral.name}
        </Badge>
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="outline">+{remainingCount} more</Badge>
      )}
    </>
  );
}