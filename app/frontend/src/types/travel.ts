// src/types/travel.ts

export interface TravelQuery {
  originCity: string;
  destinationCity: string;
  startDate: string;
  returnDate: string;
}

export interface TripItinerary {
  route: string;
  weather: WeatherData;
  flights: FlightOption[];
  explore: ExplorePlace[];
  food: Restaurant[];
  events: EventData[];
  summary: string;
  source: string;
  destination:string;
  startDate: string;
  returnDate: string;
}

export interface WeatherData {
  source_weather: WeatherInfo;
  destination_weather: WeatherInfo;
}

export interface WeatherInfo {
  city: string;
  date: string;
  temperature: string;
  condition: string;
  wind_speed: string;
  humidity: string;
}

export interface FlightOption {
  option: number;
  price: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  airline: string;
  duration: string;
}

export interface ExplorePlace {
  name: string;
  address: string;
  rating: number;
  total_ratings: number;
  photo_url: string;
  location: {
    lat: number;
    lng: number;
  };
  types: string[];
}

export interface Restaurant {
  name: string;
  address: string;
  rating: number;
  total_ratings?: number;
  photo_url: string;
  types: string[];
}

export interface EventData {
  name: string;
  venue: string;
  date: string;
  category: string | null;
  ticket_url: string | null;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}
