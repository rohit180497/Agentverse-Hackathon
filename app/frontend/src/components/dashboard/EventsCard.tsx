
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/travel";
import { Calendar, MapPin } from "lucide-react";

interface EventsCardProps {
  data?: Event[];
  isLoading: boolean;
}

const EventsCard = ({ data, isLoading }: EventsCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-12 bg-muted rounded w-full"></div>
            <div className="h-12 bg-muted rounded w-full"></div>
            <div className="h-12 bg-muted rounded w-full"></div>
          </div>
        ) : data && data.length > 0 ? (
          <ul className="divide-y">
            {data.map((event) => (
              <li key={event.id} className="py-3">
                <div className="flex items-start gap-3">
                  <div className="bg-accent rounded-md p-2 text-center min-w-14">
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                    </p>
                    <p className="text-lg font-semibold">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      {event.venue}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-secondary px-2 py-0.5 rounded">
                      {event.category}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Local events will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsCard;
