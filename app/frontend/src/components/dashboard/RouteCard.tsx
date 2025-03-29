import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Route } from "lucide-react";

interface RouteCardProps {
  data?: string;
  isLoading: boolean;
}

const RouteCard = ({ data, isLoading }: RouteCardProps) => {
  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="w-5 h-5" />
          Route Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            <span>Loading route information...</span>
          </div>
        ) : data ? (
          <p className="text-sm text-muted-foreground">{data}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No route data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteCard;
