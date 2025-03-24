# 🌍 Google Places Explorer Agent

![tag : innovation-lab](https://img.shields.io/badge/innovation--lab-3D8BD3) ![tag : agentverse](https://img.shields.io/badge/agentverse-purple)
![tag : travel](https://img.shields.io/badge/travel-orange) ![tag : tourism](https://img.shields.io/badge/tourism-blue) ![tag : google-places](https://img.shields.io/badge/google--places-lightgrey) ![tag : explorer](https://img.shields.io/badge/explorer-green) ![tag : location-aware](https://img.shields.io/badge/location--aware-yellow) ![tag : itinerary](https://img.shields.io/badge/itinerary-teal) ![tag : hackathon](https://img.shields.io/badge/hackathon-red)

**Domain:** Travel / Exploration / Smart Tourism  
**Agent Type:** AI Agent for Popular Attractions Discovery  
**Status:** Public and Live on Agentverse

---

## 🧭 Overview

`ExploreAgent` is an intelligent autonomous agent that helps users explore the most popular tourist attractions in any location using the **Google Places API**. It is designed to be used in travel planning systems, trip advisors, or itinerary builders within the **Agentverse ecosystem**.

Given a location name, the agent returns:
- Top 10 popular places
- Name, address, rating, and total user reviews
- Photo preview link
- Geo-coordinates (latitude & longitude)
- Tags/Types for each place (e.g., museum, park, etc.)

---

## Input Format

Send an `ExploreRequest` model:
```python
class ExploreRequest(BaseModel):
    location: str       # Name of the city or location
    api_key: str        # Your Google Places API key
```

### Example Input
```python
ExploreRequest(
    location="Boston",
    api_key="<YOUR_GOOGLE_API_KEY>"
)
```

---

## Output Format

Receives an `ExploreResponse` model:
```python
class Attraction(BaseModel):
    name: str
    address: str
    rating: float
    total_ratings: int
    photo_url: Optional[str]
    location: dict
    types: list[str]

class ExploreResponse(BaseModel):
    location: str
    attractions: list[Attraction]
```

### ✅ Example Output
```json
{
  "location": "Boston",
  "attractions": [
    {
      "name": "Public Garden",
      "address": "Boston, MA 02116, United States",
      "rating": 4.8,
      "total_ratings": 17410,
      "photo_url": "https://maps.googleapis.com/maps/api/place/photo?...",
      "location": {
        "lat": 42.3540639,
        "lng": -71.0700921
      },
      "types": ["tourist_attraction", "park", "point_of_interest", "establishment"]
    }
  ]
}
```

---

## 🚀 How to Use This Agent

### 1. Install Requirements
```bash
pip install uagents requests python-dotenv
```

---

### 2. Get Your Google Places API Key
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable the **Places API**
- Generate an API Key under **Credentials**
- Store it in a `.env` file:
```
GOOGLE_API_KEY=your_api_key_here
```


### 3. Create a Test Agent to Interact

```python
import asyncio
from uagents import Agent, Context, Protocol
from pydantic import BaseModel
import json 
from typing import Optional, List

class ExploreRequest(BaseModel):
    location: str
    api_key: str

class Attraction(BaseModel):
    name: str
    address: str
    rating: float
    total_ratings: int
    photo_url: Optional[str]
    location: dict
    types: List[str]

class ExploreResponse(BaseModel):
    location: str
    attractions: List[Attraction]

# ----------- Test Agent Setup -----------
test_agent = Agent(name="TestExploreSender")
protocol = Protocol(name="ExploreProtocol")

EXPLORE_AGENT_ADDRESS = "agent1q0vj2jq0xe05zdukwnesaqvey0sve99gahvfp452yrlemtng8axzvcf8hq0"

@protocol.on_message(model=ExploreResponse)
async def handle_response(ctx: Context, sender: str, msg: ExploreResponse):
    # Convert Pydantic model to JSON
    response_json = msg.model_dump()  
    ctx.logger.info("Received full ExploreResponse JSON:")
    ctx.logger.info(json.dumps(response_json, indent=2))

test_agent.include(protocol)

@test_agent.on_event("startup")
async def send_request(ctx: Context):
    ctx.logger.info("Sending ExploreRequest to ExploreAgent")
    msg = ExploreRequest(
        location="Boston",
        api_key="YOUR-API_KEY"
    )
    await ctx.send(EXPLORE_AGENT_ADDRESS, msg)

if __name__ == "__main__":
    test_agent.run()
```

---

## Use Cases

- AI Travel Agents and Trip Planners  
- Itinerary Building and Exploration Bots  
- Voice Assistants for Tourism  
- Mobility & Navigation Helpers  
- Student / Professor Travel Recommendation Agents  

---

## Notes

- Ensure your API key has Places API access.  
- The agent fetches **top 10 results** using text search for simplicity.  
- Handles partial failures gracefully and provides fallback logs.  

---

## Tested With

- Agentverse Platform by Fetch.ai  
- Google Places API  
- uAgents SDK  
- Localhost + `.env` setup  

---

## Source Code

[GitHub Project](https://github.com/rohit180497/Agentverse-Hackathon/tree/main/agents/)

---

## Credits

Developed for the **Fetch.ai Global AI Agents League Hackathon**  
Built by: [Rohit Kosamkar](https://github.com/rohit180497)  

Have suggestions or want to extend this agent?  
Feel free to contribute, fork, or submit a PR!