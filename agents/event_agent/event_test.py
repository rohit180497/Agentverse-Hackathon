from uagents import Agent, Context, Model
from typing import List, Optional
from dotenv import load_dotenv
import os

load_dotenv()

# -------------------- Models --------------------
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

# -------------------- Config --------------------
EVENT_AGENT_ADDRESS = "agent1qvmkshe4kn3ucfsecd9d703jqzqy858z5l2unn9qye3y6dyvc5ph20zmqch"
TICKETMASTER_API_KEY = "YOUR_TICKETMASTER_API_KEY"  
if not TICKETMASTER_API_KEY:
    raise EnvironmentError("❌ Please set TICKETMASTER_API_KEY in your .env file")

# -------------------- Test Agent --------------------
test_event_agent = Agent(
    name="EventTestAgent",
    port=8014,
    endpoint="http://127.0.0.1:8014/submit"
)

@test_event_agent.on_event("startup")
async def send_event_request(ctx: Context):
    ctx.logger.info("🎫 Sending event discovery request to EventAgent...")
    await ctx.send(EVENT_AGENT_ADDRESS, EventRequest(
        location="New York",
        start_date="2025-04-01",
        end_date="2025-04-05",
        api_key=TICKETMASTER_API_KEY
    ))

@test_event_agent.on_message(model=EventResponse)
async def handle_event_response(ctx: Context, sender: str, msg: EventResponse):
    ctx.logger.info(f"📍 Events in {msg.location}:")
    for i, event in enumerate(msg.events, 1):
        ctx.logger.info(f"{i}. {event.name} at {event.venue} on {event.date} [{event.category}]")
        if event.ticket_url:
            ctx.logger.info(f"🎟️ Ticket: {event.ticket_url}")

if __name__ == "__main__":
    test_event_agent.run()
