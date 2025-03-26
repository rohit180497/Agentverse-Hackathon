import requests
from pydantic import BaseModel
from typing import List, Optional


class Event(BaseModel):
    name: str
    venue: str
    date: str
    category: Optional[str]
    ticket_url: Optional[str]


class EventResponse(BaseModel):
    location: str
    events: List[Event]


class EventAgent:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_events(self, location: str, start_date: str = None) -> dict:
        try:
            url = "https://app.ticketmaster.com/discovery/v2/events.json"
            params = {
                "apikey": self.api_key,
                "city": location,
                "size": 10,
                "sort": "date,asc"
            }

            if start_date:
                # ISO 8601 format with Zulu time for UTC
                params["startDateTime"] = f"{start_date}T00:00:00Z"

            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            if "_embedded" not in data or "events" not in data["_embedded"]:
                return {"error": f"No events found for {location}"}

            events = []
            for e in data["_embedded"]["events"]:
                name = e.get("name")
                venue = e["_embedded"]["venues"][0].get("name", "Unknown Venue")
                date = e["dates"]["start"].get("localDate", "Unknown Date")
                category = e["classifications"][0]["segment"]["name"] if "classifications" in e else None
                ticket_url = e.get("url")

                events.append(Event(
                    name=name,
                    venue=venue,
                    date=date,
                    category=category,
                    ticket_url=ticket_url
                ))

            return EventResponse(location=location, events=events).model_dump(mode="json")

        except Exception as e:
            return {"error": str(e)}

# if __name__ == "__main__":
#     import os
#     from dotenv import load_dotenv
#     load_dotenv()

#     API_KEY = os.getenv("TICKETMASTER_API_KEY")
#     agent = EventAgent(api_key=API_KEY)
    
#     result = agent.get_events("New York", start_date="2025-04-12")
#     print(result)
