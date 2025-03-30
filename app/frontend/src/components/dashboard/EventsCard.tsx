import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventData } from "@/types/travel";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import dayjs from "dayjs";

interface EventsCardProps {
  data?: EventData[];
  isLoading: boolean;
}

const EventsCard = ({ data, isLoading }: EventsCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[400px] pr-2">
  {isLoading ? (
    <div className="animate-pulse space-y-2">
      <div className="h-12 bg-muted rounded w-full"></div>
      <div className="h-12 bg-muted rounded w-full"></div>
      <div className="h-12 bg-muted rounded w-full"></div>
    </div>
  ) : data && data.length > 0 ? (
    <ul className="divide-y pr-1">
      {data.map((event, idx) => (
        <li key={idx} className="py-3">
          <div className="flex items-start gap-3">
            <div className="bg-accent rounded-md p-2 text-center min-w-14">
              <p className="text-xs text-muted-foreground">{dayjs(event.date).format("MMM")}</p>
              <p className="text-lg font-semibold">{dayjs(event.date).format("D")}</p>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{event.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                {event.venue}
              </p>
              {event.category && (
                <span className="inline-block mt-1 text-xs bg-secondary px-2 py-0.5 rounded">
                  {event.category}
                </span>
              )}
              {event.ticket_url && (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  Buy Tickets <ExternalLink className="w-3 h-3" />
                </a>
              )}
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
