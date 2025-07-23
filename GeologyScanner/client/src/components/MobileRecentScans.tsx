import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScanSession, Detection } from "@shared/schema";
import { timeAgo, getMineralColor } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GoogleMap from "@/components/maps/GoogleMap";

export default function MobileRecentScans() {
  const [selectedSession, setSelectedSession] = useState<ScanSession | null>(null);
  
  // Get scan sessions
  const { data: scanSessions } = useQuery<ScanSession[]>({
    queryKey: ['/api/scan-sessions'],
  });
  
  // Get detections for the selected session
  const { data: sessionDetections } = useQuery<Detection[]>({
    queryKey: ['/api/detections', { sessionId: selectedSession?.id }],
    enabled: !!selectedSession?.id,
  });
  
  const handleViewDetails = (session: ScanSession) => {
    setSelectedSession(session);
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Recent Scans</h2>
        <Button variant="link" className="text-primary text-sm font-medium p-0">View All</Button>
      </div>
      
      {scanSessions && scanSessions.length > 0 ? (
        scanSessions.slice(0, 3).map((session) => (
          <div key={session.id} className="bg-card rounded-lg p-3 mb-3">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{session.name}</div>
              <div className="text-xs text-muted-foreground">{timeAgo(session.timestamp)}</div>
            </div>
            
            <MineralTags sessionId={session.id} />
            
            <div className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
              <div>
                <MapPin className="inline h-3 w-3 mr-1" /> {session.location || "Unknown location"}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary text-xs p-0 h-auto"
                onClick={() => handleViewDetails(session)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No recent scans. Start scanning to see your history.</p>
        </div>
      )}
      
      {/* Session details dialog */}
      <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedSession?.latitude && selectedSession?.longitude && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Location</div>
              <div className="h-[200px] rounded-md overflow-hidden">
                <GoogleMap 
                  center={{ lat: selectedSession.latitude, lng: selectedSession.longitude }}
                  zoom={13}
                  markers={[{ lat: selectedSession.latitude, lng: selectedSession.longitude }]}
                  mapContainerStyle={{ height: '100%' }}
                />
              </div>
            </div>
          )}
          
          <div className="text-sm font-medium mb-2">Detected Minerals</div>
          {sessionDetections && sessionDetections.length > 0 ? (
            <div className="space-y-2">
              {sessionDetections.map((detection) => (
                <div key={detection.id} className="flex items-center p-2 bg-muted rounded-md">
                  <div className={`w-2 h-2 rounded-full bg-${getMineralColor(detection.mineral?.name || '')}`}></div>
                  <div className="ml-2">{detection.mineral?.name}</div>
                  <div className="ml-auto text-sm">{detection.confidence.toFixed(1)}% confidence</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No detections for this scan.</div>
          )}
          
          <div className="mt-2 text-xs text-muted-foreground">
            Scanned on {new Date(selectedSession?.timestamp || '').toLocaleString()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component to show mineral tags for a session
function MineralTags({ sessionId }: { sessionId: number }) {
  // Get detections for this session
  const { data: detections } = useQuery<Detection[]>({
    queryKey: ['/api/detections', { sessionId }],
  });
  
  if (!detections || detections.length === 0) {
    return <div className="text-sm text-muted-foreground">No minerals detected</div>;
  }
  
  // Get unique mineral names
  const mineralNames = [...new Set(detections.map(d => d.mineral?.name || ''))];
  
  return (
    <div className="flex flex-wrap mb-2">
      {mineralNames.slice(0, 3).map((name, index) => (
        <span key={index} className={`mineral-tag bg-${getMineralColor(name)}/20 text-${getMineralColor(name)}`}>
          {name}
        </span>
      ))}
      {mineralNames.length > 3 && (
        <span className="mineral-tag bg-muted text-muted-foreground">
          +{mineralNames.length - 3} more
        </span>
      )}
    </div>
  );
}
