
import React from "react";
import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Place {
  name: string;
  image: string;
  rating: number;
  address: string;
}

interface ResultCardProps {
  title: string;
  content?: string;
  description?: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  type?: "normal" | "places";
  places?: Place[];
  delay?: number;
  gridClasses?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  content,
  description,
  icon,
  iconColor,
  bgColor,
  type = "normal",
  places = [],
  delay = 0,
  gridClasses = "",
}) => {
  const animationStyle = {
    animationDelay: `${delay}s`,
    animationFillMode: "forwards",
  };

  if (type === "places") {
    return (
      <div className={cn("glass-card opacity-0 animate-fade-in", gridClasses)} style={animationStyle}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("p-2 rounded-full", bgColor, iconColor)}>
              {icon}
            </div>
            <h3 className="text-xl font-medium">{title}</h3>
          </div>
          
          <div className="mt-5">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {places.map((place, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 h-full">
                      <div className="h-40 relative overflow-hidden">
                        <img 
                          src={place.image} 
                          alt={place.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Star className="w-3 h-3 text-amber-500 mr-1 fill-amber-500" />
                          {place.rating}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium mb-1 line-clamp-1">{place.name}</h4>
                        <div className="flex items-start text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{place.address}</span>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-4">
                <CarouselPrevious className="static translate-y-0 h-8 w-8" />
                <CarouselNext className="static translate-y-0 h-8 w-8" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("glass-card opacity-0 animate-fade-in", gridClasses)} style={animationStyle}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2 rounded-full", bgColor, iconColor)}>
            {icon}
          </div>
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        
        {content && (
          <p className="text-xl font-medium mb-2">{content}</p>
        )}
        
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
