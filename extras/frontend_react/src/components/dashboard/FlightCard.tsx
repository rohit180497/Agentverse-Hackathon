import { Plane, Calendar, Users, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface FlightCardProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
}

interface FlightSegment {
  price: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  airline: string;
  duration: string;
}

export const FlightCard = ({ origin, destination, departureDate, returnDate }: FlightCardProps) => {
  const [flightOptions, setFlightOptions] = useState<Record<string, FlightSegment[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: FlightSegment[] = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const grouped: Record<string, FlightSegment[]> = {};
          data.forEach(segment => {
            const key = segment.price;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(segment);
          });
          setFlightOptions(grouped);
          setError(null);
        } else {
          setError("Sorry, no flights available at the moment.");
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
        setError("Unable to fetch flight information at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, departureDate, returnDate]);

  return (
    <div className="dashboard-card">
      <div className="flex items-center mb-4">
        <div className="icon-container">
          <Plane className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold ml-3">Flight Information</h3>
      </div>

      <div className="bg-travel-secondary/20 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-gray-500 text-xs">From</p>
            <h4 className="text-xl font-semibold">{origin}</h4>
            <p className="text-gray-500 text-xs mt-1">{departureDate}</p>
          </div>

          <div className="flex-1 flex justify-center items-center px-4">
            <div className="h-[1px] flex-1 bg-gray-300"></div>
            <Plane className="mx-2 text-travel-primary rotate-90 w-5 h-5" />
            <div className="h-[1px] flex-1 bg-gray-300"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-xs">To</p>
            <h4 className="text-xl font-semibold">{destination}</h4>
            <p className="text-gray-500 text-xs mt-1">{returnDate}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-sm text-gray-400 mb-4">Loading flights...</div>
      ) : error ? (
        <div className="text-center text-sm text-red-500 mb-4">{error}</div>
      ) : (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {Object.entries(flightOptions).map(([price, segments], idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{segments[0].airline}</p>
                  <p className="text-xs text-gray-500">{segments[0].from} → {segments[segments.length - 1].to}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-travel-primary">{price}</p>
                  <p className="text-xs text-gray-500">Round Trip</p>
                </div>
              </div>

              {segments.map((seg, i) => (
                <div key={i} className="mt-2 flex justify-between items-center">
                  <div className="text-center">
                    <p className="font-medium">{new Date(seg.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-xs text-gray-500">{seg.from}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center mx-2">
                    <p className="text-xs text-gray-500">{seg.duration.replace("PT", "").toLowerCase()}</p>
                    <div className="w-full flex items-center">
                      <div className="h-[1px] flex-1 bg-gray-300"></div>
                      <ArrowRight className="mx-1 text-gray-400 w-3 h-3" />
                    </div>
                    <p className="text-xs text-gray-500">{seg.airline}</p>
                  </div>

                  <div className="text-center">
                    <p className="font-medium">{new Date(seg.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-xs text-gray-500">{seg.to}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button className="text-travel-primary hover:text-travel-accent text-sm font-medium transition-colors">
          View More Flights
        </button>
      </div>
    </div>
  );
};
// This component fetches flight information from an API and displays it in a card format.
// It shows the flight segments grouped by price, including airline, departure and arrival times, and duration.
// The component handles loading and error states, and allows the user to view more flight options if available.
// The flight information is displayed in a structured format, making it easy for users to compare different flight options.