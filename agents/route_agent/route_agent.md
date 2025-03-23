# Google API Route Agent

![tag : innovation-lab](https://img.shields.io/badge/innovation--lab-3D8BD3) ![tag : travel](https://img.shields.io/badge/travel-orange) ![tag : google-maps](https://img.shields.io/badge/google--maps-blue) ![tag : route-planning](https://img.shields.io/badge/route--planning-green) ![tag : mobility](https://img.shields.io/badge/mobility-lightgrey) ![tag : transportation](https://img.shields.io/badge/transportation-yellow) ![tag : location-services](https://img.shields.io/badge/location--services-red)

**Domain:** Travel / Mobility / Infrastructure  
**Agent Type:** Specialized AI Agent for Route Planning  
**Status:** Public and Live on Agentverse

---

## Overview
`RouteAgent` is a smart AI agent that provides travel route insights between two geographic locations using the **Google Maps Routes API**.

Given a source and destination location (as names), it returns:
- Total driving distance (in meters)
- Estimated travel time
- Estimated fuel consumption (if available)
- Toll information (if applicable)
- Travel warnings
- Route labels
- A clean summary string

---

## Input Format
Send a `RouteRequest` model:
```python
class RouteRequest(BaseModel):
    source: str         # Name or address of the starting point
    destination: str    # Name or address of the destination
    api_key: str        # Your own Google Maps API Key
```

### Example Input:
```python
RouteRequest(
    source="Boston, MA",
    destination="New York, NY",
    api_key="<YOUR_GOOGLE_API_KEY>"
)
```

---

## Output Format
Agent replies with a `RouteResponse` model:
```python
class RouteResponse(BaseModel):
    source: str
    destination: str
    distance_meters: int
    duration: str
    fuel_estimate_liters: float | None = None
    toll_info: list | None = None
    route_labels: list | None = None
    warnings: list | None = None
    summary: str
```

### Example Output
```json
{
  "source": "Boston, MA",
  "destination": "New York, NY",
  "distance_meters": 344000,
  "duration": "12345s",
  "fuel_estimate_liters": 21.8,
  "toll_info": [],
  "route_labels": ["DEFAULT_ROUTE"],
  "warnings": ["This route has tolls.", "This route includes a highway."],
  "summary": "Route from Boston, MA to New York, NY is 214.45 miles and takes approx 204.8 minutes."
}
```

---

## Usage Instructions

### 1. Install Dependencies
```bash
pip install uagents requests pydantic python-dotenv
```

### 2. Register and Start RouteAgent (optional)
This agent is already deployed. To use directly, proceed to step 3.

### 3. Send a Request From Another Agent
Use the following minimal agent to test:
```python
from uagents import Agent, Context
from pydantic import BaseModel

class RouteRequest(BaseModel):
    source: str
    destination: str
    api_key: str

class RouteResponse(BaseModel):
    source: str
    destination: str
    distance_meters: int
    duration: str
    fuel_estimate_liters: float | None = None
    toll_info: list | None = None
    route_labels: list | None = None
    warnings: list | None = None
    summary: str

ROUTE_AGENT_ADDRESS = "agent1qfetzztsmf373m7qa4x6l5mjveykecm87cu9m7myaxd7ukp0rwrjkkax9wt"

agent = Agent(name="TestAgent")

@agent.on_event("startup")
async def trigger(ctx: Context):
    await ctx.send(ROUTE_AGENT_ADDRESS, RouteRequest(
        source="Boston, MA",
        destination="New York, NY",
        api_key="<YOUR_GOOGLE_API_KEY>"
    ))

@agent.on_message(model=RouteResponse)
async def handle(ctx: Context, sender: str, msg: RouteResponse):
    ctx.logger.info(msg.model_dump_json(indent=2))

agent.run()
```

---

## Notes
- Make sure you provide your own **Google Maps API key**.
- Distance is returned in **meters**; converted to **miles** in summary.
- Fuel info and tolls are only available in some countries/regions.
- Perfect for chaining with itinerary agents, EV planning agents, cost estimators, etc.

---

## Source Code
[GitHub Project](https://github.com/rohit180497/Agentverse-Hackathon/tree/main/agents/route_agent)

## Credits
Developed for the **Fetch.ai Global AI Agents League Hackathon**  
Built by: [Rohit Kosamkar](https://github.com/rohit180497)

---

## Contribute
Have suggestions, feature ideas, or improvements? Feel free to fork the project, submit pull requests, or open issues.  
We welcome all contributions and feedback to make this agent even better.

Let's build the agentverse together!

