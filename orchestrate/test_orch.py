from uagents import Agent, Bureau, Context
from orchestrator import orchestrator, FrontendRequest

# Frontend Simulation Agent
frontend = Agent(name="FrontendTestAgent")

@frontend.on_event("startup")
async def send_request(ctx: Context):
    ctx.logger.info("🧪 Sending FrontendRequest to Orchestrator")
    await ctx.send(orchestrator.address, FrontendRequest(
        source_city="Boston, MA",
        destination_city="New York, NY",
        travel_start_date="2025-04-15",
        travel_end_date="2025-04-20",
        no_of_people=2
    ))

# Bureau setup
bureau = Bureau()
bureau.add(frontend)
bureau.add(orchestrator)

if __name__ == "__main__":
    bureau.run()
