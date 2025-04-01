from uagents import Agent, Context, Model
from typing import List, Optional
from dotenv import load_dotenv
import os

load_dotenv()

# -------------------- Models --------------------
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

# -------------------- Config --------------------
FOOD_AGENT_ADDRESS = "agent1qtcaxwkqgs0kgfmtsr90j9lcpjk3a7t3mtkf9sty8a07gdr0el6sjgkzy60" 
GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"  
if not GOOGLE_MAPS_API_KEY:
    raise EnvironmentError("Set GOOGLE_MAPS_API_KEY in your .env file")

# -------------------- Test Agent --------------------
test_food_agent = Agent(
    name="FoodTestAgent",
    port=8013,
    endpoint="http://127.0.0.1:8013/submit"
)

@test_food_agent.on_event("startup")
async def send_food_query(ctx: Context):
    ctx.logger.info("🍽️ Sending food discovery request to FoodExplorerAgent...")
    await ctx.send(FOOD_AGENT_ADDRESS, FoodRequest(
        location="Boston",
        api_key=GOOGLE_MAPS_API_KEY
    ))

@test_food_agent.on_message(model=FoodResponse)
async def handle_food_response(ctx: Context, sender: str, msg: FoodResponse):
    ctx.logger.info(f"Top restaurants in {msg.location}:")
    for i, rest in enumerate(msg.top_restaurants, 1):
        ctx.logger.info(f"{i}. {rest.name} |  {rest.rating} ({rest.total_ratings} reviews)")
        ctx.logger.info(f"{rest.address}")
        if rest.photo_url:
            ctx.logger.info(f"Photo: {rest.photo_url}")

if __name__ == "__main__":
    test_food_agent.run()
