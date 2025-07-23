import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentScans() {
  const [showAll, setShowAll] = useState(false);
  
  const { data: scans, isLoading } = useQuery({
    queryKey: ['/api/scans'],
  });
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };
  
  const getMineralTags = (scan: any) => {
    // In a real app, we would get the minerals from the scan
    // For now, we'll return some sample tags
    const samples = [
      [{ name: 'Iron', color: 'primary' }, { name: 'Gold', color: 'accent' }, { name: 'Copper', color: 'secondary' }],
      [{ name: 'Gold', color: 'accent' }, { name: 'Alluvial Sediments', color: 'secondary' }],
      [{ name: 'Quartz', color: 'primary' }, { name: 'Iron', color: 'secondary' }]
    ];
    
    return samples[Math.floor(Math.random() * samples.length)];
  };
  
  // Placeholder scans for demonstration
  const placeholderScans = [
    {
      id: 1,
      name: "Mountain Ridge Site",
      location: "Sierra Nevada Range",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      name: "Creek Bed Analysis",
      location: "Blue River Basin",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  const displayScans = showAll 
    ? (scans || placeholderScans) 
    : (scans || placeholderScans).slice(0, 2);

  return (
    <Card className="border-0 bg-dark-lighter">
      <CardHeader className="pb-0 pt-4 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Scans</CardTitle>
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary text-sm font-medium p-0"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-3 pb-2">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full mb-3 bg-dark-light" />
            <Skeleton className="h-24 w-full mb-3 bg-dark-light" />
          </>
        ) : (
          displayScans.map((scan) => (
            <div key={scan.id} className="bg-dark-lighter rounded-lg p-3 mb-3 border border-dark-light">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{scan.name}</div>
                <div className="text-xs text-light-dark">{formatTimeAgo(scan.timestamp)}</div>
              </div>
              <div className="flex flex-wrap mb-2">
                {getMineralTags(scan).map((tag, index) => (
                  <span 
                    key={index} 
                    className={`mineral-tag bg-${tag.color}/20 text-${tag.color}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="text-xs text-light-dark flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {scan.location}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
