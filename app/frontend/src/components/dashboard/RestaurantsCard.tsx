
import { Utensils, MapPin, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface RestaurantsCardProps {
  destination: string;
}

export const RestaurantsCard = ({ destination }: RestaurantsCardProps) => {
  const [showAll, setShowAll] = useState(false);
  const [restaurants] = useState([
    {
      id: 1,
      name: "Le Bernardin",
      type: "Fine Dining",
      rating: 4.9,
      price: "$$$$",
      location: "155 W 51st St, New York, NY"
    },
    {
      id: 2,
      name: "Katz's Delicatessen",
      type: "Deli",
      rating: 4.7,
      price: "$$",
      location: "205 E Houston St, New York, NY"
    },
    {
      id: 3,
      name: "Lombardi's Pizza",
      type: "Italian",
      rating: 4.6,
      price: "$$",
      location: "32 Spring St, New York, NY"
    },
    {
      id: 4,
      name: "Gramercy Tavern",
      type: "American",
      rating: 4.8,
      price: "$$$",
      location: "42 E 20th St, New York, NY"
    },
    {
      id: 5,
      name: "Eleven Madison Park",
      type: "Fine Dining",
      rating: 4.9,
      price: "$$$$",
      location: "11 Madison Ave, New York, NY"
    },
    {
      id: 6,
      name: "Russ & Daughters",
      type: "Deli",
      rating: 4.7,
      price: "$$",
      location: "179 E Houston St, New York, NY"
    },
    {
      id: 7,
      name: "Peter Luger",
      type: "Steakhouse",
      rating: 4.5,
      price: "$$$$",
      location: "178 Broadway, Brooklyn, NY"
    },
    {
      id: 8,
      name: "Di Fara Pizza",
      type: "Italian",
      rating: 4.6,
      price: "$$",
      location: "1424 Avenue J, Brooklyn, NY"
    },
    {
      id: 9,
      name: "Shake Shack",
      type: "Burgers",
      rating: 4.4,
      price: "$$",
      location: "Madison Square Park, New York, NY"
    },
    {
      id: 10,
      name: "Gray's Papaya",
      type: "Hot Dogs",
      rating: 4.3,
      price: "$",
      location: "2090 Broadway, New York, NY"
    }
  ]);

  const displayedRestaurants = showAll ? restaurants : restaurants.slice(0, 3);

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center mb-4">
        <div className="icon-container">
          <Utensils className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold ml-3">Popular Restaurants</h3>
      </div>
      
      <div className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-1">
        {displayedRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="bg-travel-secondary p-3 rounded-lg">
              <Utensils className="w-5 h-5 text-travel-primary" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">{restaurant.name}</h4>
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                  {restaurant.rating}
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-gray-500 text-xs flex items-center">
                  <span className="mr-2">{restaurant.type}</span>
                  <span className="text-gray-400">{restaurant.price}</span>
                </p>
                <p className="text-gray-500 text-xs flex items-center">
                  <MapPin className="w-3 h-3 mr-1 inline" /> 
                  {restaurant.location}
                </p>
              </div>
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
    </div>
  );
};
