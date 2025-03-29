
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlightInfo } from "@/types/travel";
import { Plane } from "lucide-react";

interface FlightsCardProps {
  data?: FlightInfo[];
  isLoading: boolean;
}

const FlightsCard = ({ data, isLoading }: FlightsCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary" />
          Flight Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded-md"></div>
            <div className="h-20 bg-muted rounded-md"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((flight, index) => (
              <div 
                key={index} 
                className="border rounded-md p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{flight.airline}</p>
                  <p className="text-sm text-muted-foreground">Flight {flight.flightNumber}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <p className="text-lg font-semibold">{flight.departureTime}</p>
                    <p className="text-sm text-muted-foreground">Departure</p>
                  </div>
                  <div className="flex-1 mx-2 border-t border-dashed relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                      {flight.duration}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{flight.arrivalTime}</p>
                    <p className="text-sm text-muted-foreground">Arrival</p>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <p className="text-primary font-semibold">${flight.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Flight information will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightsCard;
