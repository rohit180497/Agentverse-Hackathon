
import { MapPin } from "lucide-react";

interface RouteCardProps {
  origin: string;
  destination: string;
}

export const RouteCard = ({ origin, destination }: RouteCardProps) => {
  const displayOrigin = origin || "Boston, USA";
  const displayDestination = destination || "New York, USA";

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center mb-4">
        <div className="icon-container">
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold ml-3">Travel Route</h3>
      </div>
      
      <div className="mt-2">
        <h4 className="text-xl font-semibold">{displayOrigin} to {displayDestination}</h4>
        <p className="text-gray-600 text-sm mt-1">Direct flight with one short layover</p>
      </div>
    </div>
  );
};
