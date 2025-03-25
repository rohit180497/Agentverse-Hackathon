import React, { useState } from "react";
import TravelForm from "@/components/TravelForm";
import Results from "@/components/Results";
import { MapPin, Plane, Calendar, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = (formData) => {
    setSearchParams(formData);
    setLoading(true);
    
    // Simulate API call to your backend
    setTimeout(() => {
      // This is where you would normally fetch real data from your backend
      const mockResults = {
        route: {
          title: "Travel Route",
          content: `${formData.origin} to ${formData.destination}`,
          description: "Direct flight with one short layover"
        },
        weather: {
          title: "Weather Forecast",
          content: "Sunny with occasional clouds",
          description: "Average temperature: 22°C (72°F)"
        },
        flight: {
          title: "Flight Information",
          content: "Multiple airlines available",
          description: "Starting from $450 round trip"
        },
        places: {
          title: "Popular Places",
          items: [
            { 
              name: "Central Park", 
              image: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?q=80&w=1470&auto=format&fit=crop",
              rating: 4.8,
              address: "Central Park, New York, NY"
            },
            { 
              name: "Empire State Building", 
              image: "https://images.unsplash.com/photo-1555109307-f7d9da25c244?q=80&w=1373&auto=format&fit=crop",
              rating: 4.7,
              address: "350 5th Ave, New York, NY 10118"
            },
            { 
              name: "Times Square", 
              image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1470&auto=format&fit=crop",
              rating: 4.6,
              address: "Times Square, New York, NY"
            },
            { 
              name: "Statue of Liberty", 
              image: "https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=1374&auto=format&fit=crop",
              rating: 4.8,
              address: "New York, NY 10004"
            },
            { 
              name: "Brooklyn Bridge", 
              image: "https://images.unsplash.com/photo-1512136146408-dab5f2ba8ebb?q=80&w=1374&auto=format&fit=crop",
              rating: 4.7,
              address: "Brooklyn Bridge, New York, NY 10038"
            },
            { 
              name: "High Line", 
              image: "https://images.unsplash.com/photo-1518322852257-1854e39ec89d?q=80&w=1374&auto=format&fit=crop",
              rating: 4.6,
              address: "New York, NY 10011"
            },
            { 
              name: "Metropolitan Museum of Art", 
              image: "https://images.unsplash.com/photo-1551523839-5a8987d5b355?q=80&w=1374&auto=format&fit=crop",
              rating: 4.9,
              address: "1000 5th Ave, New York, NY 10028"
            },
            { 
              name: "Grand Central Terminal", 
              image: "https://images.unsplash.com/photo-1515650458756-d85f568cd6ac?q=80&w=1374&auto=format&fit=crop",
              rating: 4.7,
              address: "89 E 42nd St, New York, NY 10017"
            }
          ]
        },
        hotels: {
          title: "Recommended Hotels",
          content: "Over 200 hotels available",
          description: "Starting from $120 per night"
        },
        cost: {
          title: "Estimated Trip Cost",
          content: `$${Math.floor(700 + Math.random() * 500)} per person`,
          description: "Including flights, average hotel stay, and meals"
        }
      };
      
      setResults(mockResults);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-travel-light to-blue-50">
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-blue-100/40 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="text-center mb-12 relative animate-fade-in">
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-full">
            <div className="flex justify-center space-x-2 opacity-50">
              <Plane className="w-6 h-6 text-travel-primary animate-float" style={{ animationDelay: '0.2s' }} />
              <MapPin className="w-5 h-5 text-travel-accent animate-float" style={{ animationDelay: '0.5s' }} />
              <Calendar className="w-5 h-5 text-travel-primary animate-float" style={{ animationDelay: '0.8s' }} />
              <Users className="w-5 h-5 text-travel-accent animate-float" style={{ animationDelay: '1.1s' }} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-travel-dark mb-3">
            TravelGenie
          </h1>
          <p className="text-xl text-travel-primary mb-4 font-light">
            Your AI travel companion for perfect trips
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-travel-primary to-travel-accent mx-auto rounded-full"></div>
        </header>

        <TravelForm onSearch={handleSearch} />
        
        {searchParams && (
          <div className="mt-16 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-travel-primary/20 to-transparent"></div>
            
            <div className="flex items-center justify-center my-8 text-travel-primary space-x-3">
              <div className="h-px w-12 bg-travel-primary/20"></div>
              <span className="text-sm font-medium uppercase tracking-wider">Travel Plan</span>
              <div className="h-px w-12 bg-travel-primary/20"></div>
            </div>
            
            <Results results={results} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
