import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function FieldWorkTable() {
  // Fetch field work data - in a real app this would come from the API
  const { data: scans, isLoading } = useQuery({
    queryKey: ['/api/scans'],
  });
  
  // Placeholder field work for demonstration
  const placeholderFieldWork = [
    { 
      id: 1, 
      location: "Sierra Nevada Range", 
      site: "Ridge Exploration", 
      date: "Apr 12, 2023", 
      minerals: ["Iron", "Copper"], 
      confidence: 0.94, 
      status: "Completed" 
    },
    { 
      id: 2, 
      location: "Blue River Basin", 
      site: "Creek Bed", 
      date: "Apr 8, 2023", 
      minerals: ["Gold"], 
      confidence: 0.76, 
      status: "Completed" 
    },
    { 
      id: 3, 
      location: "Granite Canyon", 
      site: "Canyon Wall", 
      date: "Apr 3, 2023", 
      minerals: ["Silver", "Iron"], 
      confidence: 0.82, 
      status: "Analysis" 
    }
  ];
  
  const getMineralTag = (mineral: string) => {
    const tagClasses = {
      "Iron": "bg-primary/20 text-primary",
      "Gold": "bg-accent/20 text-accent",
      "Copper": "bg-secondary/20 text-secondary",
      "Silver": "bg-light-dark/20 text-light-dark",
      "default": "bg-dark/20 text-light-dark"
    };
    
    return tagClasses[mineral as keyof typeof tagClasses] || tagClasses.default;
  };
  
  const getStatusTag = (status: string) => {
    const statusClasses = {
      "Completed": "bg-secondary/20 text-secondary",
      "Analysis": "bg-accent/20 text-accent",
      "Pending": "bg-primary/20 text-primary",
      "default": "bg-dark/20 text-light-dark"
    };
    
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.default;
  };

  return (
    <Card className="overflow-hidden border-0">
      <CardHeader className="p-4 border-b border-dark-light flex justify-between items-center">
        <CardTitle className="font-semibold">Recent Field Work</CardTitle>
        <Button variant="link" className="text-primary text-sm p-0">View All</Button>
      </CardHeader>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full bg-dark-light" />
            <Skeleton className="h-16 w-full bg-dark-light" />
            <Skeleton className="h-16 w-full bg-dark-light" />
            <Skeleton className="h-16 w-full bg-dark-light" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-xs font-medium text-light-dark uppercase tracking-wider">Location</TableHead>
                <TableHead className="text-left text-xs font-medium text-light-dark uppercase tracking-wider">Date</TableHead>
                <TableHead className="text-left text-xs font-medium text-light-dark uppercase tracking-wider">Detections</TableHead>
                <TableHead className="text-left text-xs font-medium text-light-dark uppercase tracking-wider">Confidence</TableHead>
                <TableHead className="text-left text-xs font-medium text-light-dark uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-left text-xs font-medium text-light-dark uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(scans || placeholderFieldWork).map((work) => (
                <TableRow key={work.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">{work.location}</div>
                    <div className="text-xs text-light-dark">{work.site}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{work.date}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-wrap">
                      {work.minerals.map((mineral, index) => (
                        <span 
                          key={index} 
                          className={`mineral-tag ${getMineralTag(mineral)}`}
                        >
                          {mineral}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm font-medium">{Math.round(work.confidence * 100)}%</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusTag(work.status)}`}>
                      {work.status}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    <Button 
                      variant="link" 
                      className="text-primary hover:text-primary/80 font-medium p-0"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}
