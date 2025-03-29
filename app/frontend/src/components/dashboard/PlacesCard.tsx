import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { TripItinerary } from "@/types/travel";
import { useRef } from "react";

interface PlacesCardProps {
  data?: TripItinerary["explore"];
  isLoading: boolean;
}

const PlacesCard = ({ data, isLoading }: PlacesCardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Popular Places to Explore
        </CardTitle>
        {data && data.length > 0 && (
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="hover:bg-muted p-1 rounded">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll("right")} className="hover:bg-muted p-1 rounded">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            <span>Loading places...</span>
          </div>
        ) : data && data.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          >
            {data.map((place, idx) => (
              <div
                key={idx}
                className="min-w-[250px] bg-muted rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={place.photo_url}
                  alt={place.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3 space-y-1">
                  <h3 className="font-medium text-base">{place.name}</h3>
                  <p className="text-xs text-muted-foreground">{place.address}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{place.rating}</span>
                    <span className="text-muted-foreground">({place.total_ratings})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No popular places found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PlacesCard;
