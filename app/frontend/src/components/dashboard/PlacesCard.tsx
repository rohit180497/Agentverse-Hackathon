
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PopularPlace } from "@/types/travel";
import { MapPin, Star } from "lucide-react";

interface PlacesCardProps {
  data?: PopularPlace[];
  isLoading: boolean;
}

const PlacesCard = ({ data, isLoading }: PlacesCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Popular Places
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-muted rounded-md"></div>
            <div className="h-48 bg-muted rounded-md"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((place) => (
              <div key={place.id} className="rounded-md overflow-hidden border">
                <div className="relative h-48">
                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="text-white font-semibold text-lg">{place.name}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{place.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    {place.address}
                  </p>
                  <p className="mt-2 text-sm">{place.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Popular places will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlacesCard;
