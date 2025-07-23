import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import * as d3 from "d3";

type TimeFrame = "daily" | "weekly" | "monthly";

export default function DetectionAnalysisChart() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("weekly");
  const chartRef = useRef<HTMLDivElement>(null);
  
  // This would fetch real detection data in a production app
  const { data, isLoading } = useQuery({
    queryKey: ['/api/minerals'],
  });
  
  // Example chart data
  const chartData = {
    daily: [
      { name: "Iron", value: 42.3 },
      { name: "Gold", value: 18.7 },
      { name: "Others", value: 39.0 }
    ],
    weekly: [
      { name: "Iron", value: 45.6 },
      { name: "Gold", value: 16.2 },
      { name: "Others", value: 38.2 }
    ],
    monthly: [
      { name: "Iron", value: 48.1 },
      { name: "Gold", value: 15.5 },
      { name: "Others", value: 36.4 }
    ]
  };
  
  useEffect(() => {
    if (!chartRef.current || isLoading) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();
    
    // Set up dimensions
    const width = chartRef.current.clientWidth;
    const height = 180;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Sample data
    const data = chartData[timeFrame];
    
    // Colors
    const colors = ["#2563eb", "#f59e0b", "#10b981"];
    
    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.3);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);
    
    // Draw bars
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name) || 0)
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight - y(d.value))
      .attr("fill", (d, i) => colors[i % colors.length]);
    
    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "#9ca3af")
      .style("font-size", "12px");
    
    // Add y-axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .selectAll("text")
      .attr("fill", "#9ca3af")
      .style("font-size", "12px");
    
    // Style axis lines
    svg.selectAll(".domain, .tick line")
      .attr("stroke", "#374151");
    
  }, [timeFrame, isLoading]);

  return (
    <Card className="flex-1 overflow-hidden flex flex-col border-0">
      <CardHeader className="p-4 border-b border-dark-light flex justify-between items-center">
        <CardTitle className="font-semibold">Detection Analysis</CardTitle>
        <div className="flex">
          <Button
            variant={timeFrame === "daily" ? "default" : "outline"}
            size="sm"
            className="text-xs mr-2"
            onClick={() => setTimeFrame("daily")}
          >
            Daily
          </Button>
          <Button
            variant={timeFrame === "weekly" ? "default" : "outline"}
            size="sm"
            className="text-xs mr-2"
            onClick={() => setTimeFrame("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={timeFrame === "monthly" ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setTimeFrame("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        {isLoading ? (
          <Skeleton className="h-[180px] w-full bg-dark-light" />
        ) : (
          <div className="chart-container" ref={chartRef}></div>
        )}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {chartData[timeFrame].map((item, index) => (
            <div key={index} className="bg-dark-light rounded p-2">
              <div className="text-xs text-light-dark">{item.name}</div>
              <div className="font-medium">{item.value}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
