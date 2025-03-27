
import { Star, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PlacesCardProps {
  destination: string;
}

export const PlacesCard = ({ destination }: PlacesCardProps) => {
  const [showAll, setShowAll] = useState(false);
  const [places] = useState([
    {
      id: 1,
      name: "Central Park",
      image: "https://images.unsplash.com/photo-1615920606214-6428b3324c74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      rating: 4.8,
      location: "Central Park, New York, NY"
    },
    {
      id: 2,
      name: "Empire State Building",
      image: "https://images.unsplash.com/photo-1555109307-f99f120d76b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80",
      rating: 4.7,
      location: "350 5th Ave, New York, NY 10118"
    },
    {
      id: 3,
      name: "Times Square",
      image: "https://images.unsplash.com/photo-1616566854359-06fe965190f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      rating: 4.6,
      location: "Times Square, New York, NY"
    },
    {
      id: 4,
      name: "Statue of Liberty",
      image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1799&q=80",
      rating: 4.8,
      location: "New York, NY 10004"
    },
    {
      id: 5,
      name: "Brooklyn Bridge",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      rating: 4.7,
      location: "Brooklyn Bridge, New York, NY"
    },
    {
      id: 6,
      name: "The Metropolitan Museum of Art",
      image: "https://images.unsplash.com/photo-1629205933076-e0f64595e8c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      rating: 4.9,
      location: "1000 5th Ave, New York, NY 10028"
    },
    {
      id: 7,
      name: "One World Trade Center",
      image: "https://images.unsplash.com/photo-1598212910244-beffde77697a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      rating: 4.6,
      location: "One World Trade Center, New York, NY"
    },
    {
      id: 8,
      name: "High Line",
      image: "https://images.unsplash.com/photo-1558442074-3c19857bc1dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      rating: 4.7,
      location: "The High Line, New York, NY"
    }
  ]);

  const displayedPlaces = showAll ? places : places.slice(0, 4);

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="icon-container">
            <Star className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold ml-3">Popular Places</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedPlaces.map((place) => (
          <div key={place.id} className="info-card h-full group">
            <div className="relative h-40 overflow-hidden">
              <img 
                src={place.image} 
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-xs font-medium flex items-center">
                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                {place.rating}
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-900">{place.name}</h4>
              <p className="text-gray-500 text-xs mt-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1 inline" /> {place.location}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <button 
          className="text-travel-primary hover:text-travel-accent text-sm font-medium transition-colors flex items-center"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></>
          ) : (
            <>View More Places <ChevronDown className="ml-1 w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
};
