# 🍽️ Food Explorer Agent

![tag : innovation-lab](https://img.shields.io/badge/innovation--lab-3D8BD3) ![tag : travel](https://img.shields.io/badge/travel-orange) ![tag : food](https://img.shields.io/badge/food-red) ![tag : restaurants](https://img.shields.io/badge/restaurants-yellow) ![tag : google-places](https://img.shields.io/badge/google--places-lightgrey) ![tag : agentverse](https://img.shields.io/badge/agentverse-blue)

**Domain:** Travel / Food Discovery  
**Agent Type:** AI Agent for Top Restaurant Suggestions  
**Status:** Public and Live on Agentverse

---

## Overview

The **FoodExplorerAgent** helps users discover the top-rated restaurants in any given city using the **Google Places API**.

This agent returns:
- Name and address of the restaurant
- Star rating and total reviews
- Cuisine types
- Google-hosted photo (if available)

Great for:
- Planning trips
- Local discovery
- Recommender systems in travel planners

---

## 📩 Input Format

Send a `FoodRequest` model:

```python
class FoodRequest(Model):
    location: str         # City or region (e.g., "Boston")
    api_key: str          # Your Google Maps API key
```

### Example Input
```python
FoodRequest(
    location="Boston",
    api_key="<YOUR_GOOGLE_MAPS_API_KEY>"
)
```

---

## 📦 Output Format

Agent responds with a `FoodResponse` model:

```python
class FoodResponse(Model):
    location: str
    top_restaurants: List[Restaurant]
```

Each restaurant contains:
```python
class Restaurant(Model):
    name: str
    address: str
    rating: float
    total_ratings: int
    types: List[str]
    photo_url: Optional[str]
```

---

## 🧪 Sample Output

```
1. The Salty Pig | 4.5 (1788 reviews)
   📍 130 Dartmouth St, Boston, MA
   🖼️ https://maps.googleapis.com/maps/api/place/photo?photoreference=...

2. Mamma Maria | 4.7 (1709 reviews)
   📍 3 N Square, Boston, MA
   🖼️ https://maps.googleapis.com/maps/api/place/photo?photoreference=...

... up to 10 restaurants returned.
```

---

## 🧰 How to Use

### 1. 📦 Install Dependencies

```bash
pip install uagents requests python-dotenv
```

### 2. 🔑 Get a Google Maps API Key

- Visit: [https://console.cloud.google.com/google/maps-apis](https://console.cloud.google.com/google/maps-apis)
- Enable **Places API** and **Places Photo API**
- Create a new API key and store it in `.env`:
```env
GOOGLE_MAPS_API_KEY=your_real_api_key_here
```

---

## 🤖 Create a Blank Agent to Test

Here’s a minimal example using `uagents`:

```python
from uagents import Agent, Context, Model
from typing import List, Optional
from dotenv import load_dotenv
import os

load_dotenv()

class FoodRequest(Model):
    location: str
    api_key: str

class Restaurant(Model):
    name: str
    address: str
    rating: float
    total_ratings: int
    types: List[str]
    photo_url: Optional[str]

class FoodResponse(Model):
    location: str
    top_restaurants: List[Restaurant]

FOOD_AGENT_ADDRESS = "agent1qtcaxwkqgs0kgfmtsr90j9lcpjk3a7t3mtkf9sty8a07gdr0el6sjgkzy60"
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

test_agent = Agent(name="FoodTestAgent", port=8013, endpoint="http://127.0.0.1:8013/submit")

@test_agent.on_event("startup")
async def send_food_query(ctx: Context):
    ctx.logger.info("🍽️ Requesting restaurant data...")
    await ctx.send(FOOD_AGENT_ADDRESS, FoodRequest(
        location="Boston",
        api_key=GOOGLE_MAPS_API_KEY
    ))

@test_agent.on_message(model=FoodResponse)
async def handle_response(ctx: Context, sender: str, msg: FoodResponse):
    ctx.logger.info(f"📍 Top restaurants in {msg.location}:")
    for i, rest in enumerate(msg.top_restaurants, 1):
        ctx.logger.info(f"{i}. {rest.name} | ⭐ {rest.rating} ({rest.total_ratings} reviews)")
        ctx.logger.info(f"   📍 {rest.address}")
        if rest.photo_url:
            ctx.logger.info(f"   🖼️ Photo: {rest.photo_url}")

if __name__ == "__main__":
    test_agent.run()
```

---

## 📎 Notes

- Ensure the agent is hosted and address is public (Agentverse-hosted or your own server).
- The agent limits results to top 10 restaurants from Google Places.
- Uses `textsearch` endpoint + photo proxy from Google.

---

## Built With

- `uagents` Framework (Fetch.ai)
- Google Places API
- Python, Pydantic, Requests

---

## 🔗 Source Code

[GitHub Repository](https://github.com/rohit180497/Agentverse-Hackathon/tree/main/agents/food_explorer)

---

## 🙌 Credits

Built by [Rohit Kosamkar](https://github.com/rohit180497)  
As part of the **Fetch.ai Global AI Agents League Hackathon**

---

Feel free to fork, improve, and deploy this agent!