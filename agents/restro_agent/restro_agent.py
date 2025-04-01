import os
import requests
from dotenv import load_dotenv
from uagents import Agent, Context, Protocol, Model
from typing import List, Optional

# Load credentials from .env
load_dotenv()
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# ----------------- Models -----------------
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

# ----------------- Agent Setup -----------------
food_agent = Agent(
    name="FoodExplorerAgent",
    seed="foodeeagent123",
    endpoint="http://127.0.0.1:8020/submit",
    port=8020,
    # public=True
)

food_protocol = Protocol(name="FoodExplorerProtocol")

# --------------- Handler -----------------
@food_protocol.on_message(model=FoodRequest)
async def handle_food_request(ctx: Context, sender: str, msg: FoodRequest):
    ctx.logger.info(f"🍽️ Finding top restaurants in {msg.location}")

    try:
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        params = {
            "query": f"best restaurants in {msg.location}",
            "type": "restaurant",
            "key": msg.api_key
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        restaurants = []
        for place in data.get("results", [])[:10]:
            photo_url = None
            if "photos" in place:
                ref = place["photos"][0]["photo_reference"]
                photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={ref}&key={msg.api_key}"

            restaurant = Restaurant(
                name=place.get("name"),
                address=place.get("formatted_address"),
                rating=place.get("rating", 0.0),
                total_ratings=place.get("user_ratings_total", 0),
                types=place.get("types", []),
                photo_url=photo_url
            )
            restaurants.append(restaurant)

        await ctx.send(sender, FoodResponse(location=msg.location, top_restaurants=restaurants))

    except Exception as e:
        ctx.logger.error(f"🍽️ FoodExplorerAgent error: {e}")
        await ctx.send(sender, {"error": str(e)})

# Register Protocol
food_agent.include(food_protocol)

@food_agent.on_event("startup")
async def announce(ctx: Context):
    ctx.logger.info(f"🍴 FoodExplorerAgent is live at address: {ctx.agent.address}")

if __name__ == "__main__":
    food_agent.run()
