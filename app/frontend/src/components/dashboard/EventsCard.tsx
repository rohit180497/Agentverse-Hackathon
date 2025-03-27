
import { Ticket, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface EventsCardProps {
  destination: string;
}

export const EventsCard = ({ destination }: EventsCardProps) => {
  const [showAll, setShowAll] = useState(false);
  const [events] = useState([
    {
      id: 1,
      name: "Broadway Show - The Lion King",
      date: "April 15, 2023",
      category: "Theater",
      venue: "Minskoff Theatre",
      url: "#"
    },
    {
      id: 2,
      name: "New York Philharmonic",
      date: "April 16, 2023",
      category: "Concert",
      venue: "Lincoln Center",
      url: "#"
    },
    {
      id: 3,
      name: "Yankees vs Red Sox",
      date: "April 17, 2023",
      category: "Sports",
      venue: "Yankee Stadium",
      url: "#"
    },
    {
      id: 4,
      name: "Metropolitan Opera - La Bohème",
      date: "April 18, 2023",
      category: "Opera",
      venue: "Metropolitan Opera House",
      url: "#"
    },
    {
      id: 5,
      name: "NYC Food Festival",
      date: "April 19, 2023",
      category: "Food",
      venue: "Bryant Park",
      url: "#"
    },
    {
      id: 6,
      name: "Art Exhibition - MoMA",
      date: "April 20, 2023",
      category: "Art",
      venue: "Museum of Modern Art",
      url: "#"
    },
    {
      id: 7,
      name: "Hamilton - Broadway Show",
      date: "April 21, 2023",
      category: "Theater",
      venue: "Richard Rodgers Theatre",
      url: "#"
    },
    {
      id: 8,
      name: "Central Park Concert Series",
      date: "April 22, 2023",
      category: "Music",
      venue: "Central Park",
      url: "#"
    },
    {
      id: 9,
      name: "Brooklyn Craft Beer Festival",
      date: "April 23, 2023",
      category: "Festival",
      venue: "Brooklyn Expo Center",
      url: "#"
    },
    {
      id: 10,
      name: "Knicks vs Nets",
      date: "April 24, 2023",
      category: "Sports",
      venue: "Madison Square Garden",
      url: "#"
    }
  ]);

  const displayedEvents = showAll ? events : events.slice(0, 3);

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center mb-4">
        <div className="icon-container">
          <Ticket className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold ml-3">Upcoming Events</h3>
      </div>
      
      <div className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-1">
        {displayedEvents.map((event) => (
          <div key={event.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
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
            <>View More Events <ChevronDown className="ml-1 w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
};
