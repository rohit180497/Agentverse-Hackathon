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

agent = Agent(name="CloudTestAgent")

@agent.on_event("startup")
async def send_request(ctx: Context):
    await ctx.send(ROUTE_AGENT_ADDRESS, RouteRequest(
        source="Boston, MA",
        destination="New York, NY",
        api_key="YourAPIKey"
    ))
    ctx.logger.info("📤 Sent RouteRequest to RouteAgent")

@agent.on_message(model=RouteResponse)
async def handle_response(ctx: Context, sender: str, msg: RouteResponse):
    ctx.logger.info("Received route response:")
    ctx.logger.info(msg.model_dump_json(indent=2))

if __name__ == "__main__":
    agent.run()
