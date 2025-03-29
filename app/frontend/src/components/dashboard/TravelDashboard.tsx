
import { TravelQuery, TripItinerary } from "@/types/travel";
import RouteCard from "./RouteCard";
import WeatherCard from "./WeatherCard";
import FlightsCard from "./FlightsCard";
import PlacesCard from "./PlacesCard";
import RestaurantsCard from "./RestaurantsCard";
import EventsCard from "./EventsCard";
import SummaryCard from "./SummaryCard";

interface TravelDashboardProps {
  query: TravelQuery;
  data?: TripItinerary;
  isLoading: boolean;
}

const TravelDashboard = ({ query, data, isLoading }: TravelDashboardProps) => {
  if (!query) return null;

  return (
    <div className="dashboard-container space-y-6 mx-auto max-w-6xl">
      <div className="travel-gradient text-white rounded-lg p-4 text-center">
        <h2 className="text-xl font-semibold">
          Your Trip from {query.originCity} to {query.destinationCity}
        </h2>
        <p className="text-white/80">
          {new Date(query.startDate).toLocaleDateString()} - {new Date(query.returnDate).toLocaleDateString()}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RouteCard data={data?.route} isLoading={isLoading} />
        <WeatherCard data={data?.weather} isLoading={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <FlightsCard data={data?.flights} isLoading={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <PlacesCard data={data?.popularPlaces} isLoading={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <RestaurantsCard data={data?.restaurants} isLoading={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EventsCard data={data?.events} isLoading={isLoading} />
        <SummaryCard data={data?.summary} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default TravelDashboard;
