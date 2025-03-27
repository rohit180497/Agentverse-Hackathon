
import { useEffect, useState } from "react";
import { WeatherCard } from "./dashboard/WeatherCard";
import { RouteCard } from "./dashboard/RouteCard";
import { FlightCard } from "./dashboard/FlightCard";
import { PlacesCard } from "./dashboard/PlacesCard";
import { RestaurantsCard } from "./dashboard/RestaurantsCard";
import { EventsCard } from "./dashboard/EventsCard";

interface DashboardProps {
  tripInfo: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    travelers: number;
  };
}

export const Dashboard = ({ tripInfo }: DashboardProps) => {
  const [loadingStates, setLoadingStates] = useState({
    weather: true,
    route: true,
    flights: true,
    places: true,
    restaurants: true,
    events: true
  });

  // Simulate sequential loading of dashboard cards
  useEffect(() => {
    const loadingTimers = [
      { key: 'weather', delay: 400 },
      { key: 'route', delay: 800 },
      { key: 'flights', delay: 1200 },
      { key: 'places', delay: 1600 },
      { key: 'restaurants', delay: 2000 },
      { key: 'events', delay: 2400 }
    ];

    loadingTimers.forEach(({ key, delay }) => {
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }, delay);
    });

    return () => {
      // Clear any pending timers if component unmounts
      loadingTimers.forEach(({ key, delay }) => {
        clearTimeout(delay);
      });
    };
  }, []);

  return (
    <div className="h-screen overflow-y-auto p-6 scrollbar-none">
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="text-xl font-medium text-travel-primary">TRAVEL PLAN</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`animate-scale-in ${loadingStates.route ? 'opacity-0' : 'opacity-100'}`} style={{transitionDelay: '100ms'}}>
          <RouteCard origin={tripInfo.origin} destination={tripInfo.destination} />
        </div>
        
        <div className={`animate-scale-in ${loadingStates.weather ? 'opacity-0' : 'opacity-100'}`} style={{transitionDelay: '200ms'}}>
          <WeatherCard destination={tripInfo.destination} />
        </div>
      </div>
      
      <div className={`mb-6 animate-scale-in ${loadingStates.places ? 'opacity-0' : 'opacity-100'}`} style={{transitionDelay: '400ms'}}>
        <PlacesCard destination={tripInfo.destination} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`animate-scale-in ${loadingStates.restaurants ? 'opacity-0' : 'opacity-100'}`} style={{transitionDelay: '500ms'}}>
          <RestaurantsCard destination={tripInfo.destination} />
        </div>
        
        <div className={`animate-scale-in ${loadingStates.events ? 'opacity-0' : 'opacity-100'}`} style={{transitionDelay: '600ms'}}>
          <EventsCard destination={tripInfo.destination} />
        </div>
      </div>
      
      <div className={`animate-scale-in h-auto ${loadingStates.flights ? 'opacity-0' : 'opacity-100'}`} style={{transitionDelay: '300ms'}}>
        <FlightCard 
          origin={tripInfo.origin} 
          destination={tripInfo.destination}
          departureDate={tripInfo.departureDate}
          returnDate={tripInfo.returnDate}
        />
      </div>
    </div>
  );
};
