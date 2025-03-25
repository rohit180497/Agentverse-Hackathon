from uagents import Agent, Context, Protocol
from pydantic import BaseModel
from uagents import Agent, Context, Protocol
import asyncio

class RouteRequest(BaseModel):
    source: str
    destination: str
    api_key:str

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

ROUTE_AGENT_ADDRESS = "agent1qgwm7xuy5nyrt3lxpadzh7hazsethsmarwhvr6pfhchdaz8k5f4g5jfn3yh"

# Define the agent and attach a mailbox
agent = Agent(
    name="CloudTestAgent",
    seed="cloud-test-seed",
    endpoint=["https://agentverse-relay.uagents.com"],  # no localhost
    mailbox=True  # ✅ enable mailbox
)

#fund_agent_if_low(agent.wallet.address) 

route_protocol = Protocol("RouteProtocol")

message_queue = asyncio.Queue()

@agent.on_event("startup")
async def process_queue(ctx: Context):
    ctx.logger.info("Agent started. Listening for queued messages...")
    while True:
        msg = await message_queue.get()
        await ctx.send(ROUTE_AGENT_ADDRESS, msg)
        ctx.logger.info("Sent RouteRequest to RouteAgent")

@route_protocol.on_message(model=RouteRequest)
async def send_to_route_agent(ctx: Context, sender: str, msg: RouteRequest):
    await ctx.send(ROUTE_AGENT_ADDRESS, msg)
    ctx.logger.info("Forwarded RouteRequest to RouteAgent")

@agent.on_message(model=RouteResponse)
async def handle_response(ctx: Context, sender: str, msg: RouteResponse):
    ctx.logger.info("Received route response:")
    ctx.logger.info(msg.model_dump_json(indent=2))

agent.include(route_protocol)