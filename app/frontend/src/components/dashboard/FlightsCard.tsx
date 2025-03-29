import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlightOption } from "@/types/travel";

interface FlightsCardProps {
  data?: FlightOption[];
  isLoading: boolean;
}

const FlightsCard = ({ data, isLoading }: FlightsCardProps) => {
  const [showAll, setShowAll] = useState(false);

  const groupedFlights = data?.reduce((acc: Record<number, FlightOption[]>, flight) => {
    if (!acc[flight.option]) acc[flight.option] = [];
    acc[flight.option].push(flight);
    return acc;
  }, {}) ?? {};

  const visibleOptions = showAll ? Object.entries(groupedFlights) : Object.entries(groupedFlights).slice(0, 1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">✈️ Flight Options</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading flights...</p>
        ) : visibleOptions.length === 0 ? (
          <p className="text-muted-foreground">No flight options available.</p>
        ) : (
          <>
            {visibleOptions.map(([optionKey, flights]) => (
              <div key={optionKey} className="mb-4 bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold mb-2">Option {optionKey}</p>
                {flights.map((flight, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-sm">
                      {flight.from} → {flight.to}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(flight.departure).toLocaleString()} → {new Date(flight.arrival).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Airline: {flight.airline} | Duration: {flight.duration}
                    </p>
                   
                  </div>
                ))}
                <p className="text-sm font-semibold text-right mb-2">
              Total Price: {flights[0].price}
            </p>
              </div>
            ))}
            

            {/* Toggle Button */}
            {Object.keys(groupedFlights).length > 1 && (
              <button
                className="text-blue-600 underline text-sm mt-2"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less Options" : "Show All Flight Options"}
              </button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightsCard;
