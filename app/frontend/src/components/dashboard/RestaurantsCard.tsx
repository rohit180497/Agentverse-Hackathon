import { Restaurant } from "@/types/travel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, Star } from "lucide-react";

interface RestaurantsCardProps {
  data?: Restaurant[];
  isLoading: boolean;
}

const RestaurantsCard = ({ data, isLoading }: RestaurantsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-primary" />
          Best Restaurants
        </CardTitle>
      </CardHeader>

      <CardContent className="relative overflow-x-auto">
        {isLoading ? (
          <div className="flex gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[180px] h-52 bg-muted rounded-lg"></div>
            ))}
          </div>
        ) : data?.length ? (
          <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2">
            {data.map((restaurant, i) => (
              <div
                key={i}
                className="min-w-[200px] max-w-[200px] bg-white rounded-xl shadow border"
              >
                <img
                  src={restaurant.photo_url}
                  alt={restaurant.name}
                  className="w-full h-32 object-cover rounded-t-xl"
                />
                <div className="p-2">
                  <h4 className="text-sm font-semibold truncate">{restaurant.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {restaurant.address}
                  </p>
                  <div className="flex items-center text-sm mt-1 gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {restaurant.rating}
                    <span className="text-xs text-muted-foreground">
                      ({restaurant.total_ratings ?? "N/A"})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No restaurant data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantsCard;
