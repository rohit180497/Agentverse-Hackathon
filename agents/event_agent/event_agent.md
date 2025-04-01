# Event Explorer Agent

![tag : innovation-lab](https://img.shields.io/badge/innovation--lab-3D8BD3) ![tag : events](https://img.shields.io/badge/events-purple) ![tag : travel](https://img.shields.io/badge/travel-orange) ![tag : ticketmaster](https://img.shields.io/badge/ticketmaster-lightgrey) ![tag : mobility](https://img.shields.io/badge/mobility-yellow) ![tag : entertainment](https://img.shields.io/badge/entertainment-blue)

**Domain:** Travel / Mobility / Entertainment  
**Agent Type:** Specialized AI Agent for Event Discovery  
**Status:** Public and Live on Agentverse

---

## Overview
`EventAgent` is a smart AI agent that provides upcoming events for a specific city and date range using the **Ticketmaster Discovery API**. This agent is useful for travel planners, event seekers, and local guides.

Given a city and optional travel dates, the agent returns:
- Top events with name, venue, and category
- Event dates
- Ticket booking links

---

## Input Format
Send an `EventRequest` model:
```python
class EventRequest(Model):
    location: str            # City name (e.g., New York)
    start_date: Optional[str] = None  # Format: YYYY-MM-DD
    end_date: Optional[str] = None    # Format: YYYY-MM-DD
    api_key: str            # Your Ticketmaster API Key
```

### Example Input
```python
EventRequest(
    location="New York",
    start_date="2025-04-01",
    end_date="2025-04-05",
    api_key="<YOUR_TICKETMASTER_API_KEY>"
)
```

---

## Output Format
Agent replies with an `EventResponse` model:
```python
class EventResponse(Model):
    location: str
    events: List[Event]

class Event(Model):
    name: str
    venue: str
    date: str
    category: Optional[str]
    ticket_url: Optional[str]
```

### Sample Output
```
87. Just In Time at Circle In The Square Theatre on 2025-04-01 [Arts & Theatre]
🎟️ Ticket: https://www.ticketmaster.com/just-in-time-new-york-new-york-04-01-2025/event/Z1r9uZruZqGZ17P9r9

88. SMASH at Imperial Theatre on 2025-04-01 [Arts & Theatre]
🎟️ Ticket: https://www.ticketmaster.com/smash-new-york-new-york-04-01-2025/event/Z1r9uZruZqGZ17Pb-_

... up to 100 events
```

---

## How to Use This Agent

### 1. Install Requirements
```bash
pip install uagents requests python-dotenv
```

### 2. Get Your Ticketmaster API Key
- Visit: [https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
- Log in or sign up
- Go to **My Apps** and create an app to get your **API key**
- Store it in a `.env` file:
  ```env
  TICKETMASTER_API_KEY=your_actual_api_key
  ```

### 3. Create a Blank Agent to Test This Agent
```python
from uagents import Agent, Context, Model
from typing import List, Optional
from dotenv import load_dotenv
import os

load_dotenv()

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

EVENT_AGENT_ADDRESS = "agent1qvmkshe4kn3ucfsecd9d703jqzqy858z5l2unn9qye3y6dyvc5ph20zmqch"
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")

agent = Agent(name="EventTestAgent", port=8014, endpoint="http://127.0.0.1:8014/submit")

@agent.on_event("startup")
async def startup(ctx: Context):
    await ctx.send(EVENT_AGENT_ADDRESS, EventRequest(
        location="New York",
        start_date="2025-04-01",
        end_date="2025-04-05",
        api_key=TICKETMASTER_API_KEY
    ))

@agent.on_message(model=EventResponse)
async def handle_response(ctx: Context, sender: str, msg: EventResponse):
    for i, event in enumerate(msg.events, 1):
        ctx.logger.info(f"{i}. {event.name} at {event.venue} on {event.date} [{event.category}]")
        if event.ticket_url:
            ctx.logger.info(f"🎟️ Ticket: {event.ticket_url}")

if __name__ == "__main__":
    agent.run()
```

---

## Notes
- This agent uses Ticketmaster Discovery API v2.
- Handles date-based filtering and returns sorted events.
- Works best for popular cities like New York, Boston, etc.
- Results limited to the first 100 events.

---

## Source Code
[GitHub Project](https://github.com/rohit180497/Agentverse-Hackathon/tree/main/agents/event_agent)

## Credits
Developed for the **Fetch.ai Global AI Agents League Hackathon**  
Built by: [Rohit Kosamkar](https://github.com/rohit180497)

