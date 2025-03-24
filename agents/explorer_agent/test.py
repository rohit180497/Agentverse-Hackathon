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
