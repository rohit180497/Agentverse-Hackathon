
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteInfo } from "@/types/travel";
import { MapPin } from "lucide-react";

interface RouteCardProps {
  data?: RouteInfo;
  isLoading: boolean;
}

const RouteCard = ({ data, isLoading }: RouteCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Route Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-40 bg-muted rounded-md"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ) : data ? (
          <div className="space-y-4">
            {data.map && (
              <div className="relative h-40 rounded-md overflow-hidden">
                <img 
                  src={data.map} 
                  alt="Route map" 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Distance:</span>
                <span className="font-medium">{data.distance}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{data.duration}</span>
              </p>
              {data.stops && data.stops.length > 0 && (
                <div>
                  <p className="text-muted-foreground">Stops:</p>
                  <ul className="list-disc list-inside">
                    {data.stops.map((stop, index) => (
                      <li key={index}>{stop}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Route information will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteCard;
