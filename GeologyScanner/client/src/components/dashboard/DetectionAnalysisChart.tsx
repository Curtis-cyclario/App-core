import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Detection } from "@shared/schema";
import { getMineralColor } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

type ChartMode = "daily" | "weekly" | "monthly";

export default function DetectionAnalysisChart() {
  const { toast } = useToast();
  const [mode, setMode] = useState<ChartMode>("weekly");
  
  const { data: detections, isLoading } = useQuery<Detection[]>({
    queryKey: ['/api/detections'],
  });
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!detections) return;
    
    // Process data for charts
    try {
      // Group detections by mineral
      const mineralCounts: Record<string, number> = {};
      detections.forEach(detection => {
        const mineralName = detection.mineral?.name || 'Unknown';
        mineralCounts[mineralName] = (mineralCounts[mineralName] || 0) + 1;
      });
      
      // Calculate percentages for pie chart
      const total = Object.values(mineralCounts).reduce((a, b) => a + b, 0);
      const pieChartData = Object.entries(mineralCounts).map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100 * 10) / 10 // Round to 1 decimal place
      }));
      
      setPieData(pieChartData);
      
      // Create time series data
      const now = new Date();
      let timePoints: Date[];
      
      if (mode === "daily") {
        timePoints = Array.from({ length: 24 }, (_, i) => {
          const date = new Date(now);
          date.setHours(now.getHours() - 23 + i, 0, 0, 0);
          return date;
        });
      } else if (mode === "weekly") {
        timePoints = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - 6 + i);
          date.setHours(0, 0, 0, 0);
          return date;
        });
      } else {
        timePoints = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - 29 + i);
          date.setHours(0, 0, 0, 0);
          return date;
        });
      }
      
      // Count detections in each time period
      const timeSeriesData = timePoints.map(date => {
        const counts: Record<string, number> = {};
        
        // Initialize with 0 count for each mineral
        Object.keys(mineralCounts).forEach(mineral => {
          counts[mineral] = 0;
        });
        
        // Count detections in this time period
        detections.forEach(detection => {
          const detectionTime = new Date(detection.timestamp);
          
          if (mode === "daily" && 
              detectionTime.getDate() === date.getDate() &&
              detectionTime.getHours() === date.getHours()) {
            counts[detection.mineral?.name || 'Unknown']++;
          } else if ((mode === "weekly" || mode === "monthly") && 
                     detectionTime.getDate() === date.getDate() &&
                     detectionTime.getMonth() === date.getMonth()) {
            counts[detection.mineral?.name || 'Unknown']++;
          }
        });
        
        return {
          date: date.toISOString(),
          ...counts,
          // Add a formatted label for display
          label: mode === "daily" 
            ? date.getHours() + ':00' 
            : date.getDate() + '/' + (date.getMonth() + 1)
        };
      });
      
      setChartData(timeSeriesData);
    } catch (error) {
      console.error("Error processing chart data:", error);
      toast({
        title: "Chart Error",
        description: "There was a problem processing the chart data",
        variant: "destructive"
      });
    }
  }, [detections, mode, toast]);
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden flex flex-col">
        <CardHeader className="p-4 border-b border-border flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Detection Analysis</CardTitle>
          <div className="flex">
            <Button variant={mode === "daily" ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setMode("daily")}>
              Daily
            </Button>
            <Button variant={mode === "weekly" ? "default" : "outline"} size="sm" className="text-xs ml-2" onClick={() => setMode("weekly")}>
              Weekly
            </Button>
            <Button variant={mode === "monthly" ? "default" : "outline"} size="sm" className="text-xs ml-2" onClick={() => setMode("monthly")}>
              Monthly
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 text-center text-muted-foreground">
          Loading detection analysis...
        </CardContent>
      </Card>
    );
  }
  
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
  
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-4 border-b border-border flex justify-between items-center">
        <CardTitle className="text-base font-semibold">Detection Analysis</CardTitle>
        <div className="flex">
          <Button variant={mode === "daily" ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setMode("daily")}>
            Daily
          </Button>
          <Button variant={mode === "weekly" ? "default" : "outline"} size="sm" className="text-xs ml-2" onClick={() => setMode("weekly")}>
            Weekly
          </Button>
          <Button variant={mode === "monthly" ? "default" : "outline"} size="sm" className="text-xs ml-2" onClick={() => setMode("monthly")}>
            Monthly
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-1">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8' }} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#2d3748' }} 
                labelStyle={{ color: '#f3f4f6' }}
              />
              {pieData.map((entry, index) => (
                <Line 
                  key={entry.name}
                  type="monotone" 
                  dataKey={entry.name} 
                  stroke={COLORS[index % COLORS.length]} 
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-2">
          {pieData.slice(0, 3).map((entry, index) => (
            <div key={index} className="bg-muted rounded p-2">
              <div className="text-xs text-muted-foreground">{entry.name}</div>
              <div className="font-medium">{entry.value}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
