import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanSession, Detection } from "@shared/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate, getMineralColor } from "@/lib/utils";

interface FieldWorkTableProps {
  limit?: number;
}

export default function FieldWorkTable({ limit = 5 }: FieldWorkTableProps) {
  const { data: scanSessions, isLoading: sessionsLoading } = useQuery<ScanSession[]>({
    queryKey: ['/api/scan-sessions'],
  });
  
  const { data: allDetections, isLoading: detectionsLoading } = useQuery<Detection[]>({
    queryKey: ['/api/detections'],
  });
  
  const isLoading = sessionsLoading || detectionsLoading;
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-4 border-b border-border flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Recent Field Work</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center text-muted-foreground">
          Loading field work data...
        </CardContent>
      </Card>
    );
  }
  
  if (!scanSessions || scanSessions.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-4 border-b border-border flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Recent Field Work</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center text-muted-foreground">
          No field work data available
        </CardContent>
      </Card>
    );
  }
  
  // Get detections for each session
  const sessionDetections = new Map<number, Detection[]>();
  if (allDetections) {
    allDetections.forEach(detection => {
      if (!sessionDetections.has(detection.sessionId)) {
        sessionDetections.set(detection.sessionId, []);
      }
      sessionDetections.get(detection.sessionId)?.push(detection);
    });
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 border-b border-border flex justify-between items-center">
        <CardTitle className="text-base font-semibold">Recent Field Work</CardTitle>
        <Button variant="link" className="text-primary text-sm p-0">View All</Button>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Detections</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanSessions.slice(0, limit).map((session) => {
              const detections = sessionDetections.get(session.id) || [];
              
              // Calculate average confidence
              const avgConfidence = detections.length 
                ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length
                : 0;
              
              // Get unique minerals
              const minerals = [...new Set(detections.map(d => d.mineral?.name || ''))];
              
              return (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="font-medium">{session.name}</div>
                    <div className="text-xs text-muted-foreground">{session.location}</div>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(session.timestamp)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {minerals.map((mineral, i) => (
                        <span key={i} className={`mineral-tag bg-${getMineralColor(mineral)}/20 text-${getMineralColor(mineral)}`}>
                          {mineral}
                        </span>
                      ))}
                      {minerals.length === 0 && (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {avgConfidence > 0 ? avgConfidence.toFixed(0) + '%' : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={session.status === 'completed' ? 'bg-secondary/20 text-secondary' : 'bg-accent/20 text-accent'}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="link" className="text-primary text-sm h-auto p-0">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
