import os
import requests
from dotenv import load_dotenv
from uagents import Agent, Context, Protocol, Model
from typing import List, Optional
from datetime import datetime

# Load credentials from .env
load_dotenv()
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")

# ----------------- Models -----------------
class EventRequest(Model):
    location: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    api_key: str

class Event(Model):
    name: str
    venue: str
    date: str
    category: Optional[str]
    ticket_url: Optional[str]

class EventResponse(Model):
    location: str
    events: List[Event]

# ----------------- Agent Setup -----------------
event_agent = Agent(
    name="EventExplorerAgent",
    seed="eventagent123",
    endpoint="http://127.0.0.1:8003/submit",
    port=8003,
)

event_protocol = Protocol(name="EventSearchProtocol")

# ----------------- Helper Function -----------------
def to_zulu_format(date_str: str, end=False) -> str:
    return f"{date_str}T{'23:59:59' if end else '00:00:00'}Z"

# ----------------- Main Event Search Handler -----------------
@event_protocol.on_message(model=EventRequest)
async def handle_event(ctx: Context, sender: str, msg: EventRequest):
    ctx.logger.info(f"🎉 Searching events in {msg.location}")

    try:
        url = "https://app.ticketmaster.com/discovery/v2/events.json"
        params = {
            "apikey": msg.api_key,
            "city": msg.location,
            "size": 100,
            "sort": "date,asc"
        }

        if msg.start_date:
            params["startDateTime"] = to_zulu_format(msg.start_date)
        if msg.end_date:
            params["endDateTime"] = to_zulu_format(msg.end_date, end=True)

        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        events = []
        if "_embedded" not in data or "events" not in data["_embedded"]:
            await ctx.send(sender, EventResponse(location=msg.location, events=[]))
            return

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

        await ctx.send(sender, EventResponse(location=msg.location, events=events))

    except Exception as e:
        ctx.logger.error(f"EventExplorerAgent error: {e}")
        await ctx.send(sender, {"error": str(e)})

# Register Protocol
event_agent.include(event_protocol)

@event_agent.on_event("startup")
async def announce(ctx: Context):
    ctx.logger.info(f"🎟️ EventExplorerAgent is live at address: {ctx.agent.address}")

if __name__ == "__main__":
    event_agent.run()