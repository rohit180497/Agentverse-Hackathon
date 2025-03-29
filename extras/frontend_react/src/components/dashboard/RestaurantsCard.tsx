import { Utensils, MapPin, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Restaurant {
  name: string;
  photo_url: string;
  rating: number;
  address: string;
}

interface RestaurantsCardProps {
  destination: string;
}

export const RestaurantsCard = ({ destination }: RestaurantsCardProps) => {
  const [showAll, setShowAll] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`/api/food?destination=${destination}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setRestaurants(data);
        } else {
          setError("Sorry, we couldn't find any restaurants at the moment.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Sorry, unable to fetch the restaurants at this moment.");
      }
    };

    fetchRestaurants();
  }, [destination]);

  const displayedRestaurants = showAll ? restaurants : restaurants.slice(0, 4);

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="icon-container">
            <Utensils className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold ml-3">Popular Restaurants</h3>
        </div>
      </div>

      {error ? (
        <div className="text-center text-sm text-gray-500 mb-4">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedRestaurants.map((restaurant, index) => (
              <div key={index} className="info-card h-full group">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={restaurant.photo_url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    {restaurant.rating}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900">{restaurant.name}</h4>
                  <p className="text-gray-500 text-xs mt-1 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 inline" /> {restaurant.address}
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
                <>View More Restaurants <ChevronDown className="ml-1 w-4 h-4" /></>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
