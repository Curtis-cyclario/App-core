import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
}

export default function StatCard({ title, value, change }: StatCardProps) {
  return (
    <Card className="bg-dark-lighter">
      <CardContent className="p-4">
        <div className="text-light-dark text-sm mb-1">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        
        {change && (
          <div className={`text-xs ${change.type === "increase" ? "text-secondary" : "text-red-500"} mt-2 flex items-center`}>
            {change.type === "increase" ? (
              <ArrowUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <ArrowUpIcon className="mr-1 h-3 w-3 transform rotate-180" />
            )}
            {change.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
