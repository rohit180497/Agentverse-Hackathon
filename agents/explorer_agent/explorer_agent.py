import os
import requests
from uagents import Agent, Context, Protocol
from pydantic import BaseModel
from typing import Optional

# ----------- Models -----------
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
    types: list[str]

class ExploreResponse(BaseModel):
    location: str
    attractions: list[Attraction]

# ----------- Agent Setup -----------
explore_agent = Agent(name="ExploreAgent")
protocol = Protocol(name="ExploreProtocol")

@protocol.on_message(model=ExploreRequest)
async def handle_explore(ctx: Context, sender: str, msg: ExploreRequest):
    ctx.logger.info(f"Exploring popular places in {msg.location}")
    try:
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        params = {
            "query": f"top attractions in {msg.location}",
            "key": msg.api_key
        }
        response = requests.get(url, params=params)
        data = response.json()

        attractions = []
        for place in data.get("results", [])[:10]:
            photo_url = None
            if "photos" in place:
                photo_reference = place["photos"][0]["photo_reference"]
                photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={msg.api_key}"

            attraction = Attraction(
                name=place.get("name"),
                address=place.get("formatted_address"),
                rating=place.get("rating"),
                total_ratings=place.get("user_ratings_total"),
                photo_url=photo_url,
                location=place["geometry"]["location"],
                types=place.get("types", [])
            )
            attractions.append(attraction)

        await ctx.send(sender, ExploreResponse(location=msg.location, attractions=attractions))

    except Exception as e:
        ctx.logger.error(f"Error fetching attractions: {e}")
        await ctx.send(sender, {"error": str(e)})

explore_agent.include(protocol)

@explore_agent.on_event("startup")
async def announce(ctx: Context):
    ctx.logger.info(f"ExploreAgent is live at address: {ctx.agent.address}")

if __name__ == "__main__":
    explore_agent.run()
