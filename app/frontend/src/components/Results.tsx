
import React from "react";
import ResultCard from "./ResultCard";
import { MapPin, Cloud, Plane, Star, Building, DollarSign } from "lucide-react";

interface ResultsProps {
  results: any;
  loading: boolean;
}

const Results: React.FC<ResultsProps> = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card h-64 animate-pulse-slow">
            <div className="h-full p-6 flex flex-col">
              <div className="w-2/3 h-6 bg-gray-200 rounded-md mb-4"></div>
              <div className="w-1/2 h-5 bg-gray-100 rounded-md mb-3"></div>
              <div className="w-full h-4 bg-gray-100 rounded-md mb-2"></div>
              <div className="w-full h-4 bg-gray-100 rounded-md mb-2"></div>
              <div className="w-3/4 h-4 bg-gray-100 rounded-md"></div>
              <div className="mt-auto flex justify-end">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      <ResultCard 
        title={results.route.title}
        content={results.route.content}
        description={results.route.description}
        icon={<MapPin className="h-5 w-5" />}
        iconColor="text-teal-500"
        bgColor="bg-teal-50"
        delay={0}
      />
      
      <ResultCard 
        title={results.weather.title}
        content={results.weather.content}
        description={results.weather.description}
        icon={<Cloud className="h-5 w-5" />}
        iconColor="text-blue-500"
        bgColor="bg-blue-50"
        delay={0.1}
      />
      
      <ResultCard 
        title={results.flight.title}
        content={results.flight.content}
        description={results.flight.description}
        icon={<Plane className="h-5 w-5" />}
        iconColor="text-indigo-500"
        bgColor="bg-indigo-50"
        delay={0.2}
      />
      
      <ResultCard 
        title={results.places.title}
        type="places"
        places={results.places.items}
        icon={<Star className="h-5 w-5" />}
        iconColor="text-amber-500"
        bgColor="bg-amber-50"
        delay={0.3}
        gridClasses="col-span-1 md:col-span-2 lg:col-span-3"
      />
      
      <ResultCard 
        title={results.hotels.title}
        content={results.hotels.content}
        description={results.hotels.description}
        icon={<Building className="h-5 w-5" />}
        iconColor="text-fuchsia-500"
        bgColor="bg-fuchsia-50"
        delay={0.4}
      />
      
      <ResultCard 
        title={results.cost.title}
        content={results.cost.content}
        description={results.cost.description}
        icon={<DollarSign className="h-5 w-5" />}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-50"
        delay={0.5}
      />
    </div>
  );
};

export default Results;
