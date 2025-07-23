import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    timeframe: string;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, change }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-muted-foreground text-sm mb-1">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        
        {change && (
          <div className={`text-xs ${change.isPositive ? 'text-secondary' : 'text-destructive'} mt-2`}>
            {change.isPositive ? (
              <ArrowUp className="inline h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="inline h-3 w-3 mr-1" />
            )}
            {Math.abs(change.value)}% from {change.timeframe}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
