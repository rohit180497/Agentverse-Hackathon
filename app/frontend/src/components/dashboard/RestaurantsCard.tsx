
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Restaurant } from "@/types/travel";
import { MapPin, Star, Utensils } from "lucide-react";

interface RestaurantsCardProps {
  data?: Restaurant[];
  isLoading: boolean;
}

const RestaurantsCard = ({ data, isLoading }: RestaurantsCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          Recommended Restaurants
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-muted rounded-md"></div>
            <div className="h-48 bg-muted rounded-md"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((restaurant) => (
              <div key={restaurant.id} className="rounded-md overflow-hidden border">
                <div className="relative h-40">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <h3 className="text-white font-semibold">{restaurant.name}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{restaurant.cuisine} · {restaurant.priceRange}</p>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    {restaurant.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Restaurant recommendations will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantsCard;
