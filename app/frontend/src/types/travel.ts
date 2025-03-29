
export interface TravelQuery {
  originCity: string;
  destinationCity: string;
  startDate: string;
  returnDate: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface PopularPlace {
  id: string;
  name: string;
  image: string;
  rating: number;
  address: string;
  description: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  priceRange: string;
  address: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  description: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}

export interface FlightInfo {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  stops?: string[];
  map?: string;
}

export interface TripSummary {
  highlights: string[];
  tips: string[];
  budget: string;
  bestTimeToVisit: string;
}

export interface TripItinerary {
  route: RouteInfo;
  weather: WeatherInfo;
  flights: FlightInfo[];
  popularPlaces: PopularPlace[];
  restaurants: Restaurant[];
  events: Event[];
  summary: TripSummary;
}
