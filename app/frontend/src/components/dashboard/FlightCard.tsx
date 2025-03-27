
import { Plane, Calendar, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

interface FlightCardProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
}

export const FlightCard = ({ origin, destination, departureDate, returnDate }: FlightCardProps) => {
  const displayOrigin = origin || "Boston";
  const displayDestination = destination || "New York";
  
  const [flights] = useState([
    {
      id: 1,
      airline: "Delta Airlines",
      flightNumber: "DL1234",
      departureTime: "08:30 AM",
      arrivalTime: "10:45 AM",
      price: 450,
      duration: "2h 15m",
      stops: 0
    },
    {
      id: 2,
      airline: "United Airlines",
      flightNumber: "UA5678",
      departureTime: "10:15 AM",
      arrivalTime: "12:45 PM",
      price: 385,
      duration: "2h 30m",
      stops: 0
    },
    {
      id: 3,
      airline: "American Airlines",
      flightNumber: "AA9012",
      departureTime: "12:30 PM",
      arrivalTime: "03:00 PM",
      price: 420,
      duration: "2h 30m",
      stops: 0
    },
    {
      id: 4,
      airline: "JetBlue",
      flightNumber: "B6345",
      departureTime: "03:45 PM",
      arrivalTime: "06:10 PM",
      price: 375,
      duration: "2h 25m",
      stops: 0
    }
  ]);

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
            <h4 className="text-xl font-semibold">{displayOrigin}</h4>
            <p className="text-gray-500 text-xs mt-1">{departureDate}</p>
          </div>
          
          <div className="flex-1 flex justify-center items-center px-4">
            <div className="h-[1px] flex-1 bg-gray-300"></div>
            <Plane className="mx-2 text-travel-primary rotate-90 w-5 h-5" />
            <div className="h-[1px] flex-1 bg-gray-300"></div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-500 text-xs">To</p>
            <h4 className="text-xl font-semibold">{displayDestination}</h4>
            <p className="text-gray-500 text-xs mt-1">{returnDate}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {flights.map((flight) => (
          <div key={flight.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{flight.airline}</p>
                <p className="text-xs text-gray-500">{flight.flightNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-travel-primary">${flight.price}</p>
                <p className="text-xs text-gray-500">Round Trip</p>
              </div>
            </div>
            <div className="flex justify-between mt-2 items-center">
              <div className="text-center">
                <p className="font-medium">{flight.departureTime}</p>
                <p className="text-xs text-gray-500">{displayOrigin}</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center mx-2">
                <p className="text-xs text-gray-500">{flight.duration}</p>
                <div className="w-full flex items-center">
                  <div className="h-[1px] flex-1 bg-gray-300"></div>
                  <ArrowRight className="mx-1 text-gray-400 w-3 h-3" />
                </div>
                <p className="text-xs text-gray-500">{flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop`}</p>
              </div>
              
              <div className="text-center">
                <p className="font-medium">{flight.arrivalTime}</p>
                <p className="text-xs text-gray-500">{displayDestination}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <button className="text-travel-primary hover:text-travel-accent text-sm font-medium transition-colors">
          View More Flights
        </button>
      </div>
    </div>
  );
};
