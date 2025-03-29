
import { Plane, MapPin, Calendar, Users } from "lucide-react";

export const Header = () => {
  return (
    <header className="py-6 px-4 md:px-6 flex flex-col items-center justify-center">
      <div className="flex justify-center space-x-3 mb-2">
        <Plane className="w-5 h-5 text-travel-primary animate-float" />
        <MapPin className="w-5 h-5 text-travel-primary animate-float delay-100" />
        <Calendar className="w-5 h-5 text-travel-primary animate-float delay-200" />
        <Users className="w-5 h-5 text-travel-primary animate-float delay-300" />
      </div>
      <h1 className="text-3xl font-bold text-travel-primary mb-2 tracking-tight">
        TravelGenie
      </h1>
      <p className="text-sm text-gray-600">
        Your AI travel companion for perfect trips
      </p>
      <div className="h-1 w-16 bg-travel-primary mt-2 rounded-full"></div>
    </header>
  );
};
