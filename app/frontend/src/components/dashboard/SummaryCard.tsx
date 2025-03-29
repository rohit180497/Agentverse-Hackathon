
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripSummary } from "@/types/travel";
import { ListChecks } from "lucide-react";

interface SummaryCardProps {
  data?: TripSummary;
  isLoading: boolean;
}

const SummaryCard = ({ data, isLoading }: SummaryCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-primary" />
          Trip Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-primary mb-2">Highlights</h4>
              <ul className="list-disc list-inside space-y-1">
                {data.highlights.map((highlight, index) => (
                  <li key={index} className="text-sm">{highlight}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-primary mb-2">Travel Tips</h4>
              <ul className="list-disc list-inside space-y-1">
                {data.tips.map((tip, index) => (
                  <li key={index} className="text-sm">{tip}</li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-accent rounded-md p-2">
                <h4 className="font-medium text-primary text-sm">Budget</h4>
                <p className="text-sm">{data.budget}</p>
              </div>
              <div className="bg-accent rounded-md p-2">
                <h4 className="font-medium text-primary text-sm">Best Time</h4>
                <p className="text-sm">{data.bestTimeToVisit}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Trip summary will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
