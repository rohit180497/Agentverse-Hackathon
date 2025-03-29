import { Ticket, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

interface EventItem {
  name: string;
  venue: string;
  date: string;
  category: string;
  ticket_url: string;
}

interface EventsCardProps {
  destination: string;
}

export const EventsCard = ({ destination }: EventsCardProps) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events?destination=${destination}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: EventItem[] = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
          setError(null);
        } else {
          setError("Sorry, no events found at the moment.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Unable to fetch events at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [destination]);

  const displayedEvents = showAll ? events : events.slice(0, 3);

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center mb-4">
        <div className="icon-container">
          <Ticket className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold ml-3">Upcoming Events</h3>
      </div>

      {loading ? (
        <div className="text-center text-sm text-gray-400 mb-4">Loading events...</div>
      ) : error ? (
        <div className="text-center text-sm text-red-500 mb-4">{error}</div>
      ) : (
        <div className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {displayedEvents.map((event, index) => (
            <a
              key={index}
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="bg-travel-secondary p-3 rounded-lg">
                <Ticket className="w-5 h-5 text-travel-primary" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{event.name}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {event.category}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-gray-500 text-xs flex items-center">
                    <Calendar className="w-3 h-3 mr-1 inline" />
                    {event.date}
                  </p>
                  <p className="text-gray-500 text-xs flex items-center">
                    <MapPin className="w-3 h-3 mr-1 inline" />
                    {event.venue}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          className="text-travel-primary hover:text-travel-accent text-sm font-medium transition-colors flex items-center"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="ml-1 w-4 h-4" />
            </>
          ) : (
            <>
              View More Events <ChevronDown className="ml-1 w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
